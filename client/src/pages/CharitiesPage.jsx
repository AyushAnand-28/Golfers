import React, { useEffect, useState } from 'react'
import { Heart, Search, Filter, ExternalLink, ArrowRight, Share2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function CharitiesPage() {
  const [charities, setCharities] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')

  // Mock data as fallback
  const mockCharities = [
    { id: 1, name: 'Children First Foundation', description: 'Providing education, healthcare, and safe housing to underprivileged children worldwide. Every contribution helps build a school or medical center.', raised: '₹42,80,000', category: 'Children', website: 'https://example.com', image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=600&q=80' },
    { id: 2, name: 'Green Earth Initiative', description: 'Planting trees, fighting deforestation, and restoring ecosystems damaged by climate change. Join us to make the planet green again.', raised: '₹28,50,000', category: 'Environment', website: 'https://example.com', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80' },
    { id: 3, name: 'Veterans Support Network', description: 'Mental health and physical rehabilitation support for military veterans transitioning to civilian life.', raised: '₹36,20,000', category: 'Veterans', website: 'https://example.com', image: 'https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?auto=format&fit=crop&w=600&q=80' },
    { id: 4, name: 'Medical Relief Intl', description: 'Delivering urgent medical supplies and training local staff in crisis zones around the globe.', raised: '₹15,40,000', category: 'Health', website: 'https://example.com', image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=600&q=80' },
    { id: 5, name: 'Ocean Protectors', description: 'Cleaning the oceans by removing plastics and fighting for marine life conservation.', raised: '₹22,10,000', category: 'Environment', website: 'https://example.com', image: 'https://images.unsplash.com/photo-1621451537084-482c73073e0f?auto=format&fit=crop&w=600&q=80' },
    { id: 6, name: 'Local Food Banks UK', description: 'Ensuring no family goes hungry. Distributing meals to communities facing food insecurity.', raised: '₹55,90,000', category: 'Community', website: 'https://example.com', image: 'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=600&q=80' },
  ]

  useEffect(() => {
    document.title = 'Our Charities — GreenHeart'
    fetchCharities()
  }, [])

  async function fetchCharities() {
    try {
      const { data, error } = await supabase.from('charities').select('*').order('name')
      if (data && data.length > 0) {
        setCharities(data)
      } else {
        setCharities(mockCharities)
      }
    } catch (e) {
      console.error(e)
      setCharities(mockCharities)
    } finally {
      setLoading(false)
    }
  }

  const filteredCharities = charities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = categoryFilter === 'All' || c.category === categoryFilter
    return matchesSearch && matchesCategory
  })

  const categories = ['All', ...new Set(charities.map(c => c.category).filter(Boolean))]

  return (
    <div>
      {/* Header */}
      <section style={{ padding: '80px 0 var(--space-12)', background: 'var(--color-bg-secondary)', borderBottom: '1px solid var(--color-border)' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <span className="section-tag"><Heart size={12} style={{ display: 'inline', marginRight: 4 }} /> The Heart of the Game</span>
          <h1 style={{ marginTop: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>Causes You Can Champion</h1>
          <p style={{ maxWidth: 600, margin: '0 auto', color: 'var(--color-text-secondary)', fontSize: '1.125rem' }}>
            Browse our directory of verified charity partners. When you subscribe, minimum 10% of your fee goes directly to the charity of your choice.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          
          {/* Controls */}
          <div style={{ display: 'flex', gap: 'var(--space-4)', marginBottom: 'var(--space-8)', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 300px' }}>
              <Search style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-muted)' }} size={18} />
              <input
                type="text"
                placeholder="Search charities by name or cause..."
                className="form-input"
                style={{ paddingLeft: 42 }}
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-2)', overflowX: 'auto', paddingBottom: 4 }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  style={{
                    padding: 'var(--space-2) var(--space-4)',
                    background: categoryFilter === cat ? 'var(--color-emerald-glow)' : 'var(--color-bg-card)',
                    border: `1px solid ${categoryFilter === cat ? 'var(--color-emerald)' : 'var(--color-border)'}`,
                    color: categoryFilter === cat ? 'var(--color-emerald)' : 'var(--color-text-primary)',
                    borderRadius: 'var(--radius-full)', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s',
                    fontWeight: 500
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="loading-overlay"><div className="loading-spinner"></div></div>
          ) : filteredCharities.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 'var(--space-16)', background: 'var(--color-bg-card)', borderRadius: 'var(--radius-lg)' }}>
              <Filter size={48} color="var(--color-text-muted)" style={{ margin: '0 auto var(--space-4)', opacity: 0.5 }} />
              <h3>No charities found</h3>
              <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-2)' }}>Try adjusting your search or category filters.</p>
              <button className="btn btn-secondary mt-4" onClick={() => { setSearchTerm(''); setCategoryFilter('All') }}>Clear Filters</button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 'var(--space-6)' }}>
              {filteredCharities.map((charity, i) => (
                <div key={charity.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column' }}>
                  {/* Card Header / Image placeholder */}
                  <div style={{
                    height: 140, background: charity.image ? `url(${charity.image}) center/cover no-repeat` : `linear-gradient(135deg, hsl(${i * 60 + 140}, 60%, 15%), hsl(${i * 60 + 200}, 40%, 10%))`,
                    borderTopLeftRadius: 'var(--radius-lg)', borderTopRightRadius: 'var(--radius-lg)',
                    position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    {!charity.image && <Heart size={48} color="rgba(255,255,255,0.1)" />}
                    <span className="badge badge-neutral" style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(0,0,0,0.5)', border: 'none', color: '#fff', backdropFilter: 'blur(4px)' }}>
                      {charity.category}
                    </span>
                  </div>
                  
                  {/* Card Body */}
                  <div style={{ padding: 'var(--space-6)', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-3)' }}>
                      <h3 style={{ fontSize: '1.25rem', fontFamily: 'var(--font-primary)' }}>{charity.name}</h3>
                    </div>
                    
                    <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: 'var(--space-6)', flex: 1 }}>
                      {charity.description}
                    </p>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 'var(--space-4)', borderTop: '1px solid var(--color-border)' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Platform Impact</div>
                        <div style={{ fontWeight: 700, color: 'var(--color-emerald)', fontSize: '1.125rem' }}>{charity.raised}</div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: 8 }}>
                        {charity.website && (
                          <a href={charity.website} target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-border)', color: 'var(--color-text-primary)' }}>
                            <ExternalLink size={16} />
                          </a>
                        )}
                        <a href={`/signup?charity=${charity.id}`} style={{ display: 'flex', alignItems: 'center', gap: 6, height: 36, padding: '0 16px', borderRadius: 'var(--radius-full)', background: 'var(--color-bg-secondary)', border: '1px solid var(--color-emerald)', color: 'var(--color-emerald)', fontSize: '0.875rem', fontWeight: 600, textDecoration: 'none' }}>
                          Support <Heart size={14} fill="currentColor" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA section */}
      <section style={{ padding: 'var(--space-16) 0', background: 'var(--color-bg-secondary)', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <div className="glass-card-static" style={{ padding: 'var(--space-10)', textAlign: 'center', background: 'linear-gradient(135deg, rgba(16,185,129,0.05) 0%, rgba(37,99,235,0.05) 100%)', borderColor: 'rgba(16,185,129,0.2)' }}>
            <h2 style={{ marginBottom: 'var(--space-4)' }}>Represent a Charity?</h2>
            <p style={{ maxWidth: 600, margin: '0 auto var(--space-8)', color: 'var(--color-text-secondary)' }}>
              We're always looking to expand our network of impact. Partner with GreenHeart to open a new recurring revenue stream for your cause.
            </p>
            <button className="btn btn-primary">
              Apply to join Directory <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
