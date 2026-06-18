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
  getAppointmentsPublic,
  getSalonAppointments,
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
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loadingSeats, setLoadingSeats] = useState(false)
  const [loadingServices, setLoadingServices] = useState(false)
  const [loadingEmployees, setLoadingEmployees] = useState(false)
  const [managementTab, setManagementTab] = useState('seats')
  const [editingSalonId, setEditingSalonId] = useState(null)
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [appointmentForm, setAppointmentForm] = useState(initialAppointment)
  const [appointments, setAppointments] = useState([])
  const [loadingAppointments, setLoadingAppointments] = useState(false)
  const [seatAvailability, setSeatAvailability] = useState({})
  const [activeView, setActiveView] = useState('explore')
  const [lookupEmail, setLookupEmail] = useState('')
  const [lookupPhone, setLookupPhone] = useState('')
  const [lookupResults, setLookupResults] = useState([])
  const [searchingAppointments, setSearchingAppointments] = useState(false)

  const loadPersonalAppointments = async () => {
    if (!user) return
    setLoadingAppointments(true)
    try {
      const result = await getMyAppointments()
      setAppointments(result || [])
    } catch (err) {
      setError(err.message || 'Unable to fetch bookings')
    } finally {
      setLoadingAppointments(false)
    }
  }

  const handleLookupSearch = async (e) => {
    e.preventDefault()
    if (!lookupEmail && !lookupPhone) {
      setError('Please enter either an email or phone number to look up your appointments.')
      return
    }
    setSearchingAppointments(true)
    setError(null)
    setStatus(null)
    try {
      const params = {}
      if (lookupEmail) params.email = lookupEmail
      if (lookupPhone) params.phone = lookupPhone
      const results = await getAppointmentsPublic(params)
      setLookupResults(results || [])
      if (!results || results.length === 0) {
        setStatus('No appointments found for the provided details.')
      } else {
        setStatus(`Found ${results.length} appointment(s).`)
      }
    } catch (err) {
      setError(err.message || 'Lookup failed')
    } finally {
      setSearchingAppointments(false)
    }
  }

  useEffect(() => {
    const storedToken = localStorage.getItem('salonAppToken')
    const storedUser = localStorage.getItem('salonAppUser')

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setMode('salon')
      } catch (err) {
        localStorage.removeItem('salonAppUser')
        localStorage.removeItem('salonAppToken')
      }
    }
    loadSalons()
  }, [])

  useEffect(() => {
    setStatus(null)
    setError(null)
    setSelectedSalon(null)
    setSeats([])
    setServices([])
    setEmployees([])
    setManagementTab('seats')
  }, [activeView, mode, user])

  const handleModeChange = (newMode) => {
    if (newMode === 'salon' && !user) {
      setMode('login')
      setStatus('Please login first to access the salon dashboard.')
      return
    }
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
      if (result.token) {
        localStorage.setItem('salonAppToken', result.token)
        localStorage.setItem('salonAppUser', JSON.stringify(result.user))
        setToken(result.token)
        setUser(result.user)
      }
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
      setMode('salon')
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
      setSalons(result || [])
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
      setStatus(result.message || 'Salon updated successfully')
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
    
    // Reset appointment form selection for new salon
    setAppointmentForm({
      ...initialAppointment,
      seatId: '',
      serviceIds: []
    })

    const isOwner = user && salon.ownerId && Number(user.id) === Number(salon.ownerId)

    try {
      setLoadingSeats(true)
      setLoadingServices(true)
      if (isOwner) {
        setLoadingEmployees(true)
      }

      const promises = [
        getSeatsBySalon(salon.id),
        getServicesBySalon(salon.id)
      ]

      if (isOwner) {
        promises.push(getEmployeesBySalon(salon.id))
      }

      const results = await Promise.all(promises)
      setSeats(results[0] || [])
      setServices(results[1] || [])

      if (isOwner) {
        setEmployees(results[2] || [])
        setLoadingAppointments(true)
        try {
          const appts = await getSalonAppointments(salon.id)
          setAppointments(appts || [])
        } catch (e) {
          // ignore error
        } finally {
          setLoadingAppointments(false)
        }
      } else {
        setEmployees([])
        setAppointments([])
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
      setStatus(result.message || 'Seat added successfully')
      setSeatForm(initialSeat)
      const updatedSeats = await getSeatsBySalon(selectedSalon.id)
      setSeats(updatedSeats || [])
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
      setStatus(result.message || 'Service added successfully')
      setServiceForm(initialService)
      const updatedServices = await getServicesBySalon(selectedSalon.id)
      setServices(updatedServices || [])
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
      setError(err.message || 'Service status update failed')
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
      setStatus(result.message || 'Service updated successfully')
      setServiceForm(initialService)
      setEditingServiceId(null)
      const updatedServices = await getServicesBySalon(selectedSalon.id)
      setServices(updatedServices || [])
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

      setStatus(result.message || 'Employee saved successfully')
      setEmployeeForm(initialEmployee)
      setEditingEmployeeId(null)
      const updatedEmployees = await getEmployeesBySalon(selectedSalon.id)
      setEmployees(updatedEmployees || [])
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

  const handleAppointmentChange = (event) => {
    const { name, value } = event.target
    setAppointmentForm((current) => ({ ...current, [name]: value }))
  }

  const handleServiceSelectToggle = (serviceId) => {
    setAppointmentForm((prev) => {
      const ids = prev.serviceIds.includes(serviceId)
        ? prev.serviceIds.filter((id) => id !== serviceId)
        : [...prev.serviceIds, serviceId]
      return { ...prev, serviceIds: ids }
    })
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
      setStatus(result.message || 'Appointment booked successfully!')
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
      <div className="app-container">
        <div className="page-card">
          <header className="page-header">
            <div>
              <h1 className="page-title">
                {activeView === 'explore' 
                  ? 'Salon Explorer' 
                  : activeView === 'lookup' 
                    ? 'My Bookings' 
                    : user 
                      ? 'Owner Dashboard' 
                      : 'Owner Portal'}
              </h1>
              <p className="page-description">
                {activeView === 'explore'
                  ? 'Browse salons, view services and seats, and book your next appointment directly.'
                  : activeView === 'lookup'
                    ? 'Retrieve your booked appointments easily using your registered email address or phone number.'
                    : user
                      ? `Welcome back, ${user.name}. Manage your salons, seats, services, employees, and view user appointments.`
                      : 'Sign in or register a salon owner account to start listing and managing your salon.'}
              </p>
            </div>
            {user && (
              <div style={{ position: 'absolute', top: '3rem', right: '2.5rem', display: 'flex', alignItems: 'center', gap: '1rem', zIndex: 10 }}>
                <span style={{ fontSize: '0.95rem', fontWeight: 600 }}>
                  Logged in as owner: <strong style={{ color: 'var(--primary)' }}>{user.name}</strong>
                </span>
                <button
                  type="button"
                  className="secondary"
                  style={{ minHeight: 'auto', padding: '0.5rem 1.25rem', borderRadius: '12px' }}
                  onClick={() => {
                    localStorage.removeItem('salonAppToken')
                    localStorage.removeItem('salonAppUser')
                    localStorage.removeItem('token')
                    setUser(null)
                    setToken(null)
                    setActiveView('explore')
                    setMode('register')
                    setForm(initialRegister)
                    setSelectedSalon(null)
                    setSeats([])
                    setServices([])
                    setEmployees([])
                    setAppointments([])
                    setStatus('Logged out successfully')
                    setError(null)
                  }}
                >
                  Logout
                </button>
              </div>
            )}
          </header>

          <div className="tab-list">
            <button
              type="button"
              className={activeView === 'explore' ? 'tab active' : 'tab'}
              onClick={() => {
                setActiveView('explore')
                setSelectedSalon(null)
                setError(null)
                setStatus(null)
              }}
            >
              Explore Salons
            </button>
            <button
              type="button"
              className={activeView === 'lookup' ? 'tab active' : 'tab'}
              onClick={() => {
                setActiveView('lookup')
                setSelectedSalon(null)
                setError(null)
                setStatus(null)
                setLookupResults([])
              }}
            >
              My Appointments
            </button>
            <button
              type="button"
              className={activeView === 'owner-portal' ? 'tab active' : 'tab'}
              onClick={() => {
                setActiveView('owner-portal')
                setSelectedSalon(null)
                setError(null)
                setStatus(null)
                if (!user) {
                  setMode('login')
                  setForm(initialLogin)
                } else {
                  setMode('salon')
                }
              }}
            >
              {user ? 'Owner Dashboard' : 'Owner Portal'}
            </button>
          </div>

          <main className="page-content">
            {activeView === 'explore' && (
              <>
                {selectedSalon === null ? (
                  <>
                    {/* Salon Showcase Hero section */}
                    <section className="salon-hero">
                      <div className="salon-hero-copy">
                        <span className="hero-eyebrow">Signature Salons</span>
                        <h2>Relax, Refresh, Rejuvenate</h2>
                        <p className="hero-copy">
                          Discover top-tier salon and styling services in your area. Browse available seats, select services, and secure your booking in minutes.
                        </p>
                        <div className="hero-features">
                          <div className="hero-feature">
                            <strong>Seamless Bookings</strong>
                            <span>Find active seats and choose service combinations effortlessly.</span>
                          </div>
                          <div className="hero-feature">
                            <strong>Qualified Stylists</strong>
                            <span>Experience high-end beauty services tailored to your aesthetic.</span>
                          </div>
                        </div>
                      </div>
                      <div className="salon-hero-image" aria-hidden="true">
                        <div className="hero-image-overlay">
                          <span className="hero-image-label">Luxury Studios</span>
                          <div className="hero-image-card">
                            <p>Indulge in a premium beauty treatment that elevates your personal style.</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Existing salons list */}
                    <section className="panel" aria-labelledby="salon-list-title">
                      <div className="section-header">
                        <div>
                          <h2 id="salon-list-title">Explore Salons</h2>
                          <p className="page-description">Choose a salon to view seats, services, and book your next appointment.</p>
                        </div>
                        <button type="button" className="secondary" onClick={loadSalons} disabled={loadingSalons}>
                          Refresh salons
                        </button>
                      </div>

                      {loadingSalons ? (
                        <p>Loading salons…</p>
                      ) : salons.length === 0 ? (
                        <p>No salons available at this moment.</p>
                      ) : (
                        <div className="salon-list">
                          {salons.map((salon) => {
                            const isOwner = user && salon.ownerId && Number(user.id) === Number(salon.ownerId)
                            return (
                              <article key={salon.id} className="salon-card">
                                <div>
                                  <strong>{salon.name}</strong>
                                  <p>{salon.address}, {salon.city}, {salon.state} {salon.pincode}</p>
                                  <p>{salon.phoneNumber}</p>
                                  {salon.description && <p>{salon.description}</p>}
                                </div>
                                <div className="card-actions">
                                  {isOwner ? (
                                    <>
                                      <button type="button" className="primary" onClick={() => handleSalonSelect(salon)}>
                                        Manage Salon
                                      </button>
                                      <button type="button" className="secondary" onClick={() => handleSalonEdit(salon)}>
                                        Edit Details
                                      </button>
                                      <button type="button" className="danger" onClick={() => handleSalonDelete(salon.id)}>
                                        Delete
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button type="button" className="secondary" onClick={() => handleSalonSelect(salon)}>
                                        View Salon
                                      </button>
                                      <button type="button" className="primary" onClick={() => { handleSalonSelect(salon); setManagementTab('appointments'); }}>
                                        Book Appointment
                                      </button>
                                    </>
                                  )}
                                </div>
                              </article>
                            )
                          })}
                        </div>
                      )}
                    </section>
                  </>
                ) : (
                  <>
                    {/* Back Button */}
                    <button
                      type="button"
                      className="secondary"
                      onClick={() => setSelectedSalon(null)}
                      style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '0.5rem', minHeight: '40px', padding: '0.25rem 1rem', borderRadius: '12px' }}
                    >
                      ← Back to Salons
                    </button>

                    {/* Salon Management / Details Panel */}
                    <section className="panel" aria-labelledby="manage-salon-title">
                      <div className="section-header">
                        <div>
                          <h2 id="manage-salon-title">{selectedSalon.name}</h2>
                          <p className="page-description">{selectedSalon.address}, {selectedSalon.city}</p>
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
                        {user && Number(user.id) === Number(selectedSalon.ownerId) && (
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
                          {user && Number(user.id) === Number(selectedSalon.ownerId) ? 'Booked Appointments' : 'Book Appointment'}
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

                          {user && Number(user.id) === Number(selectedSalon.ownerId) && (
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
                          )}

                          {loadingSeats ? (
                            <p>Loading seats…</p>
                          ) : seats.length === 0 ? (
                            <p>No seats found for this salon.</p>
                          ) : (
                            <div className="management-list">
                              {seats.map((seat) => {
                                const isOwner = user && Number(user.id) === Number(selectedSalon.ownerId)
                                return (
                                  <article key={seat.id} className="seat-card">
                                    <div>
                                      <strong>{seat.name}</strong>
                                      <p>{seat.description || 'No description'}</p>
                                      <span className="status-badge">{seat.isActive ? 'Active' : 'Inactive'}</span>
                                    </div>
                                    <div className="card-actions">
                                      {isOwner ? (
                                        <>
                                          <button type="button" className="secondary" onClick={() => handleSeatToggle(seat)}>
                                            {seat.isActive ? 'Disable' : 'Enable'}
                                          </button>
                                          <button type="button" className="danger" onClick={() => handleSeatDelete(seat.id)}>
                                            Delete
                                          </button>
                                        </>
                                      ) : (
                                        <button
                                          type="button"
                                          className="primary"
                                          disabled={!seat.isActive}
                                          onClick={() => {
                                            setAppointmentForm((f) => ({ ...f, seatId: seat.id }))
                                            setManagementTab('appointments')
                                          }}
                                        >
                                          {seat.isActive ? 'Book Seat' : 'Unavailable'}
                                        </button>
                                      )}
                                    </div>
                                  </article>
                                )
                              })}
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

                          {user && Number(user.id) === Number(selectedSalon.ownerId) && (
                            <form onSubmit={editingServiceId ? handleServiceUpdate : handleServiceSubmit} className="form-grid">
                              <div className="form-header full-width" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <h4>{editingServiceId ? 'Edit Service' : 'Add New Service'}</h4>
                                {editingServiceId && (
                                  <button type="button" className="secondary" onClick={cancelServiceEdit}>
                                    Cancel Edit
                                  </button>
                                )}
                              </div>
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
                                {submitting ? (editingServiceId ? 'Updating service…' : 'Adding service…') : (editingServiceId ? 'Update Service' : 'Add Service')}
                              </button>
                            </form>
                          )}

                          {loadingServices ? (
                            <p>Loading services…</p>
                          ) : services.length === 0 ? (
                            <p>No services found for this salon.</p>
                          ) : (
                            <div className="management-list">
                              {services.map((service) => {
                                const isOwner = user && Number(user.id) === Number(selectedSalon.ownerId)
                                return (
                                  <article key={service.id} className="seat-card">
                                    <div>
                                      <strong>{service.service_name}</strong>
                                      <p>{service.description || 'No description'}</p>
                                      <p>Duration: {service.duration_minutes} mins</p>
                                      <p>Price: ${service.price}</p>
                                      <span className="status-badge" style={{ background: service.status === 'active' ? 'rgba(22, 163, 74, 0.12)' : 'rgba(107, 114, 128, 0.12)', color: service.status === 'active' ? '#166534' : '#4b5563' }}>
                                        {service.status}
                                      </span>
                                    </div>
                                    <div className="card-actions">
                                      {isOwner && (
                                        <>
                                          <button type="button" className="secondary" onClick={() => handleServiceEdit(service)}>
                                            Edit
                                          </button>
                                          <button type="button" className="secondary" onClick={() => handleServiceToggle(service)}>
                                            Set {service.status === 'active' ? 'Inactive' : 'Active'}
                                          </button>
                                          <button type="button" className="danger" onClick={() => handleServiceDelete(service.id)}>
                                            Delete
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </article>
                                )
                              })}
                            </div>
                          )}
                        </div>
                      )}

                      {managementTab === 'employees' && user && Number(user.id) === Number(selectedSalon.ownerId) && (
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

                      {managementTab === 'appointments' && (
                        <>
                          {user && Number(user.id) === Number(selectedSalon.ownerId) ? (
                            /* Owner viewing customer appointments booked at their salon */
                            <div className="section-card" aria-labelledby="salon-appointments-title">
                              <div className="section-header">
                                <div>
                                  <h3 id="salon-appointments-title">Booked Appointments</h3>
                                  <p className="page-description">Appointments booked by customers for your salon.</p>
                                </div>
                                <button
                                  type="button"
                                  className="secondary"
                                  onClick={async () => {
                                    setLoadingAppointments(true)
                                    try {
                                      const appts = await getSalonAppointments(selectedSalon.id)
                                      setAppointments(appts || [])
                                    } catch (e) {
                                      setError(e.message || 'Failed to reload appointments')
                                    } finally {
                                      setLoadingAppointments(false)
                                    }
                                  }}
                                  disabled={loadingAppointments}
                                >
                                  Refresh Bookings
                                </button>
                              </div>

                              {loadingAppointments ? (
                                <p>Loading appointments…</p>
                              ) : appointments.length === 0 ? (
                                <p>No appointments booked yet for this salon.</p>
                              ) : (
                                <div className="management-list">
                                  {appointments.map((appt) => (
                                    <article key={appt.id} className="seat-card">
                                      <div style={{ display: 'grid', gap: '0.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <strong>{appt.customerName} ({appt.customerGender})</strong>
                                          <span className="status-badge" style={{ textTransform: 'capitalize' }}>{appt.status || 'scheduled'}</span>
                                        </div>
                                        <p><strong>Phone:</strong> {appt.customerPhone} | <strong>Email:</strong> {appt.customerEmail || 'N/A'}</p>
                                        <p><strong>City:</strong> {appt.customerCity} | <strong>Address:</strong> {appt.customerAddress}</p>
                                        <p><strong>Seat:</strong> {appt.seat?.name || 'Unknown Seat'}</p>
                                        <p><strong>Time:</strong> {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString()}</p>
                                        <div>
                                          <strong>Services:</strong>
                                          <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                                            {appt.services?.map((srv, idx) => (
                                              <li key={idx}>{srv.service_name} (${srv.price} • {srv.duration_minutes} mins)</li>
                                            ))}
                                          </ul>
                                        </div>
                                      </div>
                                    </article>
                                  ))}
                                </div>
                              )}
                            </div>
                          ) : (
                            /* Customer booking form */
                            <div className="appointment-management section-card">
                              <div className="section-header">
                                <h3>Book Appointment</h3>
                              </div>

                              <form onSubmit={handleAppointmentSubmit} className="service-form">
                                <div className="form-grid">
                                  <label>
                                    Select Seat *
                                    <select name="seatId" value={appointmentForm.seatId} onChange={handleAppointmentChange} required>
                                      <option value="">Choose a seat</option>
                                      {seats.filter(s => s.isActive).map((seat) => (
                                        <option key={seat.id} value={seat.id}>
                                          {seat.name}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label>
                                    Appointment Date *
                                    <input name="date" type="date" value={appointmentForm.date} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    Start Time *
                                    <input name="startTime" type="time" value={appointmentForm.startTime} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    Customer Name *
                                    <input name="customerName" type="text" value={appointmentForm.customerName} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    Customer Phone *
                                    <input name="customerPhone" type="tel" value={appointmentForm.customerPhone} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    Customer Email *
                                    <input name="customerEmail" type="email" value={appointmentForm.customerEmail} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    Customer Gender *
                                    <select name="customerGender" value={appointmentForm.customerGender} onChange={handleAppointmentChange} required>
                                      <option value="Male">Male</option>
                                      <option value="Female">Female</option>
                                      <option value="Other">Other</option>
                                    </select>
                                  </label>

                                  <label>
                                    Customer City *
                                    <input name="customerCity" type="text" value={appointmentForm.customerCity} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label className="full-width">
                                    Customer Address *
                                    <input name="customerAddress" type="text" value={appointmentForm.customerAddress} onChange={handleAppointmentChange} required />
                                  </label>

                                  <div className="full-width">
                                    <label>Select Services * (choose at least one)</label>
                                    <div className="services-checkbox-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '0.75rem', marginTop: '0.5rem' }}>
                                      {services.filter(s => s.status === 'active').map((service) => (
                                        <label key={service.id} className="checkbox-label" style={{ fontWeight: 'normal', cursor: 'pointer' }}>
                                          <input
                                            type="checkbox"
                                            value={service.id}
                                            checked={appointmentForm.serviceIds.includes(service.id)}
                                            onChange={() => handleServiceSelectToggle(service.id)}
                                          />
                                          <span>{service.service_name} (${service.price} • {service.duration_minutes}m)</span>
                                        </label>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                                <button type="submit" className="primary" disabled={submitting} style={{ marginTop: '1.5rem' }}>
                                  {submitting ? 'Booking appointment…' : 'Book Appointment'}
                                </button>
                              </form>
                            </div>
                          )}
                        </>
                      )}
                    </section>
                  </>
                )}
              </>
            )}

            {activeView === 'lookup' && (
              <section className="panel" aria-labelledby="lookup-title">
                <div>
                  <h2 id="lookup-title">Look Up Your Appointments</h2>
                  <p className="page-description">
                    Enter your email address or phone number to retrieve the details of all your booked salon appointments.
                  </p>
                </div>

                <form onSubmit={handleLookupSearch} className="form-grid">
                  <label>
                    Email address
                    <input
                      name="lookupEmail"
                      type="email"
                      placeholder="e.g. customer@example.com"
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      aria-label="Search by Email address"
                    />
                  </label>

                  <label>
                    Phone number
                    <input
                      name="lookupPhone"
                      type="tel"
                      placeholder="e.g. +1234567890"
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      aria-label="Search by Phone number"
                    />
                  </label>

                  <button type="submit" className="primary full-width" disabled={searchingAppointments} style={{ gridColumn: '1 / -1' }}>
                    {searchingAppointments ? 'Searching…' : 'Find Appointments'}
                  </button>
                </form>

                {lookupResults.length > 0 && (
                  <div className="lookup-results" style={{ marginTop: '1.5rem', display: 'grid', gap: '1.25rem' }}>
                    <h3>Booking Results</h3>
                    {lookupResults.map((appt) => (
                      <article key={appt.id} className="salon-card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f9f5ff 100%)' }}>
                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong>{appt.salon?.name || 'Salon'}</strong>
                            <span className="status-badge" style={{ textTransform: 'capitalize' }}>{appt.status || 'scheduled'}</span>
                          </div>
                          <p><strong>Address:</strong> {appt.salon?.address}, {appt.salon?.city}</p>
                          <p><strong>Seat:</strong> {appt.seat?.name || 'Unknown Seat'}</p>
                          <p><strong>Date & Time:</strong> {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString()}</p>
                          <div>
                            <strong>Booked Services:</strong>
                            <ul style={{ margin: '0.25rem 0 0', paddingLeft: '1.2rem', color: 'var(--text-muted)' }}>
                              {appt.services?.map((srv, idx) => (
                                <li key={idx}>{srv.service_name} (${srv.price} • {srv.duration_minutes} mins)</li>
                              ))}
                            </ul>
                          </div>
                          <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.5rem', marginTop: '0.5rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                            <strong>For:</strong> {appt.customerName} ({appt.customerPhone})
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            )}

            {activeView === 'owner-portal' && !user && (
              <section className="panel" aria-labelledby="auth-title">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <div>
                    <h2 id="auth-title">{mode === 'register' ? 'Register Salon Owner Account' : 'Salon Owner Login'}</h2>
                    <p className="page-description">
                      {mode === 'register'
                        ? 'Register a new owner account to start listing and managing salons.'
                        : 'Sign in to access your owner dashboard.'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button
                      type="button"
                      className={mode === 'login' ? 'primary' : 'secondary'}
                      style={{ minHeight: 'auto', padding: '0.5rem 1rem', borderRadius: '12px' }}
                      onClick={() => handleModeChange('login')}
                    >
                      Login
                    </button>
                    <button
                      type="button"
                      className={mode === 'register' ? 'primary' : 'secondary'}
                      style={{ minHeight: 'auto', padding: '0.5rem 1rem', borderRadius: '12px' }}
                      onClick={() => handleModeChange('register')}
                    >
                      Register
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="form-grid" style={{ marginTop: '1rem' }}>
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

                  <button type="submit" className="primary full-width" disabled={submitting} style={{ gridColumn: '1 / -1' }}>
                    {submitting ? 'Submitting…' : mode === 'register' ? 'Register account' : 'Login'}
                  </button>
                </form>
              </section>
            )}

            {activeView === 'owner-portal' && user && (
              <>
                {/* Create/Edit Salon Form */}
                <section className="panel" aria-labelledby="salon-create-title">
                  <div className="section-header">
                    <div>
                      <h2 id="salon-create-title">{editingSalonId ? 'Edit salon' : 'Create a salon'}</h2>
                      <p className="page-description">
                        {editingSalonId ? 'Update your salon details and photos.' : 'Add a new salon profile with business and contact details.'}
                      </p>
                    </div>
                    {editingSalonId && (
                      <button type="button" className="secondary" onClick={cancelSalonEdit}>
                        Cancel Edit
                      </button>
                    )}
                  </div>

                  <form onSubmit={editingSalonId ? handleSalonUpdate : handleSalonSubmit} className="form-grid">
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
                      {submitting ? (editingSalonId ? 'Updating salon…' : 'Creating salon…') : (editingSalonId ? 'Update Salon' : 'Create Salon')}
                    </button>
                  </form>
                </section>

                {/* Owner's Salons list */}
                <section className="panel" aria-labelledby="owner-salons-title">
                  <div className="section-header">
                    <div>
                      <h2 id="owner-salons-title">My Salons</h2>
                      <p className="page-description">Salons created by you. Select one to manage seats, services, employees, and view appointments.</p>
                    </div>
                    <button type="button" className="secondary" onClick={loadSalons} disabled={loadingSalons}>
                      Refresh
                    </button>
                  </div>

                  {loadingSalons ? (
                    <p>Loading salons…</p>
                  ) : salons.filter((s) => s.ownerId && Number(s.ownerId) === Number(user.id)).length === 0 ? (
                    <p>You haven't listed any salons yet. Create one above.</p>
                  ) : (
                    <div className="salon-list">
                      {salons
                        .filter((salon) => salon.ownerId && Number(salon.ownerId) === Number(user.id))
                        .map((salon) => (
                          <article key={salon.id} className="salon-card">
                            <div>
                              <strong>{salon.name}</strong>
                              <p>{salon.address}, {salon.city}, {salon.state} {salon.pincode}</p>
                              <p>{salon.phoneNumber}</p>
                              {salon.description && <p>{salon.description}</p>}
                            </div>
                            <div className="card-actions">
                              <button
                                type="button"
                                className="primary"
                                onClick={() => {
                                  handleSalonSelect(salon)
                                  setActiveView('explore')
                                }}
                              >
                                Manage Salon
                              </button>
                              <button type="button" className="secondary" onClick={() => handleSalonEdit(salon)}>
                                Edit details
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

