require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 3001;

// Use Service Role key for backend operations (bypasses RLS limits)
const supabase = createClient(
  process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_KEY || 'placeholder'
);

app.use(cors({
  origin: process.env.CLIENT_URL || '*'
}));
app.use(express.json());

// Add a simple healthcheck route
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'golfers-api' });
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'placeholder_id',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret',
});

/* ==========================================
   RAZORPAY SUBSCRIPTION ENDPOINTS
   ========================================== */

// Create Razorpay Order
app.post('/api/create-razorpay-order', async (req, res) => {
  try {
    const { plan, userId, email } = req.body;
    
    // Generate pricing amount in Paise (Razorpay expects smallest currency unit)
    const amount = plan === 'yearly' ? 9590 * 100 : 999 * 100;

    const options = {
      amount,
      currency: "INR",
      receipt: `receipt_${userId}_${Math.floor(Date.now() / 1000)}`
    };

    const order = await razorpay.orders.create(options);
    res.json({ order, key_id: process.env.RAZORPAY_KEY_ID });
  } catch (error) {
    console.error('Razorpay Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/verify-razorpay-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, userId } = req.body;
    
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET || 'placeholder_secret')
                            .update(sign.toString())
                            .digest("hex");
                            
    if (razorpay_signature === expectedSign) {
       console.log(`Payment successful for user: ${userId}`);
       // TODO: Update Supabase subscriptions table here
       res.json({ success: true, message: "Payment verified successfully" });
    } else {
       res.status(400).json({ success: false, message: "Invalid signature" });
    }
  } catch (error) {
    console.error('Verification Error:', error);
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   DRAW ENGINE LOGIC
   ========================================== */

// Admin trigger to run the monthly draw simulation
app.post('/api/admin/draw/simulate', async (req, res) => {
  try {
    const { month, year, type } = req.body;
    console.log(`Starting mock simulation for ${month}/${year}`);

    // In Production: 
    // const { data: activeSubs } = await supabase.from('subscriptions').select('user_id').eq('status', 'active');
    // const { data: userScores } = await supabase.from('scores').select('*').in('user_id', activeSubs.map(s => s.user_id));
    
    // For algorithm demonstration: Create dummy dataset
    const TICKET_PRICE = 999;
    const CHARITY_PERCENTAGE = 0.10; // Averaged for simplicity here
    const PLATFORM_FEE = 0.15;
    const PRIZE_POOL_PERCENTAGE = 1 - (CHARITY_PERCENTAGE + PLATFORM_FEE); // 75% goes to prize pool

    const totalSubscribers = 1500; // Mock 1500 subs
    const grossRevenue = totalSubscribers * TICKET_PRICE;
    const generatedPrizePool = grossRevenue * PRIZE_POOL_PERCENTAGE; // Roughly ₹11,23,800
    
    // Generate 5 winning numbers (1-45)
    let winningNumbers = [];
    while(winningNumbers.length < 5){
      let r = Math.floor(Math.random() * 45) + 1;
      if(winningNumbers.indexOf(r) === -1) winningNumbers.push(r);
    }

    // Distribute allocations (per PRD)
    // 40% to 5-matches, 35% to 4-matches, 25% to 3-matches
    const pool5 = generatedPrizePool * 0.40;
    const pool4 = generatedPrizePool * 0.35;
    const pool3 = generatedPrizePool * 0.25;

    // Simulate match counting
    let matches5 = 0; // Extremely rare
    let matches4 = Math.floor(Math.random() * 5); // 0-4 users
    let matches3 = Math.floor(Math.random() * 50) + 10; // 10-60 users

    // Calculate individual payouts
    const payout5 = matches5 > 0 ? (pool5 / matches5).toFixed(2) : 0;
    const payout4 = matches4 > 0 ? (pool4 / matches4).toFixed(2) : 0;
    const payout3 = matches3 > 0 ? (pool3 / matches3).toFixed(2) : 0;
    
    // If no 5 matches, the logic rolls over to the next month's jackpot
    const jackpotRolloverAmount = matches5 === 0 ? pool5 : 0;

    // Output formatted simulation result
    res.json({ 
      message: 'Simulation completed mapping logic',
      status: 'simulated',
      draw: {
        winningNumbers: winningNumbers.sort((a,b)=>a-b),
        financials: {
          grossRevenue: `₹${grossRevenue.toFixed(2)}`,
          prizePoolGenerated: `₹${generatedPrizePool.toFixed(2)}`,
        },
        distribution: {
          threeMatch: { winners: matches3, totalPool: `₹${pool3.toFixed(2)}`, payoutPerWinner: `₹${payout3}` },
          fourMatch: { winners: matches4, totalPool: `₹${pool4.toFixed(2)}`, payoutPerWinner: `₹${payout4}` },
          fiveMatch: { winners: matches5, totalPool: `₹${pool5.toFixed(2)}`, payoutPerWinner: `₹${payout5}` },
        },
        rollover: {
          triggered: matches5 === 0,
          amountRolledOverToNextMonth: `₹${jackpotRolloverAmount.toFixed(2)}`
        }
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Admin trigger to publish simulated draw
app.post('/api/admin/draw/publish', async (req, res) => {
  try {
    const { drawId } = req.body;
    
    // Update draws status to 'published'
    // Send email notifications to winners
    
    res.json({ message: 'Draw published and emails sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* ==========================================
   WINNER VERIFICATION
   ========================================== */

app.post('/api/admin/winners/verify', async (req, res) => {
  try {
    const { winnerId, status } = req.body; // status: 'verified' or 'rejected'
    
    // Update winners table status
    // If verified, proceed to initiate payment via Stripe Connect or manual payout log
    
    res.json({ message: `Winner ${status}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
