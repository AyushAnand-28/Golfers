import React, { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  const isMock = import.meta.env.VITE_SUPABASE_URL ? import.meta.env.VITE_SUPABASE_URL.includes('placeholder') : true;

  async function fetchProfile(userId) {
    if (isMock) {
      setProfile({ id: userId, email: 'mock@example.com', name: 'Demo User', charity_percentage: 10, role: 'user', charities: { name: 'Demo Charity' } })
      setLoading(false)
      return
    }
    const { data } = await supabase.from('profiles').select(`*, charities(name, id)`).eq('id', userId).single()
    setProfile(data)
    setLoading(false)
  }

  async function signUp({ email, password, name, charityId, charityPercentage }) {
    if (isMock) {
      const isMockAdmin = email.toLowerCase().includes('admin');
      const mockUser = { id: 'mock-id-123', email }
      setUser(mockUser)
      setProfile({ id: mockUser.id, email, name, charity_percentage: charityPercentage, role: isMockAdmin ? 'admin' : 'user', charities: { name: 'Demo Charity' } })
      return { user: mockUser }
    }
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } })
    if (error) throw error
    if (data.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email,
        name,
        charity_id: charityId,
        charity_percentage: charityPercentage || 10,
        role: 'user'
      })
      await fetchProfile(data.user.id)
    }
    return data
  }

  async function signIn({ email, password }) {
    if (isMock) {
      const isMockAdmin = email.toLowerCase().includes('admin');
      const mockUser = { id: 'mock-id-123', email }
      setUser(mockUser)
      setProfile({ id: mockUser.id, email, name: 'Demo User', charity_percentage: 10, role: isMockAdmin ? 'admin' : 'user', charities: { name: 'Demo Charity' } })
      return { user: mockUser }
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
  }

  async function signOut() {
    if (isMock) {
      setUser(null)
      setProfile(null)
      return
    }
    await supabase.auth.signOut()
    setUser(null)
    setProfile(null)
  }


  const isAdmin = profile?.role === 'admin'

  return (
    <AuthContext.Provider value={{ user, profile, loading, signUp, signIn, signOut, isAdmin, refreshProfile: () => user && fetchProfile(user.id) }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
