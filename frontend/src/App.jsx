import { useState } from 'react'
import { registerUser } from './api'
import './App.css'

function App() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const result = await registerUser(form)
      setStatus(result.message || 'Registration successful')
      setForm({ name: '', email: '', phone: '', password: '' })
    } catch (err) {
      setError(err.message || 'Registration failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="card">
        <h1>SalonApp Registration</h1>

        <form onSubmit={handleSubmit}>
          <label>
            Name
            <input
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Phone
            <input
              name="phone"
              type="text"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </label>

          <label>
            Password
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={submitting}>
            {submitting ? 'Registering…' : 'Register'}
          </button>
        </form>

        {status && <div className="feedback success">{status}</div>}
        {error && <div className="feedback error">{error}</div>}
      </div>
    </div>
  )
}

export default App
