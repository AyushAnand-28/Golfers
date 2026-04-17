-- Golfers Platform Database Schema Setup

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles Table (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  name text,
  avatar_url text,
  role text default 'user' check (role in ('user', 'admin')),
  charity_id uuid, -- references charities(id) once created
  charity_percentage integer default 10 check (charity_percentage >= 10 and charity_percentage <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS) for profiles
alter table public.profiles enable row level security;
create policy "Public profiles are viewable by everyone." on profiles for select using (true);
create policy "Users can insert their own profile." on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile." on profiles for update using (auth.uid() = id);

-- 2. Charities Table
create table public.charities (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  description text,
  image_url text,
  category text,
  featured boolean default false,
  raised text default '£0',
  website text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.charities enable row level security;
create policy "Charities are viewable by everyone." on charities for select using (true);
-- Only admins can modify charities (RLS omitted for brevity, assuming backend bypass via service_role)

-- Add foreign key reference back to profiles
alter table public.profiles add constraint fk_charity foreign key (charity_id) references charities(id);

-- 3. Subscriptions Table
create table public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  plan text check (plan in ('monthly', 'yearly')),
  status text check (status in ('active', 'canceled', 'past_due', 'unpaid')),
  stripe_subscription_id text,
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.subscriptions enable row level security;
create policy "Users can view own subscriptions." on subscriptions for select using (auth.uid() = user_id);

-- 4. Scores Table (Rolling 5 scores)
create table public.scores (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null check (score >= 1 and score <= 45),
  date date not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (user_id, date) -- Prevents duplicate score entries per day
);

alter table public.scores enable row level security;
create policy "Users can view own scores." on scores for select using (auth.uid() = user_id);
create policy "Users can insert own scores." on scores for insert with check (auth.uid() = user_id);
create policy "Users can delete own scores." on scores for delete using (auth.uid() = user_id);

-- Trigger Function to keep only 5 rolling scores 
create or replace function limit_user_scores()
returns trigger as $$
begin
  delete from scores
  where user_id = new.user_id
  and id in (
    select id from scores
    where user_id = new.user_id
    order by date desc
    offset 5
  );
  return new;
end;
$$ language plpgsql;

create trigger trigger_limit_scores
after insert on scores
for each row execute function limit_user_scores();

-- 5. Draws Table
create table public.draws (
  id uuid default uuid_generate_v4() primary key,
  month integer not null,
  year integer not null,
  status text default 'pending' check (status in ('pending', 'simulated', 'published')),
  draw_type text default 'random' check (draw_type in ('random', 'algorithmic')),
  winning_numbers integer[],
  jackpot_carried boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. Prize Pools Table
create table public.prize_pools (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references public.draws(id) on delete cascade not null,
  total_pool numeric,
  five_match_allocation numeric, -- 40%
  four_match_allocation numeric, -- 35%
  three_match_allocation numeric, -- 25%
  jackpot_rollover numeric default 0
);

-- 7. Winners Table
create table public.winners (
  id uuid default uuid_generate_v4() primary key,
  draw_id uuid references public.draws(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  match_type integer check (match_type in (3, 4, 5)),
  prize_amount numeric,
  status text default 'pending' check (status in ('pending', 'verified', 'paid')),
  proof_url text, -- For Club Screenshot upload
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Insert dummy charities so the frontend doesn't crash on empty
insert into public.charities (name, description, category, featured, raised) values 
('Children First Foundation', 'Providing education and healthcare to underprivileged children worldwide.', 'Children', true, '£42,800'),
('Green Earth Initiative', 'Fighting deforestation and restoring ecosystems.', 'Environment', false, '£28,500'),
('Veterans Support Network', 'Mental health support for military veterans transitioning to civilian life.', 'Veterans', true, '£36,200');

