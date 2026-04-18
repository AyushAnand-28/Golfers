import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Heart, Trophy, TrendingUp, Star, CheckCircle, ChevronRight, Zap, Shield, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'

const CHARITIES_MOCK = [
  { id: 1, name: 'Children First Foundation', description: 'Providing education and healthcare to underprivileged children worldwide.', raised: '₹42,80,000', image: null, category: 'Children' },
  { id: 2, name: 'Green Earth Initiative', description: 'Planting trees and restoring ecosystems damaged by climate change.', raised: '₹28,50,000', image: null, category: 'Environment' },
  { id: 3, name: 'Veterans Support Network', description: 'Mental health and rehabilitation support for military veterans.', raised: '₹36,20,000', image: null, category: 'Veterans' },
]

const HOW_IT_WORKS = [
  { step: '01', icon: '🏌️', title: 'Subscribe & Select', desc: 'Choose a monthly or yearly plan and pick a charity you care about. A portion of every subscription goes directly to your chosen cause.' },
  { step: '02', icon: '📊', title: 'Enter Your Scores', desc: 'Log your last 5 golf scores in Stableford format after each round. Your scores are the key to your draw entries each month.' },
  { step: '03', icon: '🎯', title: 'Enter Every Draw', desc: 'Each month, your score history automatically enters you into the draw. Match 3, 4, or 5 numbers to win your share of the prize pool.' },
  { step: '04', icon: '🏆', title: 'Win & Give', desc: 'Winners are announced monthly. Verify your win by uploading your golf club screenshot and get paid — while your charity receives their contribution.' },
]

const FEATURES = [
  { icon: <Shield size={24} />, title: 'Secure Payments', desc: 'Stripe-powered subscriptions with bank-level security and PCI compliance.' },
  { icon: <Globe size={24} />, title: 'Real Charity Impact', desc: 'Transparent contribution tracking. See exactly how much your subscription is doing good.' },
  { icon: <Zap size={24} />, title: 'Monthly Draws', desc: 'Automated draw engine ensures fair, transparent results every single month.' },
  { icon: <TrendingUp size={24} />, title: 'Growing Jackpot', desc: 'Unclaimed jackpots roll over, making each month\'s 5-match prize even bigger.' },
]

const STATS = [
  { value: '₹4.8 Crores+', label: 'Prize Pool Distributed', color: 'var(--color-gold)' },
  { value: '12,400+', label: 'Active Members', color: 'var(--color-emerald)' },
  { value: '₹1.9 Crores+', label: 'Donated to Charities', color: '#60a5fa' },
  { value: '47', label: 'Charities Supported', color: '#c084fc' },
]

