import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Eye, EyeOff, ArrowRight, CheckCircle, ChevronRight } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'

const MOCK_CHARITIES = [
  { id: '1', name: 'Children First Foundation', description: 'Education & healthcare for underprivileged children', category: 'Children' },
  { id: '2', name: 'Green Earth Initiative', description: 'Reforestation and climate action worldwide', category: 'Environment' },
  { id: '3', name: 'Veterans Support Network', description: 'Mental health support for military veterans', category: 'Veterans' },
  { id: '4', name: 'Hunger Relief Fund', description: 'Emergency food aid and nutrition programs', category: 'Hunger' },
  { id: '5', name: 'Ocean Conservation Trust', description: 'Protecting marine ecosystems and wildlife', category: 'Nature' },
  { id: '6', name: 'Women in STEM', description: 'Empowering women in science and technology', category: 'Education' },
]

export default function SignupPage() {
  const [searchParams] = useSearchParams()
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [charities, setCharities] = useState(MOCK_CHARITIES)
  const [selectedCharity, setSelectedCharity] = useState(null)
  const [charityPct, setCharityPct] = useState(10)

  const [form, setForm] = useState({
    name: '', email: '', password: '',
    plan: searchParams.get('plan') || 'monthly'
  })
  const [errors, setErrors] = useState({})

  const { signUp } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Sign Up — GreenHeart'
    supabase.from('charities').select('id, name, description, category')
      .then(({ data }) => { if (data && data.length) setCharities(data) })
  }, [])

  const validate = () => {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Full name is required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) errs.email = 'Valid email required'
    if (form.password.length < 8) errs.password = 'Password must be at least 8 characters'
    return errs
  }

  const handleStep1 = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setStep(2)
  }

  const handleStep2 = (e) => {
    e.preventDefault()
    if (!selectedCharity) { toast('Please select a charity to continue', 'warning'); return }
    setStep(3)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signUp({
        email: form.email,
        password: form.password,
        name: form.name,
        charityId: selectedCharity,
        charityPercentage: charityPct,
      })
      toast('Account created! Welcome to GreenHeart 🎉', 'success')
      navigate('/dashboard')
    } catch (err) {
      toast(err.message || 'Signup failed. Try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const steps = [
    { num: 1, label: 'Your Details' },
    { num: 2, label: 'Choose Charity' },
    { num: 3, label: 'Select Plan' },
  ]

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '100px var(--space-4) var(--space-8)',
      background: 'var(--gradient-hero)'
    }}>
      <div style={{ width: '100%', maxWidth: step === 2 ? 760 : 480 }}>
        {/* Progress Steps */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-2)', marginBottom: 'var(--space-8)' }}>
          {steps.map((s, i) => (
            <React.Fragment key={s.num}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%',
                  background: step >= s.num ? 'var(--gradient-emerald)' : 'var(--color-bg-card)',
                  border: step >= s.num ? 'none' : '1px solid var(--color-border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.8rem', fontWeight: 700,
                  color: step >= s.num ? '#fff' : 'var(--color-text-muted)',
                  transition: 'all 0.3s'
                }}>
                  {step > s.num ? <CheckCircle size={16} /> : s.num}
                </div>
                <span style={{
                  fontSize: '0.8rem', fontWeight: 500,
                  color: step >= s.num ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                  display: window.innerWidth > 480 ? 'block' : 'none'
                }}>{s.label}</span>
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 40, height: 1, background: step > s.num ? 'var(--color-emerald)' : 'var(--color-border)',
                  alignSelf: 'center', transition: 'background 0.3s'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Card */}
        <div className="glass-card-static" style={{ padding: 'var(--space-8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-6)' }}>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-4)' }}>
              <div style={{ width: 36, height: 36, background: 'var(--gradient-emerald)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⛳</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>GreenHeart</span>
            </Link>
            <h3 style={{ fontFamily: 'var(--font-primary)', fontWeight: 700 }}>
              {step === 1 && 'Create your account'}
              {step === 2 && 'Choose your charity'}
              {step === 3 && 'Select your plan'}
            </h3>
            <p style={{ color: 'var(--color-text-muted)', marginTop: 6, fontSize: '0.9rem' }}>
              {step === 1 && 'Join 12,400+ golfers making an impact'}
              {step === 2 && 'At least 10% of your subscription goes directly to your charity'}
              {step === 3 && 'Start your subscription and enter your first monthly draw'}
            </p>
          </div>

          {/* STEP 1: Details */}
          {step === 1 && (
            <form onSubmit={handleStep1}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="John Smith"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
                {errors.name && <span className="form-error">{errors.name}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
                {errors.email && <span className="form-error">{errors.email}</span>}
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPass ? 'text' : 'password'}
                    className="form-input"
                    placeholder="Minimum 8 characters"
                    value={form.password}
                    onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && <span className="form-error">{errors.password}</span>}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 'var(--space-2)' }}>
                Continue <ChevronRight size={16} />
              </button>

              <p style={{ textAlign: 'center', marginTop: 'var(--space-4)', fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>
                Already have an account?{' '}
                <Link to="/login" style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>Sign in</Link>
              </p>
            </form>
          )}

          {/* STEP 2: Charity */}
          {step === 2 && (
            <form onSubmit={handleStep2}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
                {charities.map(c => (
                  <div
                    key={c.id}
                    onClick={() => setSelectedCharity(c.id)}
                    style={{
                      padding: 'var(--space-5)', borderRadius: 'var(--radius-lg)', cursor: 'pointer',
                      border: selectedCharity === c.id ? '2px solid var(--color-emerald)' : '1px solid var(--color-border)',
                      background: selectedCharity === c.id ? 'var(--color-emerald-glow)' : 'var(--color-bg-card)',
                      transition: 'all 0.2s', position: 'relative'
                    }}
                  >
                    {selectedCharity === c.id && (
                      <div style={{ position: 'absolute', top: 10, right: 10 }}>
                        <CheckCircle size={18} style={{ color: 'var(--color-emerald)' }} />
                      </div>
                    )}
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', fontSize: '0.9rem', marginBottom: 4 }}>{c.name}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', lineHeight: 1.5 }}>{c.description}</div>
                    <span className="badge badge-neutral" style={{ marginTop: 8 }}>{c.category}</span>
                  </div>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Your charity contribution: <strong style={{ color: 'var(--color-emerald)' }}>{charityPct}%</strong>
                </label>
                <input
                  type="range" min={10} max={50} value={charityPct}
                  onChange={e => setCharityPct(Number(e.target.value))}
                  style={{ width: '100%', accentColor: 'var(--color-emerald)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                  <span>10% (minimum)</span>
                  <span>50% (generous)</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
                <button type="button" onClick={() => setStep(1)} className="btn btn-secondary" style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }}>
                  Continue <ChevronRight size={16} />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Plan */}
          {step === 3 && (
            <form onSubmit={handleSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)', marginBottom: 'var(--space-6)' }}>
                {[
                  { id: 'monthly', label: 'Monthly', price: '₹999', per: '/month', sub: null },
                  { id: 'yearly', label: 'Yearly', price: '₹9588', per: '/year', sub: 'Save ₹2400!' },
                ].map(plan => (
                  <div
                    key={plan.id}
                    onClick={() => setForm(f => ({ ...f, plan: plan.id }))}
                    style={{
                      padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', cursor: 'pointer', textAlign: 'center',
                      border: form.plan === plan.id ? '2px solid var(--color-emerald)' : '1px solid var(--color-border)',
                      background: form.plan === plan.id ? 'var(--color-emerald-glow)' : 'var(--color-bg-card)',
                      transition: 'all 0.2s', position: 'relative'
                    }}
                  >
                    {plan.sub && (
                      <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)', background: 'var(--gradient-gold)', color: '#000', fontSize: '0.7rem', fontWeight: 700, padding: '2px 10px', borderRadius: 'var(--radius-full)', whiteSpace: 'nowrap' }}>
                        BEST VALUE
                      </div>
                    )}
                    <div style={{ fontWeight: 600, color: form.plan === plan.id ? 'var(--color-emerald)' : 'var(--color-text-secondary)', marginBottom: 4 }}>{plan.label}</div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 900, color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)' }}>{plan.price}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>{plan.per}</div>
                    {plan.sub && <div style={{ color: 'var(--color-emerald)', fontSize: '0.8rem', fontWeight: 600, marginTop: 4 }}>{plan.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div style={{ background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-5)', marginBottom: 'var(--space-6)' }}>
                <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>Your subscription summary</div>
                {[
                  ['Plan', form.plan === 'monthly' ? 'Monthly — ₹999/month' : 'Yearly — ₹799/month'],
                  ['Charity contribution', `${charityPct}% to your chosen charity`],
                  ['Prize pool entry', 'Automatic — every month'],
                  ['Draw format', '3, 4 or 5 score match'],
                ].map(([k, v]) => (
                  <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>{k}</span>
                    <span style={{ color: 'var(--color-text-primary)', fontWeight: 500 }}>{v}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
                <button type="button" onClick={() => setStep(2)} className="btn btn-secondary" style={{ flex: 1 }}>Back</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
                  {loading ? 'Creating account...' : 'Create Account'} {!loading && <ArrowRight size={16} />}
                </button>
              </div>

              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-muted)', marginTop: 'var(--space-4)' }}>
                By signing up, you agree to our Terms of Service and Privacy Policy.
                Your subscription will be processed securely via Stripe.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
