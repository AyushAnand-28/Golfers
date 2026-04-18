import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { supabase } from '../lib/supabase'
import { CreditCard, Trophy, Target, Heart, Plus, History, Settings, LogOut, AlertCircle, Menu, X, Home } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function DashboardPage() {
  const { profile, user, signOut } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  
  const [scores, setScores] = useState([])
  const [subscription, setSubscription] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showScoreModal, setShowScoreModal] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  
  const [newScore, setNewScore] = useState({ score: '', date: new Date().toISOString().split('T')[0] })

  useEffect(() => {
    document.title = 'Dashboard — GreenHeart'
    fetchData()
  }, [user])

  async function fetchData() {
    if (!user) return
    const isMock = import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.includes('placeholder') : true;
    
    if (isMock) {
      setScores([
        { id: 1, score: 36, date: new Date().toISOString() },
        { id: 2, score: 32, date: new Date(Date.now() - 86400000).toISOString() },
      ])
      setSubscription({ status: 'active' })
      setLoading(false)
      return
    }

    try {
      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })
      setScores(scoresData || [])

      const { data: subData } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()
      setSubscription(subData)

    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  async function handleAddScore(e) {
    e.preventDefault()
    const scoreVal = parseInt(newScore.score)
    if (isNaN(scoreVal) || scoreVal < 1 || scoreVal > 45) {
      toast('Score must be between 1 and 45', 'error')
      return
    }

    if (scores.some(s => s.date === newScore.date)) {
      toast('You already have a score entered for this date', 'error')
      return
    }

    const isMock = import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.includes('placeholder') : true;

    if (isMock) {
      setScores(prev => [{ id: Date.now(), score: scoreVal, date: newScore.date }, ...prev].slice(0, 5))
      toast('Score added successfully! (Mock)', 'success')
      setShowScoreModal(false)
      setNewScore({ score: '', date: new Date().toISOString().split('T')[0] })
      return
    }

    try {
      const { error } = await supabase.from('scores').insert({
        user_id: user.id,
        score: scoreVal,
        date: newScore.date
      })
      if (error) throw error
      
      toast('Score added successfully!', 'success')
      setShowScoreModal(false)
      fetchData()
    } catch (err) {
      toast(err.message, 'error')
    }
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const renderTab = () => {
    switch(activeTab) {
      case 'overview':
        return (
          <>
            {!subscription && !loading && (
              <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-4)', marginBottom: 'var(--space-6)', display: 'flex', gap: 'var(--space-4)', alignItems: 'center' }}>
                <AlertCircle size={24} color="var(--color-gold)" />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: 'var(--color-gold)' }}>No Active Subscription</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginTop: 2 }}>You are not currently entered into the monthly draws. Subscribe to activate your account.</div>
                </div>
                <button className="btn btn-gold btn-sm">Subscribe Now</button>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <div className="stat-card">
                <span className="stat-card-label">Next Draw In</span>
                <div className="stat-card-value">12 <span style={{ fontSize: '1rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>Days</span></div>
                <div className="stat-card-sub" style={{ color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: 4 }}><Trophy size={14} /> Est. Jackpot: ₹24 Lakhs+</div>
              </div>
              
              <div className="stat-card">
                <span className="stat-card-label">Rolling Scores</span>
                <div className="stat-card-value">{scores.length}/5</div>
                <div className="stat-card-sub">
                  {scores.length === 0 ? 'Enter your first score!' : scores.length === 5 ? 'Your draw entry is primed' : `Need ${5 - scores.length} more`}
                </div>
              </div>

              <div className="stat-card" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(37,99,235,0.05) 100%)', borderColor: 'rgba(16,185,129,0.2)' }}>
                <span className="stat-card-label" style={{ color: 'var(--color-emerald)' }}>Your Charity Impact</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
                  <Heart size={32} color="var(--color-emerald)" style={{ filter: 'drop-shadow(0 0 8px rgba(16,185,129,0.4))' }} />
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>₹4850</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>donated so far</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 'var(--space-6)' }}>
              <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Your Rolling Scores</h3>
                  <span className="badge badge-neutral">Max 5 Scores</span>
                </div>
                
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>
                  Only your 5 most recent scores are used for the monthly draw. Older scores are automatically replaced.
                </p>

                {scores.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 'var(--space-8)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                    <Target size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
                    <div style={{ fontWeight: 600, marginBottom: 'var(--space-2)' }}>No scores found</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Add your latest golf scores to enter the draws.</div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                    {scores.slice(0, 5).map((score, i) => (
                      <div key={score.id} style={{ 
                        flex: 1, minWidth: '80px',
                        background: i === 0 ? 'var(--color-emerald-glow)' : 'var(--color-bg-secondary)',
                        border: `1px solid ${i === 0 ? 'rgba(16,185,129,0.3)' : 'var(--color-border)'}`,
                        borderRadius: 'var(--radius-lg)', padding: 'var(--space-4) var(--space-2)', textAlign: 'center',
                        position: 'relative'
                      }}>
                        {i === 0 && <span style={{ position: 'absolute', top: -8, left: '50%', transform: 'translateX(-50%)', background: 'var(--color-emerald)', color: '#fff', fontSize: '0.55rem', padding: '2px 6px', borderRadius: 10, fontWeight: 700, textTransform: 'uppercase' }}>New</span>}
                        <div style={{ fontSize: '2rem', fontWeight: 800, fontFamily: 'var(--font-primary)', color: i === 0 ? 'var(--color-emerald)' : 'var(--color-text-primary)' }}>{score.score}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--color-text-muted)', marginTop: 4 }}>
                          {new Date(score.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
                <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
                  <h3 style={{ fontSize: '1.125rem', marginBottom: 'var(--space-4)', display: 'flex', gap: 8, alignItems: 'center' }}>
                    <Heart size={18} color="var(--color-emerald)" /> Selected Charity
                  </h3>
                  <div style={{ background: 'var(--color-bg-secondary)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', border: '1px solid var(--color-border)' }}>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 4 }}>
                      {profile?.charities?.name || 'Loading...'}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                      <span>Contribution rate:</span>
                      <span className="badge badge-success">{profile?.charity_percentage}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )
      case 'scores':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3>Score History & Draw Input</h3>
              <button className="btn btn-primary btn-sm" onClick={() => setShowScoreModal(true)}>
                <Plus size={16} /> Enter Score
              </button>
            </div>
            {scores.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)' }}>You haven't entered any scores yet. Enter your recent verified golf scores to participate in the draw!</p>
            ) : (
              <div className="table-wrapper">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Status</th>
                      <th>Score</th>
                      <th>Date Played</th>
                      <th>Entered On</th>
                    </tr>
                  </thead>
                  <tbody>
                    {scores.map((s, i) => (
                      <tr key={s.id}>
                        <td>{i < 5 ? <span className="badge badge-success">Active Entry</span> : <span className="badge badge-neutral">Archived</span>}</td>
                        <td style={{ fontWeight: 'bold' }}>{s.score}</td>
                        <td>{new Date(s.date).toLocaleDateString()}</td>
                        <td style={{ color: 'var(--color-text-muted)' }}>{new Date(s.id < 100 ? Date.now() : s.created_at || Date.now()).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )
      case 'winnings':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
            <h3>Draws & Winnings</h3>
            <p style={{ color: 'var(--color-text-muted)', margin: 'var(--space-4) 0' }}>The next draw happens at the end of the month. Ensure you have 5 active scores logged to maximize your chances.</p>
            <div style={{ textAlign: 'center', padding: 'var(--space-8)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)' }}>
                <Trophy size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
                <div style={{ fontWeight: 600 }}>No past winnings yet</div>
                <div style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)' }}>Keep entering scores. Your time will come!</div>
            </div>
          </div>
        )
      case 'billing':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
            <h3>Subscription Management</h3>
            <p style={{ color: 'var(--color-text-muted)', marginBottom: 'var(--space-6)' }}>Manage your payment methods and subscription billing cycle via Stripe.</p>
            <div style={{ background: 'var(--color-bg-secondary)', padding: 'var(--space-6)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '1.125rem' }}>Monthly Entry Plan</div>
                  <div style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>₹999 / month</div>
                </div>
                <span className="badge badge-success">Active</span>
              </div>
              <div style={{ marginTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-4)', display: 'flex', gap: 'var(--space-4)' }}>
                <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}>Update Payment Method</button>
                <button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-danger)' }}>Cancel Plan</button>
              </div>
            </div>
            
            <h4>Billing History</h4>
             <table className="table" style={{ marginTop: 'var(--space-4)' }}>
              <thead><tr><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                <tr><td>{new Date().toLocaleDateString()}</td><td>₹999</td><td><span className="badge badge-success">Paid</span></td></tr>
              </tbody>
            </table>
          </div>
        )
      case 'settings':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
            <h3 style={{ marginBottom: 'var(--space-6)' }}>Account Settings</h3>
            
            <div className="form-group">
              <label className="form-label">Display Name</label>
              <input type="text" className="form-input" defaultValue={profile?.name} />
            </div>

            <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" defaultValue={profile?.email} disabled />
            </div>

            <div style={{ marginTop: 'var(--space-8)', paddingTop: 'var(--space-6)', borderTop: '1px solid var(--color-border)' }}>
              <h4 style={{ marginBottom: 'var(--space-4)' }}>Charity Preferences</h4>
              <div className="form-group">
                <label className="form-label">Current Charity Selection</label>
                <select className="form-input" defaultValue="1">
                  <option value="1">Demo Charity #1</option>
                  <option value="2">Demo Charity #2</option>
                </select>
              </div>
              <div className="form-group" style={{ marginTop: 'var(--space-4)' }}>
                <label className="form-label">Contribution Percentage ({profile?.charity_percentage || 10}%)</label>
                <input type="range" min="10" max="50" step="5" defaultValue={profile?.charity_percentage || 10} style={{ width: '100%', accentColor: 'var(--color-emerald)' }} />
              </div>
            </div>

            <button className="btn btn-primary" style={{ marginTop: 'var(--space-6)' }}>Save Changes</button>
          </div>
        )
      default:
        return <div style={{ color: 'var(--color-text-muted)' }}>Feature coming soon.</div>
    }
  }

  // Sidebar link helper
  const NavLink = ({ id, icon: Icon, label }) => (
    <button 
      onClick={() => { setActiveTab(id); setSidebarOpen(false); }} 
      className={`sidebar-nav-link ${activeTab === id ? 'active' : ''}`}
      style={{ width: '100%', background: activeTab === id ? 'var(--color-emerald-glow)' : 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer' }}
    >
      <Icon size={18} /> {label}
    </button>
  )

  return (
    <div className="dashboard-layout">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: 199 }} onClick={() => setSidebarOpen(false)} />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? 'mobile-open' : ''}`} style={{ transition: 'all 0.3s' }}>
        <div className="sidebar-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => navigate('/')} className="cursor-pointer">
            <div style={{ width: 32, height: 32, background: 'var(--gradient-emerald)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>⛳</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>GreenHeart</span>
          </div>
          <button className="mobile-close-btn" onClick={() => setSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--color-text-primary)' }}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <button onClick={() => navigate('/')} className="sidebar-nav-link" style={{ width: '100%', background: 'transparent', border: 'none', textAlign: 'left', cursor: 'pointer', marginBottom: 'var(--space-6)' }}>
            <Home size={18} /> Exit to Homepage
          </button>

          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', padding: '0 var(--space-4)' }}>Menu</div>
          <NavLink id="overview" icon={Target} label="Overview" />
          <NavLink id="scores" icon={History} label="My Scores" />
          <NavLink id="winnings" icon={Trophy} label="Draws & Winnings" />
          
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 'var(--space-6) 0 var(--space-2)', padding: '0 var(--space-4)' }}>Account</div>
          <NavLink id="billing" icon={CreditCard} label="Billing" />
          <NavLink id="settings" icon={Settings} label="Settings" />
        </nav>

        <div style={{ padding: 'var(--space-4)', borderTop: '1px solid var(--color-border)', marginTop: 'auto' }}>
          <button onClick={handleSignOut} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', background: 'none', border: 'none', color: 'var(--color-text-muted)', cursor: 'pointer', textAlign: 'left' }}>
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg-card)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {(profile?.name || 'U')[0]}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>{profile?.name || 'User'}</div>
              <div style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <LogOut size={12} /> Sign out
              </div>
            </div>
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="page-header" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
          <button className="mobile-menu-btn btn btn-ghost" onClick={() => setSidebarOpen(true)} style={{ padding: 'var(--space-2)' }}>
            <Menu size={24} />
          </button>
          
          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: 'clamp(1.5rem, 3vw, 2rem)', marginBottom: 'var(--space-1)' }}>Dashboard</h1>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9375rem', display: window.innerWidth > 480 ? 'block' : 'none' }}>Welcome back, {profile?.name?.split(' ')[0]}</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowScoreModal(true)} style={{ whiteSpace: 'nowrap' }}>
              <Plus size={18} /> <span className="hide-mobile">Add Score</span>
            </button>
          </div>
        </header>

        <div className="page-content">
          {renderTab()}
        </div>
      </main>

      {/* Add Score Modal */}
      {showScoreModal && (
        <div className="modal-overlay" onClick={() => setShowScoreModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ fontSize: '1.5rem' }}>Add Golf Score</h3>
              <button className="modal-close" onClick={() => setShowScoreModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleAddScore}>
              <div className="form-group">
                <label className="form-label">Stableford Score (1 - 45)</label>
                <input
                  type="number"
                  className="form-input"
                  min="1" max="45"
                  value={newScore.score}
                  onChange={e => setNewScore({ ...newScore, score: e.target.value })}
                  style={{ fontSize: '2rem', fontWeight: 700, padding: 'var(--space-4)', textAlign: 'center' }}
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Date Played</label>
                <input
                  type="date"
                  className="form-input"
                  max={new Date().toISOString().split('T')[0]}
                  value={newScore.date}
                  onChange={e => setNewScore({ ...newScore, date: e.target.value })}
                  required
                />
                <span className="form-hint">You can only enter one score per date.</span>
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-3)', marginTop: 'var(--space-8)' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowScoreModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive Inline Styles specifically for this file */}
      <style>{`
        .cursor-pointer { cursor: pointer; }
        .mobile-close-btn { display: none; }
        .mobile-menu-btn { display: none; }
        
        @media (max-width: 1024px) {
          .sidebar { 
            display: flex !important;
            transform: translateX(-100%);
          }
          .sidebar.mobile-open {
            transform: translateX(0);
            z-index: 200;
          }
          .mobile-menu-btn { display: flex !important; }
          .mobile-close-btn { display: flex !important; }
        }
        
        @media (max-width: 480px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </div>
  )
}