export default function LandingPage() {
  const [featuredCharity, setFeaturedCharity] = useState(CHARITIES_MOCK[0])
  const [charities, setCharities] = useState(CHARITIES_MOCK)
  const heroRef = useRef(null)

  useEffect(() => {
    document.title = 'GreenHeart — Golf with Purpose'
    // Try to fetch from Supabase
    supabase.from('charities').select('*').eq('featured', true).single()
      .then(({ data }) => { if (data) setFeaturedCharity(data) })
    supabase.from('charities').select('*').limit(3)
      .then(({ data }) => { if (data && data.length) setCharities(data) })
  }, [])

  return (
    <div>
      {/* ===== HERO ===== */}
      <section style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        padding: '120px 0 80px'
      }}>
        {/* Animated background */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--gradient-hero)',
          zIndex: 0
        }} />
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          backgroundImage: `
            radial-gradient(ellipse 60% 50% at 50% -20%, rgba(16,185,129,0.12) 0%, transparent 70%),
            radial-gradient(ellipse 40% 30% at 80% 60%, rgba(37,99,235,0.08) 0%, transparent 60%)
          `
        }} />
        
        {/* Floating orbs */}
        <div style={{
          position: 'absolute', top: '15%', right: '10%', width: 400, height: 400,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(16,185,129,0.08) 0%, transparent 70%)',
          zIndex: 0, animation: 'float 6s ease-in-out infinite'
        }} />
        <div style={{
          position: 'absolute', bottom: '20%', left: '5%', width: 300, height: 300,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,158,11,0.06) 0%, transparent 70%)',
          zIndex: 0, animation: 'float 8s ease-in-out infinite reverse'
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
            {/* Tag */}
            <div className="animate-fade-up" style={{ marginBottom: 'var(--space-6)' }}>
              <span className="section-tag">
                <Heart size={12} style={{ display: 'inline', marginRight: 4 }} />
                Golf with purpose
              </span>
            </div>

            {/* Headline */}
            <h1 className="animate-fade-up animate-delay-1" style={{ marginBottom: 'var(--space-6)' }}>
              Score Big.{' '}
              <span className="gradient-text">Give More.</span>{' '}
              Win Together.
            </h1>

            <p className="animate-fade-up animate-delay-2" style={{
              fontSize: '1.25rem', color: 'var(--color-text-secondary)',
              maxWidth: 580, margin: '0 auto var(--space-10)',
              lineHeight: 1.7
            }}>
              The golf subscription platform that turns your Stableford scores into monthly prize draw entries — while funding charities that matter.
            </p>

            {/* CTAs */}
            <div className="animate-fade-up animate-delay-3" style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap', marginBottom: 'var(--space-12)' }}>
              <Link to="/signup" className="btn btn-primary btn-lg">
                Start for ₹999/month <ArrowRight size={18} />
              </Link>
              <Link to="/how-it-works" className="btn btn-secondary btn-lg">
                See How It Works
              </Link>
            </div>

            {/* Trust badges */}
            <div className="animate-fade-up animate-delay-4" style={{ display: 'flex', gap: 'var(--space-8)', justifyContent: 'center', flexWrap: 'wrap' }}>
              {[
                { icon: <CheckCircle size={16} />, text: 'No hidden fees' },
                { icon: <CheckCircle size={16} />, text: 'Cancel anytime' },
                { icon: <CheckCircle size={16} />, text: 'Stripe-secured' },
              ].map((b, i) => (
                <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>
                  <span style={{ color: 'var(--color-emerald)' }}>{b.icon}</span>
                  {b.text}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)',
          animation: 'float 2s ease-in-out infinite', opacity: 0.4
        }}>
          <div style={{ width: 24, height: 40, border: '2px solid var(--color-text-muted)', borderRadius: 12, display: 'flex', justifyContent: 'center', paddingTop: 6 }}>
            <div style={{ width: 4, height: 8, background: 'var(--color-text-muted)', borderRadius: 2, animation: 'float 2s ease-in-out infinite' }} />
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section style={{ padding: 'var(--space-12) 0', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)', background: 'var(--color-bg-secondary)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-6)' }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 'var(--space-4)' }}>
                <div style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 800, color: stat.color, fontFamily: 'var(--font-primary)', lineHeight: 1 }}>
                  {stat.value}
                </div>
                <div style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Simple process</span>
            <h2 style={{ marginTop: 'var(--space-4)' }}>How GreenHeart Works</h2>
            <p style={{ maxWidth: 560, margin: '16px auto 0', fontSize: '1.05rem' }}>
              Four simple steps that put your golf scores to work — for your wallet and for the world.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)' }}>
            {HOW_IT_WORKS.map((step, i) => (
              <div key={i} className="glass-card" style={{ padding: 'var(--space-8)', position: 'relative', overflow: 'hidden' }}>
                <div style={{
                  position: 'absolute', top: 0, right: 0,
                  fontSize: '7rem', fontWeight: 900, lineHeight: 1,
                  color: 'rgba(255,255,255,0.02)', userSelect: 'none',
                  fontFamily: 'var(--font-primary)'
                }}>{step.step}</div>
                <div style={{ position: 'relative', zIndex: 1 }}>
                  <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-4)', lineHeight: 1 }}>{step.icon}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-emerald)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-2)' }}>
                    Step {step.step}
                  </div>
                  <h4 style={{ marginBottom: 'var(--space-3)', fontFamily: 'var(--font-primary)' }}>{step.title}</h4>
                  <p style={{ color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.9375rem' }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRIZE POOL SECTION ===== */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-16)', alignItems: 'center' }}>
            <div>
              <span className="section-tag">Prize Structure</span>
              <h2 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
                Real Money,<br /><span className="gradient-text-gold">Every Month</span>
              </h2>
              <p style={{ marginBottom: 'var(--space-8)', fontSize: '1.05rem' }}>
                Every subscription contributes to the monthly prize pool. Match 3, 4, or all 5 numbers from your scores to win your share.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
                {[
                  { label: '5-Number Match', pct: '40%', type: 'JACKPOT', rollover: true, color: 'var(--color-gold)' },
                  { label: '4-Number Match', pct: '35%', type: '4-MATCH', rollover: false, color: '#60a5fa' },
                  { label: '3-Number Match', pct: '25%', type: '3-MATCH', rollover: false, color: 'var(--color-emerald)' },
                ].map((tier, i) => (
                  <div key={i} style={{
                    display: 'flex', alignItems: 'center', gap: 'var(--space-4)',
                    padding: 'var(--space-4)', borderRadius: 'var(--radius-lg)',
                    background: 'var(--color-bg-card)', border: '1px solid var(--color-border)'
                  }}>
                    <div style={{
                      width: 48, height: 48, borderRadius: 'var(--radius-md)',
                      background: `${tier.color}20`, border: `1px solid ${tier.color}40`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 900, color: tier.color, fontSize: '1rem'
                    }}>
                      {tier.pct}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>{tier.label}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                        {tier.rollover ? '🔄 Jackpot rolls over if unclaimed' : 'Split equally among all winners'}
                      </div>
                    </div>
                    <span className={`badge ${i === 0 ? 'badge-warning' : i === 1 ? 'badge-info' : 'badge-success'}`}>
                      {tier.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{
                background: 'var(--color-bg-card)', border: '1px solid var(--color-border-hover)',
                borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)',
                boxShadow: 'var(--shadow-emerald)', animation: 'pulse-glow 4s ease-in-out infinite'
              }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 'var(--space-4)' }}>
                  Current Jackpot
                </div>
                <div style={{ fontSize: '4rem', fontWeight: 900, background: 'var(--gradient-gold)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', lineHeight: 1, fontFamily: 'var(--font-primary)' }}>
                  ₹24,600
                </div>
                <div style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)', fontSize: '0.9rem' }}>May 2025 Draw</div>
                <div style={{ height: 1, background: 'var(--color-border)', margin: 'var(--space-6) 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#60a5fa', fontSize: '1.25rem' }}>₹21,42,000</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>4-Match Pool</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '1.25rem' }}>₹15,30,000</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>3-Match Pool</div>
                  </div>
                </div>
                <div style={{ marginTop: 'var(--space-6)' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-emerald)', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
                    Next draw: May 31, 2025
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FEATURED CHARITY ===== */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">
              <Heart size={12} style={{ display: 'inline', marginRight: 4 }} /> Charity Impact
            </span>
            <h2 style={{ marginTop: 'var(--space-4)' }}>Your Play, Their Future</h2>
            <p style={{ maxWidth: 560, margin: '16px auto 0', fontSize: '1.05rem' }}>
              10% of every subscription goes directly to your chosen charity. You decide where the impact lands.
            </p>
          </div>

          {/* Featured charity spotlight */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.08) 0%, rgba(37,99,235,0.06) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
            borderRadius: 'var(--radius-xl)', padding: 'var(--space-10)',
            marginBottom: 'var(--space-10)', position: 'relative', overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: 16, right: 24 }}>
              <span className="badge badge-success"><Star size={10} /> Featured Charity</span>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-10)', alignItems: 'center' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ width: 56, height: 56, borderRadius: 'var(--radius-lg)', background: 'var(--gradient-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>💚</div>
                  <div>
                    <h4 style={{ fontFamily: 'var(--font-primary)', fontSize: '1.25rem' }}>{featuredCharity.name}</h4>
                    <span className="badge badge-neutral" style={{ marginTop: 4 }}>{featuredCharity.category || 'Global'}</span>
                  </div>
                </div>
                <p style={{ fontSize: '1rem', lineHeight: 1.7, marginBottom: 'var(--space-6)' }}>{featuredCharity.description}</p>
                <div style={{ display: 'flex', gap: 'var(--space-6)', marginBottom: 'var(--space-6)' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '1.5rem' }}>{featuredCharity.raised || '₹42,80,000'}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>Raised this year</div>
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--color-text-primary)', fontSize: '1.5rem' }}>1,240</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>GreenHeart members</div>
                  </div>
                </div>
                <Link to="/charities" className="btn btn-primary">
                  Support This Charity <ArrowRight size={16} />
                </Link>
              </div>
              <div style={{
                background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-lg)', padding: 'var(--space-8)', textAlign: 'center'
              }}>
                <div style={{ fontSize: '4rem', marginBottom: 'var(--space-4)' }}>🌍</div>
                <h5 style={{ fontFamily: 'var(--font-primary)', marginBottom: 'var(--space-2)' }}>Impact Counter</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-4)' }}>
                  Every round you play contributes to real-world change
                </p>
                <div style={{ height: 8, background: 'var(--color-bg-tertiary)', borderRadius: 4, overflow: 'hidden', marginBottom: '8px' }}>
                  <div style={{ height: '100%', width: '72%', background: 'var(--gradient-emerald)', borderRadius: 4, transition: 'width 1s ease' }} />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                  <span>₹0</span>
                  <span style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>72% of goal</span>
                  <span>₹60 Lakhs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charity grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-5)' }}>
            {charities.map((charity, i) => (
              <div key={charity.id || i} className="glass-card" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-4)' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: `hsl(${i * 40 + 140}, 60%, 15%)`, border: `1px solid hsl(${i * 40 + 140}, 60%, 30%)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {['💚', '🌿', '🎖️'][i % 3]}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9375rem' }}>{charity.name}</div>
                    <span className="badge badge-neutral" style={{ marginTop: 2 }}>{charity.category || 'Charity'}</span>
                  </div>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6, marginBottom: 'var(--space-4)' }}>
                  {charity.description}
                </p>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '1rem' }}>{charity.raised || '₹28,50,000'}</div>
                  <Link to="/charities" style={{ color: 'var(--color-emerald)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                    Learn more <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: 'var(--space-8)' }}>
            <Link to="/charities" className="btn btn-secondary">
              View All Charities <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURES ===== */}
      <section className="section" style={{ background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Built right</span>
            <h2 style={{ marginTop: 'var(--space-4)' }}>Everything You Need</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)' }}>
            {FEATURES.map((f, i) => (
              <div key={i} className="glass-card" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 'var(--radius-lg)',
                  background: 'var(--color-emerald-glow)', border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'var(--color-emerald)', margin: '0 auto var(--space-4)'
                }}>
                  {f.icon}
                </div>
                <h5 style={{ fontFamily: 'var(--font-primary)', marginBottom: 'var(--space-2)', fontSize: '1rem' }}>{f.title}</h5>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="section" id="pricing">
        <div className="container">
          <div className="section-header">
            <span className="section-tag">Pick your plan</span>
            <h2 style={{ marginTop: 'var(--space-4)' }}>Simple, Transparent Pricing</h2>
            <p style={{ maxWidth: 480, margin: '16px auto 0' }}>
              No hidden fees. Cancel anytime. Save 20% with an annual plan.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-6)', maxWidth: 760, margin: '0 auto' }}>
            {/* Monthly */}
            <div className="glass-card" style={{ padding: 'var(--space-8)', border: '1px solid var(--color-border)' }}>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 8 }}>Monthly</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>₹999</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/month</span>
                </div>
              </div>
              {['Monthly draw entry', 'Track 5 rolling scores', 'Choose your charity', 'Cancel anytime', 'Win up to ₹24K jackpot'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-emerald)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{f}</span>
                </div>
              ))}
              <Link to="/signup?plan=monthly" className="btn btn-secondary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                Get Started
              </Link>
            </div>

            {/* Yearly */}
            <div style={{
              padding: 'var(--space-8)', borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(37,99,235,0.06) 100%)',
              border: '1px solid rgba(16,185,129,0.35)', position: 'relative', overflow: 'hidden'
            }}>
              <div style={{
                position: 'absolute', top: 16, right: 16,
                background: 'var(--gradient-gold)', color: '#000',
                fontSize: '0.75rem', fontWeight: 700, padding: '3px 10px',
                borderRadius: 'var(--radius-full)'
              }}>BEST VALUE</div>
              <div style={{ marginBottom: 'var(--space-6)' }}>
                <div style={{ fontWeight: 600, color: 'var(--color-emerald)', marginBottom: 8 }}>Yearly</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span style={{ fontSize: '3rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>₹9588</span>
                  <span style={{ color: 'var(--color-text-muted)' }}>/year</span>
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-emerald)', marginTop: 4 }}>Just ₹799/month — Save ₹2400!</div>
              </div>
              {['Everything in monthly', '12 draw entries per year', 'Priority verification', 'Charity impact report', 'Exclusive yearly badge'].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 12 }}>
                  <CheckCircle size={16} style={{ color: 'var(--color-emerald)', flexShrink: 0, marginTop: 2 }} />
                  <span style={{ fontSize: '0.9rem', color: 'var(--color-text-secondary)' }}>{f}</span>
                </div>
              ))}
              <Link to="/signup?plan=yearly" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-4)' }}>
                Save 20% — Start Yearly <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA BANNER ===== */}
      <section style={{
        padding: 'var(--space-24) 0',
        background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(6,11,20,1) 50%, rgba(37,99,235,0.08) 100%)',
        borderTop: '1px solid var(--color-border)'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h2 style={{ marginBottom: 'var(--space-4)' }}>
            Ready to Play with{' '}
            <span className="gradient-text">Purpose?</span>
          </h2>
          <p style={{ fontSize: '1.125rem', maxWidth: 500, margin: '0 auto var(--space-8)', color: 'var(--color-text-secondary)' }}>
            Join 12,400+ golfers who are winning prizes and making a real difference every month.
          </p>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Join GreenHeart Today <ArrowRight size={18} />
            </Link>
            <Link to="/charities" className="btn btn-secondary btn-lg">
              <Heart size={16} /> Explore Charities
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
