import { useEffect, useState } from 'react'
import { createSalon, getSalons, loginUser, registerUser } from './api'
import './App.css'

const initialRegister = { name: '', email: '', phone: '', password: '' }
const initialLogin = { email: '', password: '' }
const initialSalon = {
  name: '',
  address: '',
  city: '',
  state: '',
  pincode: '',
  phoneNumber: '',
  description: '',
}

function App() {
  const [mode, setMode] = useState('register')
  const [form, setForm] = useState(initialRegister)
  const [salonForm, setSalonForm] = useState(initialSalon)
  const [salons, setSalons] = useState([])
  const [user, setUser] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingSalons, setLoadingSalons] = useState(false)

  useEffect(() => {
    const storedToken = localStorage.getItem('salonAppToken')
    const storedUser = localStorage.getItem('salonAppUser')
    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser))
        setMode('salon')
      } catch {
        localStorage.removeItem('salonAppToken')
        localStorage.removeItem('salonAppUser')
      }
    }
  }, [])

  useEffect(() => {
    if (mode === 'salon' && user) {
      loadSalons()
    }
  }, [mode, user])

  const loadSalons = async () => {
    setLoadingSalons(true)
    setError(null)
    try {
      const result = await getSalons()
      setSalons(result)
    } catch (err) {
      setError(err.message || 'Unable to fetch salons')
    } finally {
      setLoadingSalons(false)
    }
  }

  const handleModeChange = (nextMode) => {
    if (nextMode === 'salon' && !user) {
      setStatus('Please login first to access dashboard.')
      setMode('login')
      return
    }
    setStatus(null)
    setError(null)
    setMode(nextMode)
    setForm(nextMode === 'register' ? initialRegister : initialLogin)
  }

  const handleAuthChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSalonChange = (event) => {
    const { name, value } = event.target
    setSalonForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAuthSubmit = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus(null)
    setError(null)
    try {
      const payload = mode === 'register' ? form : { email: form.email, password: form.password }
      const result = mode === 'register' ? await registerUser(payload) : await loginUser(payload)
      if (result.token) {
        localStorage.setItem('salonAppToken', result.token)
        localStorage.setItem('salonAppUser', JSON.stringify(result.user))
        localStorage.setItem('token', result.token)
        setUser(result.user)
        setMode('salon')
      }
      setStatus(result.message || (mode === 'register' ? 'Registered successfully' : 'Logged in successfully'))
      setForm(mode === 'register' ? initialRegister : initialLogin)
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleCreateSalon = async (event) => {
    event.preventDefault()
    setSubmitting(true)
    setStatus(null)
    setError(null)
    try {
      const formData = new FormData()
      Object.entries(salonForm).forEach(([key, value]) => {
        if (value) formData.append(key, value)
      })
      const result = await createSalon(formData)
      setStatus(result.message || 'Salon created')
      setSalonForm(initialSalon)
      await loadSalons()
    } catch (err) {
      setError(err.message || 'Salon creation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('salonAppToken')
    localStorage.removeItem('salonAppUser')
    localStorage.removeItem('token')
    setUser(null)
    setSalons([])
    setStatus('Logged out successfully')
    setError(null)
    setMode('login')
    setForm(initialLogin)
  }

  const userInitial = (user?.name || user?.email || 'U').charAt(0).toUpperCase()

  return (
    <div className="app-shell">
      <nav className="top-nav">
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>Salon Studio</strong>
            <span>Premium Management</span>
          </div>
        </div>
        {user && (
          <div className="nav-user">
            <div className="avatar">{userInitial}</div>
            <div className="nav-user-meta">
              <strong>{user.name || 'Owner'}</strong>
              <span>{user.email}</span>
            </div>
            <button type="button" className="secondary nav-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>

      <main className="app-container">
        {mode === 'salon' ? (
          <div className="dashboard-layout">
            <aside className="dashboard-sidebar">
              <p className="sidebar-label">Navigation</p>
              <button type="button" className="sidebar-link active">Overview</button>
              <button type="button" className="sidebar-link">Salons</button>
              <button type="button" className="sidebar-link">Appointments</button>
              <button type="button" className="sidebar-link">Team</button>
              <div className="sidebar-promo">
                <span className="hero-eyebrow">Pro Tip</span>
                <p>Keep salon profiles updated with photos and descriptions for a premium client experience.</p>
              </div>
            </aside>

            <section className="dashboard-main">
              <header className="dashboard-hero">
                <div>
                  <span className="hero-eyebrow">Salon Dashboard</span>
                  <h1 className="page-title">Welcome back, {user?.name || 'Owner'}</h1>
                  <p className="page-description">
                    Manage your salon portfolio, track locations, and grow your brand from one elegant workspace.
                  </p>
                </div>
                <button type="button" className="secondary" onClick={loadSalons} disabled={loadingSalons}>
                  {loadingSalons ? 'Syncing...' : 'Refresh Data'}
                </button>
              </header>

              <div className="stats-grid">
                <article className="stat-card">
                  <span className="stat-label">Total Salons</span>
                  <strong className="stat-value">{salons.length}</strong>
                  <span className="stat-hint">Active locations</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Account Status</span>
                  <strong className="stat-value">Active</strong>
                  <span className="stat-hint">Verified owner</span>
                </article>
                <article className="stat-card">
                  <span className="stat-label">Cities Covered</span>
                  <strong className="stat-value">{new Set(salons.map((s) => s.city).filter(Boolean)).size}</strong>
                  <span className="stat-hint">Unique cities</span>
                </article>
              </div>

              <div className="dashboard-grid">
                <section className="panel">
                  <div className="section-header">
                    <div>
                      <h2>Add New Salon</h2>
                      <p className="panel-subtitle">Create a polished salon profile with contact and location details.</p>
                    </div>
                  </div>

                  <form onSubmit={handleCreateSalon} className="form-grid">
                    <label>
                      Salon Name
                      <input name="name" type="text" value={salonForm.name} onChange={handleSalonChange} placeholder="Lumière Hair Studio" required />
                    </label>
                    <label>
                      Phone
                      <input name="phoneNumber" type="text" value={salonForm.phoneNumber} onChange={handleSalonChange} placeholder="+91 98765 43210" required />
                    </label>
                    <label>
                      Address
                      <input name="address" type="text" value={salonForm.address} onChange={handleSalonChange} placeholder="12 Beauty Lane" required />
                    </label>
                    <label>
                      City
                      <input name="city" type="text" value={salonForm.city} onChange={handleSalonChange} placeholder="Mumbai" required />
                    </label>
                    <label>
                      State
                      <input name="state" type="text" value={salonForm.state} onChange={handleSalonChange} placeholder="Maharashtra" required />
                    </label>
                    <label>
                      Pincode
                      <input name="pincode" type="text" value={salonForm.pincode} onChange={handleSalonChange} placeholder="400001" required />
                    </label>
                    <label className="full-width">
                      Description
                      <textarea name="description" value={salonForm.description} onChange={handleSalonChange} rows="3" placeholder="Describe your salon services and ambiance..." />
                    </label>
                    <button type="submit" className="primary full-width" disabled={submitting}>
                      {submitting ? 'Creating Salon...' : 'Create Salon Profile'}
                    </button>
                  </form>
                </section>

                <section className="section-card">
                  <div className="section-header">
                    <div>
                      <h2>Your Salons</h2>
                      <p className="panel-subtitle">{salons.length ? `${salons.length} salon${salons.length > 1 ? 's' : ''} in your portfolio` : 'No salons yet — add your first one'}</p>
                    </div>
                  </div>

                  <div className="salon-list">
                    {loadingSalons ? (
                      <div className="empty-state">Loading salons...</div>
                    ) : salons.length ? (
                      salons.map((salon) => (
                        <article key={salon.id} className="salon-card">
                          <div className="salon-card-top">
                            <div className="salon-icon">{salon.name?.charAt(0)?.toUpperCase() || 'S'}</div>
                            <span className="status-badge">Active</span>
                          </div>
                          <strong>{salon.name}</strong>
                          <p>{salon.address || 'Address not set'}</p>
                          <div className="salon-meta">
                            <span>{salon.city || 'City'}</span>
                            <span>{salon.phoneNumber || 'No phone'}</span>
                          </div>
                        </article>
                      ))
                    ) : (
                      <div className="empty-state">
                        <strong>No salons yet</strong>
                        <p>Create your first salon profile to start building your brand portfolio.</p>
                      </div>
                    )}
                  </div>
                </section>
              </div>

              {status && <p className="feedback success">{status}</p>}
              {error && <p className="feedback error">{error}</p>}
            </section>
          </div>
        ) : (
          <section className="auth-card">
            <div className="auth-visual">
              <span className="hero-eyebrow">Luxury Studio</span>
              <h1 className="page-title">Salon App</h1>
              <p className="page-description">
                Sign in to access your professional salon dashboard — manage locations, services, and your brand identity.
              </p>
              <ul className="auth-features">
                <li>Elegant salon portfolio management</li>
                <li>Client-ready profile presentation</li>
                <li>Secure owner workspace</li>
              </ul>
            </div>

            <div className="auth-panel">
              <div className="tab-list auth-tabs">
                <button type="button" className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => handleModeChange('register')}>
                  Register
                </button>
                <button type="button" className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => handleModeChange('login')}>
                  Login
                </button>
              </div>

              <h2>{mode === 'register' ? 'Create your account' : 'Welcome back'}</h2>
              <p className="panel-subtitle">{mode === 'register' ? 'Start managing your salon business today.' : 'Sign in to continue to your dashboard.'}</p>

              <form onSubmit={handleAuthSubmit} className="form-grid auth-form">
                {mode === 'register' && (
                  <>
                    <label>
                      Full Name
                      <input name="name" type="text" value={form.name} onChange={handleAuthChange} placeholder="Your name" required />
                    </label>
                    <label>
                      Phone
                      <input name="phone" type="text" value={form.phone} onChange={handleAuthChange} placeholder="Phone number" required />
                    </label>
                  </>
                )}
                <label className={mode === 'login' ? 'full-width' : ''}>
                  Email
                  <input name="email" type="email" value={form.email} onChange={handleAuthChange} placeholder="you@salon.com" required />
                </label>
                <label className="full-width">
                  Password
                  <input name="password" type="password" value={form.password} onChange={handleAuthChange} placeholder="••••••••" required />
                </label>
                <button type="submit" className="primary full-width" disabled={submitting}>
                  {submitting ? 'Please wait...' : mode === 'register' ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              {status && <p className="feedback success">{status}</p>}
              {error && <p className="feedback error">{error}</p>}
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default App
