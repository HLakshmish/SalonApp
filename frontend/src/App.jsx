import { useEffect, useState } from 'react'
import {
  addEmployee,
  addSeat,
  addService,
  createSalon,
  deleteEmployee,
  deleteSalon,
  deleteSeat,
  deleteService,
  getEmployeesBySalon,
  getSalons,
  getSeatsBySalon,
  getServicesBySalon,
  loginUser,
  registerUser,
  toggleSeatStatus,
  toggleServiceStatus,
  updateEmployee,
} from './api'
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
  logo: null,
  banner: null,
  photos: [],
}
const initialSeat = { name: '', description: '', isActive: true }
const initialService = { service_name: '', description: '', duration_minutes: '', price: '', status: 'active' }
const initialEmployee = { name: '', phone: '', role: '', experience: '' }

function App() {
  const [mode, setMode] = useState('register')
  const [form, setForm] = useState(initialRegister)
  const [salonForm, setSalonForm] = useState(initialSalon)
  const [salons, setSalons] = useState([])
  const [selectedSalon, setSelectedSalon] = useState(null)
  const [seats, setSeats] = useState([])
  const [seatForm, setSeatForm] = useState(initialSeat)
  const [services, setServices] = useState([])
  const [serviceForm, setServiceForm] = useState(initialService)
  const [employees, setEmployees] = useState([])
  const [employeeForm, setEmployeeForm] = useState(initialEmployee)
  const [editingEmployeeId, setEditingEmployeeId] = useState(null)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [loadingSalons, setLoadingSalons] = useState(false)
  const [loadingSeats, setLoadingSeats] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [managementTab, setManagementTab] = useState('seats')

  useEffect(() => {
    if (mode === 'salon') {
      loadSalons()
    }
    setStatus(null)
    setError(null)
    setSelectedSalon(null)
    setSeats([])
    setServices([])
    setEmployees([])
    setManagementTab('seats')
  }, [mode])

  const handleModeChange = (newMode) => {
    setMode(newMode)
    setForm(newMode === 'register' ? initialRegister : initialLogin)
    setSalonForm(initialSalon)
    setSeatForm(initialSeat)
    setServiceForm(initialService)
    setManagementTab('seats')
  }

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  const handleSalonChange = (event) => {
    const { name, value, files, type, checked } = event.target
    setSalonForm((current) => {
      if (name === 'logo' || name === 'banner') {
        return { ...current, [name]: files[0] || null }
      }
      if (name === 'photos') {
        return { ...current, photos: files ? Array.from(files) : [] }
      }
      return { ...current, [name]: value }
    })
  }

  const handleSeatChange = (event) => {
    const { name, value, type, checked } = event.target
    setSeatForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleServiceChange = (event) => {
    const { name, value } = event.target
    setServiceForm((current) => ({ ...current, [name]: value }))
  }

  const handleEmployeeChange = (event) => {
    const { name, value } = event.target
    setEmployeeForm((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setStatus(null)
    setError(null)
    setSubmitting(true)

    try {
      const payload = mode === 'register' ? form : { email: form.email, password: form.password }
      const result = mode === 'register' ? await registerUser(payload) : await loginUser(payload)
      setStatus(result.message)
      // store token for authenticated requests
      if (result && result.token) {
        try {
          window.localStorage.setItem('token', result.token)
        } catch (e) {
          // ignore storage errors
        }
        // switch to salon management after auth
        setMode('salon')
      }
      setForm(mode === 'register' ? initialRegister : initialLogin)
    } catch (err) {
      setError(err.message || 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  const loadSalons = async () => {
    setLoadingSalons(true)
    try {
      const result = await getSalons()
      setSalons(result)
    } catch (err) {
      setError(err.message || 'Unable to fetch salons')
    } finally {
      setLoadingSalons(false)
    }
  }

  const handleSalonSubmit = async (event) => {
    event.preventDefault()
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

      const result = await createSalon(formData)
      setStatus(result.message)
      setSalonForm(initialSalon)
      loadSalons()
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
      const [seatResult, serviceResult, employeeResult] = await Promise.all([
        getSeatsBySalon(salon.id),
        getServicesBySalon(salon.id),
        getEmployeesBySalon(salon.id),
      ])
      setSeats(seatResult)
      setServices(serviceResult)
      setEmployees(employeeResult)
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
      setError(err.message || 'Service update failed')
    }
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
    setError(null)
    setStatus(null)
    try {
      const result = await deleteEmployee(id)
      setStatus(result.message)
      setEmployees((current) => current.filter((employee) => employee.id !== id))
    } catch (err) {
      setError(err.message || 'Employee delete failed')
    }
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

  return (
    <div className="app-shell">
      <div className="app-container">
        <div className="page-card">
          <header className="page-header">
            <div>
              <h1 className="page-title">
                {mode === 'salon' ? 'Salon Management' : mode === 'register' ? 'Create your account' : 'Welcome back'}
              </h1>
              <p className="page-description">
                {mode === 'register'
                  ? 'Start managing salons, seats, services, and employees with a clean dashboard experience.'
                  : mode === 'login'
                  ? 'Sign in with your email and password to continue managing your salon.'
                  : 'Create salons and manage seats, services, and employees from a central place.'}
              </p>
              {mode === 'salon' && (
                <div className="hero-notice">
                  Salon dashboard is ready — select a salon to manage seats, services, and employees.
                </div>
              )}
            </div>
          </header>

          {mode === 'salon' && (
            <section className="salon-hero">
              <div className="salon-hero-copy">
                <span className="hero-eyebrow">Salon showcase</span>
                <h2>Create a standout salon brand</h2>
                <p className="hero-copy">
                  Build an elevated client experience with a premium salon dashboard, lush brand styling, and a polished image-led presentation.
                </p>
                <div className="hero-features">
                  <div className="hero-feature">
                    <strong>Elegant salon visuals</strong>
                    <span>Bring salon details to life with sharp layout and luxury styling.</span>
                  </div>
                  <div className="hero-feature">
                    <strong>Easy management</strong>
                    <span>Keep seats, services, and staff organized with beautiful panels.</span>
                  </div>
                  <div className="hero-feature">
                    <strong>Client-ready brand</strong>
                    <span>Present your salon like a high-end studio with a refined hero view.</span>
                  </div>
                </div>
              </div>
              <div className="salon-hero-image" aria-hidden="true">
                <div className="hero-image-overlay">
                  <span className="hero-image-label">Signature salon</span>
                  <div className="hero-image-card">
                    <p>Feel the atmosphere of a premium beauty studio with a calm, welcoming aesthetic.</p>
                  </div>
                </div>
              </div>
            </section>
          )}

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

          <main className="page-content">
            {mode !== 'salon' ? (
              <section className="panel" aria-labelledby="auth-title">
                <div>
                  <h2 id="auth-title">{mode === 'register' ? 'Account details' : 'Login details'}</h2>
                  <p className="page-description">
                    {mode === 'register'
                      ? 'Create a profile and then visit the salon management tab.'
                      : 'Enter your email and password to access the salon dashboard.'}
                  </p>
                </div>

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

                  <button type="submit" className="primary" disabled={submitting}>
                    {submitting ? 'Submitting…' : mode === 'register' ? 'Register account' : 'Login'}
                  </button>
                </form>
              </section>
            ) : (
              <>
                <section className="panel" aria-labelledby="salon-create-title">
                  <div className="section-header">
                    <div>
                      <h2 id="salon-create-title">Create a salon</h2>
                      <p className="page-description">Add a new salon profile with business and contact details.</p>
                    </div>
                    <button type="button" className="secondary" onClick={loadSalons} disabled={loadingSalons}>
                      Refresh salons
                    </button>
                  </div>

                  <form onSubmit={handleSalonSubmit} className="form-grid">
                    <label>
                      Salon name
                      <input name="name" type="text" value={salonForm.name} onChange={handleSalonChange} required aria-label="Salon name" />
                    </label>
                    <label>
                      Public phone
                      <input name="phoneNumber" type="tel" value={salonForm.phoneNumber} onChange={handleSalonChange} required aria-label="Public phone" />
                    </label>
                    <label>
                      Address
                      <input name="address" type="text" value={salonForm.address} onChange={handleSalonChange} required aria-label="Address" />
                    </label>
                    <label>
                      City
                      <input name="city" type="text" value={salonForm.city} onChange={handleSalonChange} required aria-label="City" />
                    </label>
                    <label>
                      State
                      <input name="state" type="text" value={salonForm.state} onChange={handleSalonChange} required aria-label="State" />
                    </label>
                    <label>
                      Pincode
                      <input name="pincode" type="text" value={salonForm.pincode} onChange={handleSalonChange} required aria-label="Pincode" />
                    </label>
                    <label className="full-width">
                      Description
                      <textarea name="description" value={salonForm.description} onChange={handleSalonChange} rows="4" aria-label="Salon description" />
                    </label>
                    <label>
                      Logo
                      <input name="logo" type="file" accept="image/*" onChange={handleSalonChange} aria-label="Upload logo" />
                    </label>
                    <label>
                      Banner
                      <input name="banner" type="file" accept="image/*" onChange={handleSalonChange} aria-label="Upload banner" />
                    </label>
                    <label className="full-width">
                      Photos
                      <input name="photos" type="file" accept="image/*" multiple onChange={handleSalonChange} aria-label="Upload photos" />
                    </label>
                    <button type="submit" className="primary" disabled={submitting}>
                      {submitting ? 'Creating salon…' : 'Create Salon'}
                    </button>
                  </form>
                </section>

                <section className="panel" aria-labelledby="salon-list-title">
                  <div className="section-header">
                    <div>
                      <h2 id="salon-list-title">Existing salons</h2>
                      <p className="page-description">Select a salon to manage seats, services, and employees.</p>
                    </div>
                  </div>

                  {loadingSalons ? (
                    <p>Loading salons…</p>
                  ) : salons.length === 0 ? (
                    <p>No salons found. Create one above.</p>
                  ) : (
                    <div className="salon-list">
                      {salons.map((salon) => (
                        <article key={salon.id} className="salon-card">
                          <div>
                            <strong>{salon.name}</strong>
                            <p>{salon.address}, {salon.city}, {salon.state} {salon.pincode}</p>
                            <p>{salon.phoneNumber}</p>
                            {salon.description && <p>{salon.description}</p>}
                          </div>
                          <div className="card-actions">
                            <button type="button" className="secondary" onClick={() => handleSalonSelect(salon)}>
                              Manage
                            </button>
                            <button type="button" className="danger" onClick={() => handleSalonDelete(salon.id)}>
                              Delete
                            </button>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </section>

                {selectedSalon && (
                  <section className="panel" aria-labelledby="manage-salon-title">
                    <div className="section-header">
                      <div>
                        <h2 id="manage-salon-title">Manage {selectedSalon.name}</h2>
                        <p className="page-description">Manage salon resources and keep your business up to date.</p>
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
                      <button
                        type="button"
                        className={managementTab === 'employees' ? 'management-tab active' : 'management-tab'}
                        onClick={() => setManagementTab('employees')}
                      >
                        Employees
                      </button>
                    </div>

                    {managementTab === 'seats' && (
                      <div className="section-card" aria-labelledby="seat-management-title">
                        <div className="section-header">
                          <div>
                            <h3 id="seat-management-title">Seats</h3>
                          </div>
                          <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingSeats}>
                            Reload Seats
                          </button>
                        </div>

                        <form onSubmit={handleSeatSubmit} className="form-grid">
                          <label>
                            Seat name
                            <input name="name" type="text" value={seatForm.name} onChange={handleSeatChange} required aria-label="Seat name" />
                          </label>
                          <label>
                            Description
                            <input name="description" type="text" value={seatForm.description} onChange={handleSeatChange} aria-label="Seat description" />
                          </label>
                          <label className="checkbox-label full-width">
                            <input name="isActive" type="checkbox" checked={seatForm.isActive} onChange={handleSeatChange} aria-label="Seat active status" />
                            Active
                          </label>
                          <button type="submit" className="primary" disabled={submitting}>
                            {submitting ? 'Adding seat…' : 'Add Seat'}
                          </button>
                        </form>

                        {loadingSeats ? (
                          <p>Loading seats…</p>
                        ) : seats.length === 0 ? (
                          <p>No seats found for this salon.</p>
                        ) : (
                          <div className="management-list">
                            {seats.map((seat) => (
                              <article key={seat.id} className="seat-card">
                                <div>
                                  <strong>{seat.name}</strong>
                                  <p>{seat.description || 'No description'}</p>
                                  <p className="status-badge">{seat.isActive ? 'Active' : 'Inactive'}</p>
                                </div>
                                <div className="card-actions">
                                  <button type="button" className="secondary" onClick={() => handleSeatToggle(seat)}>
                                    {seat.isActive ? 'Disable' : 'Enable'}
                                  </button>
                                  <button type="button" className="danger" onClick={() => handleSeatDelete(seat.id)}>
                                    Delete
                                  </button>
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {managementTab === 'services' && (
                      <div className="section-card" aria-labelledby="service-management-title">
                        <div className="section-header">
                          <div>
                            <h3 id="service-management-title">Services</h3>
                          </div>
                          <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingServices}>
                            Reload Services
                          </button>
                        </div>

                        <form onSubmit={handleServiceSubmit} className="form-grid">
                          <label>
                            Service name
                            <input name="service_name" type="text" value={serviceForm.service_name} onChange={handleServiceChange} required aria-label="Service name" />
                          </label>
                          <label>
                            Duration (minutes)
                            <input name="duration_minutes" type="number" value={serviceForm.duration_minutes} onChange={handleServiceChange} required aria-label="Service duration" />
                          </label>
                          <label>
                            Price
                            <input name="price" type="number" step="0.01" value={serviceForm.price} onChange={handleServiceChange} required aria-label="Service price" />
                          </label>
                          <label>
                            Status
                            <select name="status" value={serviceForm.status} onChange={handleServiceChange} aria-label="Service status">
                              <option value="active">Active</option>
                              <option value="inactive">Inactive</option>
                            </select>
                          </label>
                          <label className="full-width">
                            Description
                            <input name="description" type="text" value={serviceForm.description} onChange={handleServiceChange} aria-label="Service description" />
                          </label>
                          <button type="submit" className="primary" disabled={submitting}>
                            {submitting ? 'Adding service…' : 'Add Service'}
                          </button>
                        </form>

                        {loadingServices ? (
                          <p>Loading services…</p>
                        ) : services.length === 0 ? (
                          <p>No services found for this salon.</p>
                        ) : (
                          <div className="management-list">
                            {services.map((service) => (
                              <article key={service.id} className="seat-card">
                                <div>
                                  <strong>{service.service_name}</strong>
                                  <p>{service.description || 'No description'}</p>
                                  <p>Duration: {service.duration_minutes} mins</p>
                                  <p>Price: {service.price}</p>
                                  <span className="status-badge">{service.status}</span>
                                </div>
                                <div className="card-actions">
                                  <button type="button" className="secondary" onClick={() => handleServiceToggle(service)}>
                                    Set {service.status === 'active' ? 'Inactive' : 'Active'}
                                  </button>
                                  <button type="button" className="danger" onClick={() => handleServiceDelete(service.id)}>
                                    Delete
                                  </button>
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </div>
                    )}

                    {managementTab === 'employees' && (
                      <div className="section-card" aria-labelledby="employee-management-title">
                        <div className="section-header">
                          <div>
                            <h3 id="employee-management-title">Employees</h3>
                          </div>
                          <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingEmployees}>
                            Reload Employees
                          </button>
                        </div>

                        <form onSubmit={handleEmployeeSubmit} className="form-grid">
                          <label>
                            Name
                            <input name="name" type="text" value={employeeForm.name} onChange={handleEmployeeChange} required aria-label="Employee name" />
                          </label>
                          <label>
                            Role
                            <input name="role" type="text" value={employeeForm.role} onChange={handleEmployeeChange} required aria-label="Employee role" />
                          </label>
                          <label>
                            Phone
                            <input name="phone" type="tel" value={employeeForm.phone} onChange={handleEmployeeChange} required aria-label="Employee phone" />
                          </label>
                          <label>
                            Experience
                            <input name="experience" type="text" value={employeeForm.experience} onChange={handleEmployeeChange} aria-label="Employee experience" />
                          </label>
                          <button type="submit" className="primary" disabled={submitting}>
                            {submitting ? (editingEmployeeId ? 'Updating employee…' : 'Saving employee…') : (editingEmployeeId ? 'Update Employee' : 'Add Employee')}
                          </button>
                        </form>

                        {loadingEmployees ? (
                          <p>Loading employees…</p>
                        ) : employees.length === 0 ? (
                          <p>No employees found for this salon.</p>
                        ) : (
                          <div className="management-list">
                            {employees.map((employee) => (
                              <article key={employee.id} className="seat-card">
                                <div>
                                  <strong>{employee.name}</strong>
                                  <p>{employee.role} • {employee.phone}</p>
                                  <p>{employee.experience || 'No experience details'}</p>
                                </div>
                                <div className="card-actions">
                                  <button type="button" className="secondary" onClick={() => handleEmployeeEdit(employee)}>
                                    Edit
                                  </button>
                                  <button type="button" className="danger" onClick={() => handleEmployeeDelete(employee.id)}>
                                    Delete
                                  </button>
                                </div>
                              </article>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </section>
                )}
              </>
            )}

            {status && <div className="feedback success" role="status">{status}</div>}
            {error && <div className="feedback error" role="alert">{error}</div>}
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
