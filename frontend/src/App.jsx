import { useEffect, useState } from 'react'
import {
  addEmployee,
  addSeat,
  addService,
  bookAppointment,
  createSalon,
  deleteEmployee,
  deleteSalon,
  deleteSeat,
  deleteService,
  editService,
  getAvailability,
  getEmployeesBySalon,
  getSalonAvailability,
  getSalonById,
  getSalons,
  getSeatsBySalon,
  getServicesBySalon,
  loginUser,
  registerUser,
  toggleSeatStatus,
  toggleServiceStatus,
  updateEmployee,
  updateSalon,
  getMyAppointments,
  getSalonAppointments,
  getOwnerSalonsAppointments,
} from './api'
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
const initialSeat = { name: '', description: '', isActive: true }
const initialService = { service_name: '', description: '', duration_minutes: '', price: '', status: 'active' }
const initialEmployee = { name: '', phone: '', role: '', experience: '' }
const initialAppointment = {
  seatId: '',
  date: '',
  startTime: '',
  customerName: '',
  customerPhone: '',
  customerEmail: '',
  customerGender: 'Other',
  customerCity: '',
  customerAddress: '',
  serviceIds: [],
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

  const loadPersonalAppointments = async () => {
    if (!user) return
    setLoadingAppointments(true)
    try {
      const result = await getMyAppointments()
      setAppointments(result)
    } catch (err) {
      setError(err.message || 'Unable to fetch bookings')
    } finally {
      setLoadingAppointments(false)
    }
  }

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
      loadPersonalAppointments()
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

  const handleSalonDelete = async (id) => {
    if (!window.confirm('Delete this salon?')) return
    setError(null)
    setStatus(null)
    try {
      const result = await deleteSalon(id)
      setStatus(result.message)
      setSalons((current) => current.filter((salon) => salon.id !== id))
      if (selectedSalon?.id === id) {
        setSelectedSalon(null)
        setSeats([])
        setServices([])
        setEmployees([])
      }
    } catch (err) {
      setError(err.message || 'Delete failed')
    }
  }

  const handleSalonEdit = (salon) => {
    setEditingSalonId(salon.id)
    setSalonForm({
      name: salon.name || '',
      address: salon.address || '',
      city: salon.city || '',
      state: salon.state || '',
      pincode: salon.pincode || '',
      phoneNumber: salon.phoneNumber || '',
      description: salon.description || '',
      logo: null,
      banner: null,
      photos: [],
    })
    setStatus(null)
    setError(null)
  }

  const handleSalonUpdate = async (event) => {
    event.preventDefault()
    if (!editingSalonId) return
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('name', salonForm.name)
      formData.append('address', salonForm.address)
      formData.append('city', salonForm.city)
      formData.append('state', salonForm.state)
      formData.append('pincode', salonForm.pincode)
      formData.append('phoneNumber', salonForm.phoneNumber)
      if (salonForm.description) formData.append('description', salonForm.description)
      if (salonForm.logo) formData.append('logo', salonForm.logo)
      if (salonForm.banner) formData.append('banner', salonForm.banner)
      salonForm.photos.forEach((photo) => formData.append('photos', photo))

      const result = await updateSalon(editingSalonId, formData)
      setStatus(result.message)
      setSalonForm(initialSalon)
      setEditingSalonId(null)
      loadSalons()
    } catch (err) {
      setError(err.message || 'Salon update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelSalonEdit = () => {
    setEditingSalonId(null)
    setSalonForm(initialSalon)
    setStatus(null)
    setError(null)
  }

  const handleSalonSelect = async (salon) => {
    setSelectedSalon(salon)
    setStatus(null)
    setError(null)
    setSeatForm(initialSeat)
    setServiceForm(initialService)
    setEmployeeForm(initialEmployee)
    setEditingEmployeeId(null)
    setManagementTab('seats')
    try {
      setLoadingSeats(true)
      setLoadingServices(true)
      setLoadingEmployees(true)
      const seatPromise = getSeatsBySalon(salon.id)
      const servicePromise = getServicesBySalon(salon.id)
      let employeePromise = Promise.resolve([])
      if (user && salon.ownerId && Number(user.id) === Number(salon.ownerId)) {
        employeePromise = getEmployeesBySalon(salon.id)
      }
      const [seatResult, serviceResult, employeeResult] = await Promise.all([
        seatPromise,
        servicePromise,
        employeePromise,
      ])
      setSeats(seatResult)
      setServices(serviceResult)
      setEmployees(employeeResult || [])

      if (user && salon.ownerId && Number(user.id) === Number(salon.ownerId)) {
        setLoadingAppointments(true)
        try {
          const appts = await getSalonAppointments(salon.id)
          setAppointments(appts)
        } catch (e) {
          // ignore error
        } finally {
          setLoadingAppointments(false)
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to load salon details')
    } finally {
      setLoadingSeats(false)
      setLoadingServices(false)
      setLoadingEmployees(false)
    }
  }

  const handleSeatSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSalon) {
      setError('Select a salon before adding seats')
      return
    }
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        name: seatForm.name,
        description: seatForm.description,
        isActive: seatForm.isActive,
      }
      const result = await addSeat(selectedSalon.id, payload)
      setStatus(result.message)
      setSeatForm(initialSeat)
      const updatedSeats = await getSeatsBySalon(selectedSalon.id)
      setSeats(updatedSeats)
    } catch (err) {
      setError(err.message || 'Seat creation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleSeatDelete = async (id) => {
    if (!window.confirm('Delete this seat?')) return
    setError(null)
    setStatus(null)
    try {
      const result = await deleteSeat(id)
      setStatus(result.message)
      setSeats((current) => current.filter((seat) => seat.id !== id))
    } catch (err) {
      setError(err.message || 'Seat delete failed')
    }
  }

  const handleSeatToggle = async (seat) => {
    setError(null)
    setStatus(null)
    try {
      const result = await toggleSeatStatus(seat.id, !seat.isActive)
      setStatus(result.message)
      setSeats((current) => current.map((item) => (item.id === seat.id ? { ...item, isActive: !item.isActive } : item)))
    } catch (err) {
      setError(err.message || 'Seat update failed')
    }
  }

  const handleServiceSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSalon) {
      setError('Select a salon before adding services')
      return
    }
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        service_name: serviceForm.service_name,
        description: serviceForm.description,
        duration_minutes: Number(serviceForm.duration_minutes),
        price: Number(serviceForm.price),
        status: serviceForm.status,
      }
      const result = await addService(selectedSalon.id, payload)
      setStatus(result.message)
      setServiceForm(initialService)
      const updatedServices = await getServicesBySalon(selectedSalon.id)
      setServices(updatedServices)
    } catch (err) {
      setError(err.message || 'Service creation failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleServiceDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return
    setError(null)
    setStatus(null)
    try {
      const result = await deleteService(id)
      setStatus(result.message)
      setServices((current) => current.filter((service) => service.id !== id))
    } catch (err) {
      setError(err.message || 'Service delete failed')
    }
  }

  const handleServiceToggle = async (service) => {
    setError(null)
    setStatus(null)
    try {
      const nextStatus = service.status === 'active' ? 'inactive' : 'active'
      const result = await toggleServiceStatus(service.id, nextStatus)
      setStatus(result.message)
      setServices((current) => current.map((item) => (item.id === service.id ? { ...item, status: nextStatus } : item)))
    } catch (err) {
      setError(err.message || 'Service toggle failed')
    }
  }

  const handleServiceEdit = (service) => {
    setEditingServiceId(service.id)
    setServiceForm({
      service_name: service.service_name || '',
      description: service.description || '',
      duration_minutes: service.duration_minutes || '',
      price: service.price || '',
      status: service.status || 'active',
    })
    setStatus(null)
    setError(null)
  }

  const handleServiceUpdate = async (event) => {
    event.preventDefault()
    if (!editingServiceId) return
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        service_name: serviceForm.service_name,
        description: serviceForm.description,
        duration_minutes: Number(serviceForm.duration_minutes),
        price: Number(serviceForm.price),
        status: serviceForm.status,
      }
      const result = await editService(editingServiceId, payload)
      setStatus(result.message)
      setServiceForm(initialService)
      setEditingServiceId(null)
      const updatedServices = await getServicesBySalon(selectedSalon.id)
      setServices(updatedServices)
    } catch (err) {
      setError(err.message || 'Service update failed')
    } finally {
      setSubmitting(false)
    }
  }

  const cancelServiceEdit = () => {
    setEditingServiceId(null)
    setServiceForm(initialService)
    setStatus(null)
    setError(null)
  }

  const handleEmployeeSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSalon) {
      setError('Select a salon before adding employees')
      return
    }
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        name: employeeForm.name,
        phone: employeeForm.phone,
        role: employeeForm.role,
        experience: employeeForm.experience,
      }
      const result = editingEmployeeId
        ? await updateEmployee(editingEmployeeId, payload)
        : await addEmployee(selectedSalon.id, payload)

      setStatus(result.message)
      setEmployeeForm(initialEmployee)
      setEditingEmployeeId(null)
      const updatedEmployees = await getEmployeesBySalon(selectedSalon.id)
      setEmployees(updatedEmployees)
    } catch (err) {
      setError(err.message || 'Employee save failed')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmployeeDelete = async (id) => {
    if (!window.confirm('Delete this employee?')) return
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

  const handleEmployeeEdit = (employee) => {
    setEditingEmployeeId(employee.id)
    setEmployeeForm({
      name: employee.name || '',
      phone: employee.phone || '',
      role: employee.role || '',
      experience: employee.experience || '',
    })
    setStatus(null)
    setError(null)
  }

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target
    setAppointmentForm((current) => ({ ...current, [name]: value }))
  }

  const handleAppointmentSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSalon) {
      setError('Select a salon before booking appointment')
      return
    }
    if (appointmentForm.serviceIds.length === 0) {
      setError('Please select at least one service to book')
      return
    }
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const startDateTimeStr = `${appointmentForm.date}T${appointmentForm.startTime}:00`
      const payload = {
        salonId: Number(selectedSalon.id),
        seatId: Number(appointmentForm.seatId),
        serviceIds: appointmentForm.serviceIds.map(Number),
        startTime: new Date(startDateTimeStr).toISOString(),
        customerName: appointmentForm.customerName,
        customerGender: appointmentForm.customerGender,
        customerPhone: appointmentForm.customerPhone,
        customerEmail: appointmentForm.customerEmail,
        customerCity: appointmentForm.customerCity,
        customerAddress: appointmentForm.customerAddress,
      }
      const result = await bookAppointment(payload)
      setStatus(result.message)
      setAppointmentForm(initialAppointment)
      setSeatAvailability({})
      loadPersonalAppointments()
    } catch (err) {
      setError(err.message || 'Appointment booking failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="card full-width">
        <div className="tab-list">
          <button type="button" className={mode === 'register' ? 'tab active' : 'tab'} onClick={() => handleModeChange('register')}>
            Register
          </button>
          <button type="button" className={mode === 'login' ? 'tab active' : 'tab'} onClick={() => handleModeChange('login')}>
            Login
          </button>
          <button type="button" className={mode === 'salon' ? 'tab active' : 'tab'} onClick={() => handleModeChange('salon')}>
            Salon
          </button>
        </div>
        {user && (
          <div className="user-info">
            <span>Logged in as <strong>{user.name}</strong></span>
            <button type="button" className="logout-button" onClick={() => {
              localStorage.removeItem('salonAppToken')
              localStorage.removeItem('salonAppUser')
              setUser(null)
              setToken(null)
              setMode('login')
              setSalons([])
              setSelectedSalon(null)
              setSeats([])
              setServices([])
              setEmployees([])
              setStatus('Logged out successfully')
              setError(null)
            }}>
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

        {mode !== 'salon' ? (
          <>
            <h1>{mode === 'register' ? 'SalonApp Registration' : 'SalonApp Login'}</h1>
            <p>
              {mode === 'register'
                ? 'Create a new user account using the Swagger /api/register endpoint.'
                : 'Login with your email and password using the Swagger /api/login endpoint.'}
            </p>

            <form onSubmit={handleSubmit} className="form-grid">
              {mode === 'register' && (
                <label>
                  Name
                  <input name="name" type="text" value={form.name} onChange={handleChange} required aria-label="Name" />
                </label>
              )}

              <label>
                Email address
                <input name="email" type="email" value={form.email} onChange={handleChange} required aria-label="Email address" />
              </label>

              {mode === 'register' && (
                <label>
                  Phone number
                  <input name="phone" type="tel" value={form.phone} onChange={handleChange} required aria-label="Phone number" />
                </label>
              )}

              <label>
                Password
                <input name="password" type="password" value={form.password} onChange={handleChange} required aria-label="Password" />
              </label>

              <button type="submit" disabled={submitting}>
                {submitting ? 'Submitting…' : mode === 'register' ? 'Register' : 'Login'}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1>Salon Management</h1>
            <p>Create salons and manage seats using the Swagger-backed endpoints.</p>

            <form onSubmit={editingSalonId ? handleSalonUpdate : handleSalonSubmit} className="salon-form">
              <div className="form-header">
                <h3>{editingSalonId ? 'Edit Salon' : 'Create New Salon'}</h3>
                {editingSalonId && (
                  <button type="button" className="secondary" onClick={cancelSalonEdit}>
                    Cancel Edit
                  </button>
                )}
              </div>
              <div className="form-grid">
                <label>
                  Salon Name
                  <input name="name" type="text" value={salonForm.name} onChange={handleSalonChange} required />
                </label>
                <label>
                  Address
                  <input name="address" type="text" value={salonForm.address} onChange={handleSalonChange} required />
                </label>
                <label>
                  City
                  <input name="city" type="text" value={salonForm.city} onChange={handleSalonChange} required />
                </label>
                <label>
                  State
                  <input name="state" type="text" value={salonForm.state} onChange={handleSalonChange} required />
                </label>
                <label>
                  Pincode
                  <input name="pincode" type="text" value={salonForm.pincode} onChange={handleSalonChange} required />
                </label>
                <label>
                  Phone
                  <input name="phoneNumber" type="text" value={salonForm.phoneNumber} onChange={handleSalonChange} required />
                </label>
                <label className="full-width">
                  Description
                  <textarea name="description" value={salonForm.description} onChange={handleSalonChange} rows="4" />
                </label>
                <label>
                  Logo
                  <input name="logo" type="file" accept="image/*" onChange={handleSalonChange} />
                </label>
                <label>
                  Banner
                  <input name="banner" type="file" accept="image/*" onChange={handleSalonChange} />
                </label>
                <label className="full-width">
                  Photos
                  <input name="photos" type="file" accept="image/*" multiple onChange={handleSalonChange} />
                </label>
              </div>

              <button type="submit" disabled={submitting}>
                {submitting ? (editingSalonId ? 'Updating salon…' : 'Creating salon…') : (editingSalonId ? 'Update Salon' : 'Create Salon')}
              </button>
            </form>

            <div className="salon-list">
              <div className="section-header">
                <h2>Existing Salons</h2>
                <button type="button" className="secondary" onClick={loadSalons} disabled={loadingSalons}>
                  Refresh
                </button>
              </div>

              {loadingSalons ? (
                <p>Loading salons…</p>
              ) : salons.length === 0 ? (
                <p>No salons found. Create one above.</p>
              ) : (
                salons.map((salon) => (
                  <div key={salon.id} className="salon-card">
                    <div>
                      <strong>{salon.name}</strong>
                      <p>{salon.address}, {salon.city}, {salon.state} - {salon.pincode}</p>
                      <p>{salon.phoneNumber}</p>
                      {salon.description && <p>{salon.description}</p>}
                    </div>
                     <div className="card-actions">
                       <button type="button" className="secondary" onClick={() => handleSalonSelect(salon)}>
                         {user && salon.ownerId && Number(user.id) === Number(salon.ownerId) ? 'Manage Salon' : 'View & Book'}
                       </button>
                       {user && salon.ownerId && Number(user.id) === Number(salon.ownerId) && (
                         <>
                           <button type="button" className="secondary" onClick={() => handleSalonEdit(salon)}>
                             Edit
                           </button>
                           <button type="button" className="danger" onClick={() => handleSalonDelete(salon.id)}>
                             Delete
                           </button>
                         </>
                       )}
                     </div>
                  </div>
                ))
              )}
            </div>

            {/* My Bookings list */}
            {user && (
              <section className="panel" aria-labelledby="bookings-list-title">
                <div className="section-header">
                  <div>
                    <h2 id="bookings-list-title">My Bookings</h2>
                    <p className="page-description">Manage and review your booked appointments.</p>
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
                  <button type="button" className="secondary" onClick={loadPersonalAppointments} disabled={loadingAppointments}>
                    Refresh Bookings
                  </button>
                </div>

                {loadingAppointments ? (
                  <p>Loading bookings…</p>
                ) : appointments.length === 0 ? (
                  <p>No personal bookings scheduled. Select a salon below to book an appointment.</p>
                ) : (
                  <div className="salon-list">
                    {appointments.map((appt) => (
                      <article key={appt.id} className="salon-card">
                        <div>
                          <strong>{appt.salon?.name || 'Salon'}</strong>
                          <p>{appt.salon?.address}, {appt.salon?.city}</p>
                          <p>Date: {new Date(appt.startTime).toLocaleDateString()} at {new Date(appt.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p>Seat: {appt.seat?.name}</p>
                          <p>Services: {appt.services?.map(s => `${s.service_name} ($${s.price})`).join(', ') || 'None'}</p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {selectedSalon && (
              <>
                <div className="section-header">
                  <div>
                    <h2>{user && selectedSalon && Number(user.id) === Number(selectedSalon.ownerId) ? 'Manage' : 'View'} {selectedSalon.name}</h2>
                    <p>{selectedSalon.address}, {selectedSalon.city}</p>
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
                </div>

                <div className="management-tabs">
                  <button
                    type="button"
                    className={managementTab === 'seats' ? 'management-tab active' : 'management-tab'}
                    onClick={() => setManagementTab('seats')}
                  >
                    Seats
                  </button>
                  <button
                    type="button"
                    className={managementTab === 'services' ? 'management-tab active' : 'management-tab'}
                    onClick={() => setManagementTab('services')}
                  >
                    Services
                  </button>
                  {user && selectedSalon && Number(user.id) === Number(selectedSalon.ownerId) && (
                    <button
                      type="button"
                      className={managementTab === 'employees' ? 'management-tab active' : 'management-tab'}
                      onClick={() => setManagementTab('employees')}
                    >
                      Employees
                    </button>
                  )}
                  <button
                    type="button"
                    className={managementTab === 'appointments' ? 'management-tab active' : 'management-tab'}
                    onClick={() => setManagementTab('appointments')}
                  >
                    {user && selectedSalon && Number(user.id) === Number(selectedSalon.ownerId) ? 'Booked Appointments' : 'Book Appointment'}
                  </button>
                </div>

                {managementTab === 'seats' && (
                  <div className="seat-management">
                    <div className="section-header">
                      <h3>Seats</h3>
                      <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingSeats}>
                        Reload Seats
                      </button>
                    </div>

                    {user && selectedSalon && Number(user.id) === Number(selectedSalon.ownerId) && (
                      <form onSubmit={handleSeatSubmit} className="seat-form">
                        <div className="form-grid">
                          <label>
                            Seat Name
                            <input name="name" type="text" value={seatForm.name} onChange={handleSeatChange} required />
                          </label>
                          <label>
                            Description
                            <input name="description" type="text" value={seatForm.description} onChange={handleSeatChange} />
                          </label>
                          <label className="checkbox-label">
                            <input name="isActive" type="checkbox" checked={seatForm.isActive} onChange={handleSeatChange} />
                            Active
                          </label>
                        </div>
                        <button type="submit" disabled={submitting}>
                          {submitting ? 'Adding seat…' : 'Add Seat'}
                        </button>
                      </form>
                    )}

                    {loadingSeats ? (
                      <p>Loading seats…</p>
                    ) : seats.length === 0 ? (
                      <p>No seats found for this salon.</p>
                    ) : (
                      seats.map((seat) => (
                        <div key={seat.id} className="seat-card">
                          <div>
                            <strong>{seat.name}</strong>
                            <p>{seat.description || 'No description'}</p>
                            <p>Status: {seat.isActive ? 'Active' : 'Inactive'}</p>
                          </div>
                          {user && selectedSalon && Number(user.id) === Number(selectedSalon.ownerId) && (
                            <div className="card-actions">
                              <button type="button" className="secondary" onClick={() => handleSeatToggle(seat)}>
                                {seat.isActive ? 'Disable' : 'Enable'}
                              </button>
                              <button type="button" className="danger" onClick={() => handleSeatDelete(seat.id)}>
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                )}

                {/* Salon Management Panel */}
                {selectedSalon && (
                  <section className="panel" aria-labelledby="manage-salon-title">

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

                    {managementTab === 'appointments' && (
                      <div className="appointment-management">
                        {user && selectedSalon && Number(user.id) === Number(selectedSalon.ownerId) ? (
                          <div className="section-card" aria-labelledby="owner-appointments-title">
                            <div className="section-header">
                              <div>
                                <h3 id="owner-appointments-title">Booked Appointments</h3>
                                <p className="page-description">Appointments scheduled for your salon.</p>
                              </div>
                              <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingAppointments}>
                                Refresh Appointments
                              </button>
                            </div>

                            {loadingAppointments ? (
                              <p>Loading appointments…</p>
                            ) : appointments.length === 0 ? (
                              <p>No appointments booked for this salon.</p>
                            ) : (
                              <div className="management-list">
                                {appointments.map((appt) => (
                                  <article key={appt.id} className="seat-card">
                                    <div>
                                      <strong>{appt.customerName}</strong>
                                      <p>Date & Time: {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                      <p>Seat: {appt.seat?.name || 'Unknown Seat'}</p>
                                      <p>Customer: {appt.customerPhone} • {appt.customerEmail} • {appt.customerGender}</p>
                                      <p>Services: {appt.services?.map(s => `${s.service_name} ($${s.price})`).join(', ') || 'None'}</p>
                                      <p>Location: {appt.customerCity}, {appt.customerAddress}</p>
                                    </div>
                                  </article>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          <>
                            <div className="section-header">
                              <h3>Book Appointment</h3>
                            </div>

                            <form onSubmit={handleAppointmentSubmit} className="service-form">
                              <div className="form-grid">
                                <label>
                                  Select Seat
                                  <select name="seatId" value={appointmentForm.seatId} onChange={handleAppointmentChange} required>
                                    <option value="">Choose a seat</option>
                                    {seats.map((seat) => (
                                      <option key={seat.id} value={seat.id}>
                                        {seat.name}
                                      </option>
                                    ))}
                                  </select>
                                </label>
                                <label>
                                  Appointment Date
                                  <input name="date" type="date" value={appointmentForm.date} onChange={handleAppointmentChange} required />
                                </label>
                                <label>
                                  Start Time
                                  <input name="startTime" type="time" value={appointmentForm.startTime} onChange={handleAppointmentChange} required />
                                </label>
                                <label>
                                  Customer Name
                                  <input name="customerName" type="text" value={appointmentForm.customerName} onChange={handleAppointmentChange} required />
                                </label>
                                <label>
                                  Customer Phone
                                  <input name="customerPhone" type="tel" value={appointmentForm.customerPhone} onChange={handleAppointmentChange} required />
                                </label>
                                <label>
                                  Customer Email
                                  <input name="customerEmail" type="email" value={appointmentForm.customerEmail} onChange={handleAppointmentChange} required />
                                </label>
                                <label>
                                  Gender
                                  <select name="customerGender" value={appointmentForm.customerGender} onChange={handleAppointmentChange} required>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                  </select>
                                </label>
                                <label>
                                  City
                                  <input name="customerCity" type="text" value={appointmentForm.customerCity} onChange={handleAppointmentChange} required />
                                </label>
                                <label className="full-width">
                                  Address
                                  <input name="customerAddress" type="text" value={appointmentForm.customerAddress} onChange={handleAppointmentChange} required />
                                </label>

                                <div className="full-width" style={{ marginTop: '0.5rem' }}>
                                  <label style={{ marginBottom: '0.5rem' }}>Select Services (At least one)</label>
                                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.85rem', padding: '0.5rem 0' }}>
                                    {services.filter(s => s.status === 'active').map((service) => (
                                      <label key={service.id} className="checkbox-label" style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                                        <input
                                          type="checkbox"
                                          checked={appointmentForm.serviceIds.includes(service.id)}
                                          onChange={(e) => {
                                            const checked = e.target.checked
                                            setAppointmentForm(current => {
                                              const ids = checked
                                                ? [...current.serviceIds, service.id]
                                                : current.serviceIds.filter(id => id !== service.id)
                                              return { ...current, serviceIds: ids }
                                            })
                                          }}
                                        />
                                        {service.service_name} (${service.price})
                                      </label>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <button type="submit" className="primary" disabled={submitting}>
                                {submitting ? 'Booking appointment…' : 'Book Appointment'}
                              </button>
                            </form>
                          </>
                        )}
                      </div>
                    )}
                  </section>
                )}
              </>
            )}
          </>
        )}

        {status && <div className="feedback success">{status}</div>}
        {error && <div className="feedback error">{error}</div>}
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
