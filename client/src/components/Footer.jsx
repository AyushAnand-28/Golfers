import React from 'react'
import { Link } from 'react-router-dom'
import { Heart, Globe, MessageCircle, Share2, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--color-bg-secondary)',
      borderTop: '1px solid var(--color-border)',
      padding: 'var(--space-16) 0 var(--space-8)'
    }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 'var(--space-12)', marginBottom: 'var(--space-12)' }}>
          {/* Brand */}
          <div>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <div style={{
                width: 36, height: 36, background: 'var(--gradient-emerald)',
                borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>⛳</div>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                GreenHeart
              </span>
            </Link>
            <p style={{ maxWidth: 300, color: 'var(--color-text-muted)', lineHeight: 1.7, fontSize: '0.9rem' }}>
              Golf meets purpose. Play your scores, enter monthly draws, and make a real difference to charities you care about.
            </p>
            <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
              {[Globe, MessageCircle, Share2, Mail].map((Icon, i) => (
                <button key={i} style={{
                  background: 'var(--color-bg-card)', border: '1px solid var(--color-border)',
                  borderRadius: '50%', width: 38, height: 38, display: 'flex', alignItems: 'center',
                  justifyContent: 'center', cursor: 'pointer', color: 'var(--color-text-muted)',
                  transition: 'all 0.2s'
                }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--color-emerald)'; e.currentTarget.style.color = 'var(--color-emerald)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--color-border)'; e.currentTarget.style.color = 'var(--color-text-muted)' }}
                >
                  <Icon size={16} />
                </button>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h6 style={{ marginBottom: '16px', color: 'var(--color-text-primary)', fontFamily: 'var(--font-primary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-text-muted)' }}>Platform</h6>
            {['How It Works', 'Monthly Draws', 'Prize Pool', 'Leaderboard'].map(link => (
              <Link key={link} to="/" style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >{link}</Link>
            ))}
          </div>

          <div>
            <h6 style={{ marginBottom: '16px', fontFamily: 'var(--font-primary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-text-muted)' }}>Impact</h6>
            {['Our Charities', 'Charity Events', 'Total Donated', 'Partner With Us'].map(link => (
              <Link key={link} to="/charities" style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >{link}</Link>
            ))}
          </div>

          <div>
            <h6 style={{ marginBottom: '16px', fontFamily: 'var(--font-primary)', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600, color: 'var(--color-text-muted)' }}>Legal</h6>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Contact Us'].map(link => (
              <Link key={link} to="/" style={{ display: 'block', color: 'var(--color-text-muted)', fontSize: '0.9rem', marginBottom: '10px', textDecoration: 'none', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
              >{link}</Link>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid var(--color-border)', paddingTop: 'var(--space-8)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 'var(--space-4)' }}>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem' }}>
            © {new Date().getFullYear()} GreenHeart. All rights reserved.
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            Made with <Heart size={14} style={{ color: 'var(--color-emerald)', fill: 'var(--color-emerald)' }} /> for a better world
          </p>
        </div>
      </div>
    </footer>
  )
}
