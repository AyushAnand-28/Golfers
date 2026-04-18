import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'
import { useToast } from '../contexts/ToastContext'
import { Users, LayoutDashboard, Database, Trophy, Heart, Search, CheckCircle, ExternalLink } from 'lucide-react'

export default function AdminDashboard() {
  const { profile } = useAuth()
  const { toast } = useToast()
  
  const [activeTab, setActiveTab] = useState('overview')
  const [stats, setStats] = useState({ users: 0, charities: 0, pool: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    document.title = 'Admin — GreenHeart'
    fetchStats()
  }, [])

  async function fetchStats() {
    try {
      const { count: uCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true })
      const { count: cCount } = await supabase.from('charities').select('*', { count: 'exact', head: true })
      setStats({
        users: uCount || 0,
        charities: cCount || 0,
        pool: 2460000 // Mocked for now until draws system is fully in place
      })
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
              <div className="stat-card">
                <span className="stat-card-label">Total Users</span>
                <div className="stat-card-value">{stats.users}</div>
                <div className="stat-card-sub" style={{ color: 'var(--color-emerald)' }}>+24 this week</div>
              </div>
              <div className="stat-card">
                <span className="stat-card-label">Active Charities</span>
                <div className="stat-card-value">{stats.charities}</div>
                <div className="stat-card-sub">Platform directory</div>
              </div>
              <div className="stat-card" style={{ border: '1px solid rgba(245,158,11,0.4)', background: 'rgba(245,158,11,0.05)' }}>
                <span className="stat-card-label" style={{ color: 'var(--color-gold)' }}>Current Prize Pool</span>
                <div className="stat-card-value" style={{ color: 'var(--color-gold)' }}>₹{stats.pool.toLocaleString()}</div>
                <div className="stat-card-sub">Next draw: May 2025</div>
              </div>
            </div>

            <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
              <h3 style={{ marginBottom: 'var(--space-4)' }}>Recent Activity</h3>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem' }}>Activity stream will populate here once events fire.</p>
            </div>
          </div>
        )
      case 'draws':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3>Draw Management</h3>
              <button className="btn btn-primary">Configure New Draw</button>
            </div>

            <div style={{ padding: 'var(--space-8)', border: '1px dashed var(--color-border)', borderRadius: 'var(--radius-lg)', textAlign: 'center' }}>
              <Trophy size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
              <div style={{ fontWeight: 600 }}>No Active Monthly Draw</div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', marginTop: 'var(--space-2)' }}>Start the simulation process to begin this month's draw logic.</p>
              <button className="btn btn-secondary mt-4">Run Simulation</button>
            </div>
          </div>
        )
      case 'users':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3>User Management</h3>
              <div style={{ position: 'relative' }}>
                <Search size={16} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} />
                <input type="text" placeholder="Search users..." className="form-input" style={{ paddingLeft: 36, padding: '6px 12px 6px 36px', height: 'auto', minHeight: 32 }} />
              </div>
            </div>
            <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>User / Email</th>
                    <th>Role</th>
                    <th>Subscription</th>
                    <th>Charity Selection</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3].map(i => (
                    <tr key={i}>
                      <td>
                        <div style={{ fontWeight: 600 }}>Demo User {i}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>user{i}@example.com</div>
                      </td>
                      <td><span className="badge badge-neutral">User</span></td>
                      <td><span className="badge badge-success">Active</span></td>
                      <td>
                        <div>Demo Charity #{i}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>10% contribution</div>
                      </td>
                      <td><button className="btn btn-ghost btn-sm" style={{ color: 'var(--color-emerald)' }}>Manage</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )
      case 'charities':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-6)' }}>
              <h3>Charity Directory</h3>
              <button className="btn btn-primary btn-sm">Add Charity</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 'var(--space-4)' }}>
              {[1, 2, 3, 4].map(i => (
                <div key={i} style={{ border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: 'var(--space-4)', background: 'var(--color-bg-secondary)' }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                   <div style={{ fontWeight: 600 }}>Mock Charity {i}</div>
                   <span className="badge badge-success">Verified</span>
                 </div>
                 <p style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', margin: '8px 0' }}>Supporting education and housing mock data generator.</p>
                 <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
                   <span>Raised: ₹1,20,000</span>
                   <span style={{ color: 'var(--color-danger)', cursor: 'pointer' }}>Suspend</span>
                 </div>
                </div>
              ))}
            </div>
          </div>
        )
      case 'winners':
        return (
          <div className="glass-card-static" style={{ padding: 'var(--space-6)' }}>
             <h3 style={{ marginBottom: 'var(--space-6)' }}>Verify Winners Priority Queue</h3>
             <div className="table-wrapper">
              <table className="table">
                <thead>
                  <tr>
                    <th>Draw Month</th>
                    <th>Winner Match</th>
                    <th>Proof Upload</th>
                    <th>Match Logic</th>
                    <th>Payout Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>April 2026</td>
                    <td>user4@example.com <br/><span className="badge badge-success">4 Matches</span></td>
                    <td><button className="btn btn-ghost btn-sm"><ExternalLink size={14}/> View Club Screenshot</button></td>
                    <td>[12, 14, 22, 35, 41] <br/> <span style={{ color: 'var(--color-emerald)' }}>12, 14, 22, 35 matched</span></td>
                    <td><button className="btn btn-gold btn-sm">Approve Payout</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )
      default:
        return <div>Tab under construction</div>
    }
  }

  return (
    <div className="dashboard-layout">
      {/* SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: 32, height: 32, background: 'var(--color-danger)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>🛡️</div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>Admin Pnl</span>
          </div>
        </div>
        
        <nav className="sidebar-nav">
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 'var(--space-2)', padding: '0 var(--space-4)' }}>Core Tools</div>
          <button onClick={() => setActiveTab('overview')} className={`sidebar-nav-link ${activeTab === 'overview' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: activeTab === 'overview' ? 'var(--color-emerald-glow)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <LayoutDashboard size={18} /> Dashboard
          </button>
          <button onClick={() => setActiveTab('users')} className={`sidebar-nav-link ${activeTab === 'users' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: activeTab === 'users' ? 'var(--color-emerald-glow)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <Users size={18} /> User Management
          </button>
          <button onClick={() => setActiveTab('draws')} className={`sidebar-nav-link ${activeTab === 'draws' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: activeTab === 'draws' ? 'var(--color-emerald-glow)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <Trophy size={18} /> Draw System
          </button>
          
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', margin: 'var(--space-6) 0 var(--space-2)', padding: '0 var(--space-4)' }}>Content</div>
          <button onClick={() => setActiveTab('charities')} className={`sidebar-nav-link ${activeTab === 'charities' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: activeTab === 'charities' ? 'var(--color-emerald-glow)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <Heart size={18} /> Charities
          </button>
          <button onClick={() => setActiveTab('winners')} className={`sidebar-nav-link ${activeTab === 'winners' ? 'active' : ''}`} style={{ width: '100%', border: 'none', background: activeTab === 'winners' ? 'var(--color-emerald-glow)' : 'transparent', textAlign: 'left', cursor: 'pointer' }}>
            <CheckCircle size={18} /> Verify Winners
          </button>
        </nav>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <header className="page-header" style={{ borderBottomColor: 'rgba(239,68,68,0.2)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2rem', marginBottom: 'var(--space-2)' }}>System Control</h1>
              <p style={{ color: 'var(--color-danger)', fontSize: '0.9375rem', fontWeight: 600 }}>Superuser privileges active</p>
            </div>
            <a href="/dashboard" className="btn btn-secondary btn-sm">
              <ExternalLink size={16} /> Exit to App
            </a>
          </div>
        </header>

        <div className="page-content">
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner"></div></div>
          ) : (
            renderTab()
          )}
        </div>
      </main>
    </div>
  )
}
