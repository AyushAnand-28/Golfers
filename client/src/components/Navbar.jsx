import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Menu, X, User, LogOut, LayoutDashboard, Shield } from 'lucide-react'

export default function Navbar() {
  const { user, profile, signOut, isAdmin } = useAuth()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [location])

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLinks = [
    { href: '/charities', label: 'Charities' },
    { href: '/how-it-works', label: 'How It Works' },
    { href: '/prizes', label: 'Prizes' },
  ]

  return (
    <>
      <nav className="navbar" style={{ boxShadow: scrolled ? 'var(--shadow-lg)' : 'none' }}>
        <div className="container">
          <div className="navbar-inner">
            {/* Logo */}
            <Link to="/" className="navbar-logo">
              <div className="navbar-logo-icon">⛳</div>
              <span className="navbar-logo-text">GreenHeart</span>
            </Link>

            {/* Desktop Nav */}
            <div className="navbar-links" style={{ display: 'flex' }}>
              {navLinks.map(link => (
                <Link
                  key={link.href}
                  to={link.href}
                  className={`navbar-link ${location.pathname === link.href ? 'active' : ''}`}
                  style={location.pathname === link.href ? { color: 'var(--color-emerald)' } : {}}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="navbar-actions">
              {user ? (
                <div style={{ position: 'relative' }}>
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '8px',
                      background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-full)', padding: '6px 14px 6px 8px',
                      cursor: 'pointer', color: 'var(--color-text-primary)', transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: 'var(--gradient-emerald)', display: 'flex',
                      alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.75rem', fontWeight: 700, color: '#fff'
                    }}>
                      {(profile?.name || user.email || 'U')[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {profile?.name?.split(' ')[0] || 'Account'}
                    </span>
                  </button>

                  {userMenuOpen && (
                    <div style={{
                      position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                      background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)',
                      borderRadius: 'var(--radius-lg)', padding: '8px', minWidth: 200,
                      boxShadow: 'var(--shadow-lg)', zIndex: 200, animation: 'fadeUp 0.2s ease'
                    }}>
                      <Link
                        to="/dashboard"
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 'var(--radius-md)' }}
                        onClick={() => setUserMenuOpen(false)}
                      >
                        <LayoutDashboard size={16} /> Dashboard
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          className="btn btn-ghost"
                          style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 'var(--radius-md)', color: 'var(--color-emerald)' }}
                          onClick={() => setUserMenuOpen(false)}
                        >
                          <Shield size={16} /> Admin Panel
                        </Link>
                      )}
                      <div style={{ height: 1, background: 'var(--color-border)', margin: '6px 0' }} />
                      <button
                        onClick={handleSignOut}
                        className="btn btn-ghost"
                        style={{ width: '100%', justifyContent: 'flex-start', borderRadius: 'var(--radius-md)', color: 'var(--color-danger)' }}
                      >
                        <LogOut size={16} /> Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                  <Link to="/signup" className="btn btn-primary btn-sm">Get Started</Link>
                </>
              )}

              {/* Mobile menu button */}
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => setMenuOpen(!menuOpen)}
                style={{ display: 'none' }}
                id="mobile-menu-btn"
              >
                {menuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile overlay to close menus */}
      {(menuOpen || userMenuOpen) && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 'var(--z-sticky)', background: 'transparent' }}
          onClick={() => { setMenuOpen(false); setUserMenuOpen(false) }}
        />
      )}

      <style>{`
        @media (max-width: 768px) {
          #mobile-menu-btn { display: flex !important; }
          .navbar-links { display: none !important; }
          .navbar-actions .btn-ghost:first-child, .navbar-actions .btn-primary { display: none !important; }
        }
      `}</style>
    </>
  )
}
