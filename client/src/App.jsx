import React from 'react'
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ToastProvider } from './contexts/ToastContext'

// Components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import { PrivateRoute } from './components/PrivateRoute'

// Pages
import LandingPage from './pages/LandingPage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import CharitiesPage from './pages/CharitiesPage'
import DashboardPage from './pages/DashboardPage'
import AdminDashboard from './pages/AdminDashboard'

function PublicLayout() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, paddingTop: '73px' }}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            {/* Public Wrapper with Navbar/Footer */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/charities" element={<CharitiesPage />} />
            </Route>

            {/* No layout wrapper (e.g., auth pages) */}
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/login" element={<LoginPage />} />

            {/* Private Routes (App-like dashboard layout handles its own sidebar/nav) */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              {/* <Route path="/winnings" element={<WinningsPage />} /> */}
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute requireAdmin={true} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

          </Routes>
        </AuthProvider>
      </ToastProvider>
    </Router>
  )
}

export default App
