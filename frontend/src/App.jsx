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
import { Icon, SalonInitials } from './Icons'
import { LanguageSwitcher, useTranslation } from './i18n/LanguageContext'
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
  const { t } = useTranslation()
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
      setError(err.message || t('errFetchBookings'))
    } finally {
      setLoadingAppointments(false)
    }
  }

  const handleLookupSearch = async (e) => {
    e.preventDefault()
    if (!lookupEmail && !lookupPhone) {
      setError(t('errLookupInput'))
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
        setStatus(t('noAppointmentsFound'))
      } else {
        setStatus(t('appointmentsFound', { count: results.length }))
      }
    } catch (err) {
      setError(err.message || t('errLookupFailed'))
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
      setStatus(t('loginFirst'))
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
      setError(err.message || t('errRequestFailed'))
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
      setError(err.message || t('errFetchSalons'))
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
      setError(err.message || t('errSalonCreation'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSalonDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteSalon'))) return
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
      setError(err.message || t('errDeleteFailed'))
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
      setStatus(result.message || t('salonUpdated'))
      setSalonForm(initialSalon)
      setEditingSalonId(null)
      loadSalons()
    } catch (err) {
      setError(err.message || t('errSalonUpdate'))
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
      setError(err.message || t('errLoadSalon'))
    } finally {
      setLoadingSeats(false)
      setLoadingServices(false)
      setLoadingEmployees(false)
    }
  }


  const handleSeatSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSalon) {
      setError(t('selectSalonSeats'))
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
      setStatus(result.message || t('seatAdded'))
      setSeatForm(initialSeat)
      const updatedSeats = await getSeatsBySalon(selectedSalon.id)
      setSeats(updatedSeats || [])
    } catch (err) {
      setError(err.message || t('errSeatCreation'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleSeatDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteSeat'))) return
    setError(null)
    setStatus(null)
    try {
      const result = await deleteSeat(id)
      setStatus(result.message)
      setSeats((current) => current.filter((seat) => seat.id !== id))
    } catch (err) {
      setError(err.message || t('errSeatDelete'))
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
      setError(err.message || t('errSeatUpdate'))
    }
  }

  const handleServiceSubmit = async (event) => {
    event.preventDefault()
    if (!selectedSalon) {
      setError(t('selectSalonServices'))
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
      setStatus(result.message || t('serviceAdded'))
      setServiceForm(initialService)
      const updatedServices = await getServicesBySalon(selectedSalon.id)
      setServices(updatedServices || [])
    } catch (err) {
      setError(err.message || t('errServiceCreation'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleServiceDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteService'))) return
    setError(null)
    setStatus(null)
    try {
      const result = await deleteService(id)
      setStatus(result.message)
      setServices((current) => current.filter((service) => service.id !== id))
    } catch (err) {
      setError(err.message || t('errServiceDelete'))
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
      setError(err.message || t('errServiceStatus'))
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
      setStatus(result.message || t('serviceUpdated'))
      setServiceForm(initialService)
      setEditingServiceId(null)
      const updatedServices = await getServicesBySalon(selectedSalon.id)
      setServices(updatedServices || [])
    } catch (err) {
      setError(err.message || t('errServiceUpdate'))
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
      setError(t('selectSalonEmployees'))
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

      setStatus(result.message || t('employeeSaved'))
      setEmployeeForm(initialEmployee)
      setEditingEmployeeId(null)
      const updatedEmployees = await getEmployeesBySalon(selectedSalon.id)
      setEmployees(updatedEmployees || [])
    } catch (err) {
      setError(err.message || t('errEmployeeSave'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleEmployeeDelete = async (id) => {
    if (!window.confirm(t('confirmDeleteEmployee'))) return
    setError(null)
    setStatus(null)
    try {
      const result = await deleteEmployee(id)
      setStatus(result.message)
      setEmployees((current) => current.filter((employee) => employee.id !== id))
    } catch (err) {
      setError(err.message || t('errEmployeeDelete'))
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
      setError(t('selectSalonBooking'))
      return
    }
    if (appointmentForm.serviceIds.length === 0) {
      setError(t('selectOneService'))
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
      setStatus(result.message || t('appointmentBooked'))
      setAppointmentForm(initialAppointment)
      setSeatAvailability({})
      loadPersonalAppointments()
    } catch (err) {
      setError(err.message || t('errAppointmentBooking'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="app-shell">
      <div className="app-container">
        <div className="page-card">
          <header className="app-topbar">
            <div className="topbar-brand">
              <div className="brand-mark">
                <Icon name="scissors" />
              </div>
              <div className="brand-text">
                <span className="brand-name">Lumière</span>
                <span className="brand-tagline">{t('brandTagline')}</span>
              </div>
            </div>

            <nav className="topbar-nav" aria-label="Main navigation">
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
                <Icon name="compass" />
                <span className="tab-label">{t('navExplore')}</span>
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
                <Icon name="calendar" />
                <span className="tab-label">{t('navBookings')}</span>
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
                <Icon name="layout" />
                <span className="tab-label">{user ? t('navDashboard') : t('navOwnerPortal')}</span>
              </button>
            </nav>

            <div className="topbar-end">
              <LanguageSwitcher />
              {user && (
                <div className="topbar-actions">
                <div className="user-badge">
                  <div className="user-avatar">{user.name?.charAt(0)?.toUpperCase() || 'O'}</div>
                  <span><strong>{user.name}</strong></span>
                </div>
                <button
                  type="button"
                  className="secondary btn-compact"
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
                    setStatus(t('loggedOut'))
                    setError(null)
                  }}
                >
                  <Icon name="logout" />
                  {t('logout')}
                </button>
                </div>
              )}
            </div>
          </header>

          <div className="page-hero">
            <h1 className="page-title">
              {activeView === 'explore'
                ? t('titleExplore')
                : activeView === 'lookup'
                  ? t('titleBookings')
                  : user
                    ? t('titleOwnerDashboard')
                    : t('titleOwnerPortal')}
            </h1>
            <p className="page-description">
              {activeView === 'explore'
                ? t('descExplore')
                : activeView === 'lookup'
                  ? t('descBookings')
                  : user
                    ? t('descOwnerDashboard', { name: user.name })
                    : t('descOwnerPortal')}
            </p>
          </div>

          <main className="page-content">
            {activeView === 'explore' && (
              <>
                {selectedSalon === null ? (
                  <>
                    {/* Salon Showcase Hero section */}
                    <section className="salon-hero">
                      <div className="salon-hero-copy">
                        <span className="hero-eyebrow">{t('heroEyebrow')}</span>
                        <h2>{t('heroTitle')}</h2>
                        <p className="hero-copy">
                          {t('heroCopy')}
                        </p>
                        <div className="hero-features">
                          <div className="hero-feature">
                            <strong>{t('heroFeature1Title')}</strong>
                            <span>{t('heroFeature1Desc')}</span>
                          </div>
                          <div className="hero-feature">
                            <strong>{t('heroFeature2Title')}</strong>
                            <span>{t('heroFeature2Desc')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="salon-hero-image" aria-hidden="true">
                        <div className="hero-image-overlay">
                          <span className="hero-image-label">{t('heroImageLabel')}</span>
                          <div className="hero-image-card">
                            <p>{t('heroImageCard')}</p>
                          </div>
                        </div>
                      </div>
                    </section>

                    {/* Existing salons list */}
                    <section className="panel" aria-labelledby="salon-list-title">
                      <div className="section-header">
                        <div>
                          <h2 id="salon-list-title">{t('exploreSalons')}</h2>
                          <p className="page-description">{t('exploreSalonsDesc')}</p>
                        </div>
                        <button type="button" className="secondary" onClick={loadSalons} disabled={loadingSalons}>
                          {t('refreshSalons')}
                        </button>
                      </div>

                      {loadingSalons ? (
                        <p>{t('loadingSalons')}</p>
                      ) : salons.length === 0 ? (
                        <p>{t('noSalons')}</p>
                      ) : (
                        <div className="salon-list">
                          {salons.map((salon) => {
                            const isOwner = user && salon.ownerId && Number(user.id) === Number(salon.ownerId)
                            return (
                              <article key={salon.id} className="salon-card">
                                <div className="salon-card-inner">
                                  <div className="salon-card-header">
                                    <SalonInitials name={salon.name} />
                                    <div className="salon-card-body">
                                      <strong>{salon.name}</strong>
                                      <div className="salon-card-meta">
                                        <span className="salon-meta-item"><Icon name="map-pin" /> {salon.city}, {salon.state}</span>
                                        <span className="salon-meta-item"><Icon name="phone" /> {salon.phoneNumber}</span>
                                      </div>
                                      {salon.description && <p className="salon-card-desc">{salon.description}</p>}
                                    </div>
                                  </div>
                                </div>
                                <div className="card-actions">
                                  {isOwner ? (
                                    <>
                                      <button type="button" className="primary" onClick={() => handleSalonSelect(salon)}>
                                        {t('manageSalon')}
                                      </button>
                                      <button type="button" className="secondary" onClick={() => handleSalonEdit(salon)}>
                                        {t('editDetails')}
                                      </button>
                                      <button type="button" className="danger" onClick={() => handleSalonDelete(salon.id)}>
                                        {t('delete')}
                                      </button>
                                    </>
                                  ) : (
                                    <>
                                      <button type="button" className="secondary" onClick={() => handleSalonSelect(salon)}>
                                        {t('viewSalon')}
                                      </button>
                                      <button type="button" className="primary" onClick={() => { handleSalonSelect(salon); setManagementTab('appointments'); }}>
                                        {t('bookAppointment')}
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
                      className="secondary btn-back"
                      onClick={() => setSelectedSalon(null)}
                    >
                      <Icon name="arrow-left" />
                      {t('backToSalons')}
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
                          {t('seats')}
                        </button>
                        <button
                          type="button"
                          className={managementTab === 'services' ? 'management-tab active' : 'management-tab'}
                          onClick={() => setManagementTab('services')}
                        >
                          {t('services')}
                        </button>
                        {user && Number(user.id) === Number(selectedSalon.ownerId) && (
                          <button
                            type="button"
                            className={managementTab === 'employees' ? 'management-tab active' : 'management-tab'}
                            onClick={() => setManagementTab('employees')}
                          >
                            {t('employees')}
                          </button>
                        )}
                        <button
                          type="button"
                          className={managementTab === 'appointments' ? 'management-tab active' : 'management-tab'}
                          onClick={() => setManagementTab('appointments')}
                        >
                          {user && Number(user.id) === Number(selectedSalon.ownerId) ? t('bookedAppointments') : t('bookAppointment')}
                        </button>
                      </div>

                      {managementTab === 'seats' && (
                        <div className="section-card" aria-labelledby="seat-management-title">
                          <div className="section-header">
                            <div>
                              <h3 id="seat-management-title">{t('seats')}</h3>
                            </div>
                            <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingSeats}>
                              {t('reloadSeats')}
                            </button>
                          </div>

                          {user && Number(user.id) === Number(selectedSalon.ownerId) && (
                            <form onSubmit={handleSeatSubmit} className="form-grid">
                              <label>
                                {t('seatName')}
                                <input name="name" type="text" value={seatForm.name} onChange={handleSeatChange} required aria-label={t('seatName')} />
                              </label>
                              <label>
                                {t('description')}
                                <input name="description" type="text" value={seatForm.description} onChange={handleSeatChange} aria-label={t('description')} />
                              </label>
                              <label className="checkbox-label full-width">
                                <input name="isActive" type="checkbox" checked={seatForm.isActive} onChange={handleSeatChange} aria-label={t('active')} />
                                {t('active')}
                              </label>
                              <button type="submit" className="primary" disabled={submitting}>
                                {submitting ? t('addingSeat') : t('addSeat')}
                              </button>
                            </form>
                          )}

                          {loadingSeats ? (
                            <p>{t('loadingSeats')}</p>
                          ) : seats.length === 0 ? (
                            <p>{t('noSeats')}</p>
                          ) : (
                            <div className="management-list">
                              {seats.map((seat) => {
                                const isOwner = user && Number(user.id) === Number(selectedSalon.ownerId)
                                return (
                                  <article key={seat.id} className="seat-card">
                                    <div>
                                      <strong>{seat.name}</strong>
                                      <p>{seat.description || t('noDescription')}</p>
                                      <span className="status-badge">{seat.isActive ? t('active') : t('inactive')}</span>
                                    </div>
                                    <div className="card-actions">
                                      {isOwner ? (
                                        <>
                                          <button type="button" className="secondary" onClick={() => handleSeatToggle(seat)}>
                                            {seat.isActive ? t('disable') : t('enable')}
                                          </button>
                                          <button type="button" className="danger" onClick={() => handleSeatDelete(seat.id)}>
                                            {t('delete')}
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
                                          {seat.isActive ? t('bookSeat') : t('unavailable')}
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
                              <h3 id="service-management-title">{t('services')}</h3>
                            </div>
                            <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingServices}>
                              {t('reloadServices')}
                            </button>
                          </div>

                          {user && Number(user.id) === Number(selectedSalon.ownerId) && (
                            <form onSubmit={editingServiceId ? handleServiceUpdate : handleServiceSubmit} className="form-grid">
                              <div className="form-header full-width">
                                <h4>{editingServiceId ? t('editService') : t('addNewService')}</h4>
                                {editingServiceId && (
                                  <button type="button" className="secondary" onClick={cancelServiceEdit}>
                                    {t('cancelEdit')}
                                  </button>
                                )}
                              </div>
                              <label>
                                {t('serviceName')}
                                <input name="service_name" type="text" value={serviceForm.service_name} onChange={handleServiceChange} required aria-label={t('serviceName')} />
                              </label>
                              <label>
                                {t('durationMinutes')}
                                <input name="duration_minutes" type="number" value={serviceForm.duration_minutes} onChange={handleServiceChange} required aria-label={t('durationMinutes')} />
                              </label>
                              <label>
                                {t('price')}
                                <input name="price" type="number" step="0.01" value={serviceForm.price} onChange={handleServiceChange} required aria-label={t('price')} />
                              </label>
                              <label>
                                {t('status')}
                                <select name="status" value={serviceForm.status} onChange={handleServiceChange} aria-label={t('status')}>
                                  <option value="active">{t('active')}</option>
                                  <option value="inactive">{t('inactive')}</option>
                                </select>
                              </label>
                              <label className="full-width">
                                {t('description')}
                                <input name="description" type="text" value={serviceForm.description} onChange={handleServiceChange} aria-label={t('description')} />
                              </label>
                              <button type="submit" className="primary" disabled={submitting}>
                                {submitting ? (editingServiceId ? t('updatingService') : t('addingService')) : (editingServiceId ? t('updateService') : t('addService'))}
                              </button>
                            </form>
                          )}

                          {loadingServices ? (
                            <p>{t('loadingServices')}</p>
                          ) : services.length === 0 ? (
                            <p>{t('noServices')}</p>
                          ) : (
                            <div className="management-list">
                              {services.map((service) => {
                                const isOwner = user && Number(user.id) === Number(selectedSalon.ownerId)
                                return (
                                  <article key={service.id} className="seat-card">
                                    <div>
                                      <strong>{service.service_name}</strong>
                                      <p>{service.description || t('noDescription')}</p>
                                      <p>{t('duration')}: {service.duration_minutes} {t('mins')}</p>
                                      <p>{t('price')}: ${service.price}</p>
                                      <span className={`status-badge ${service.status === 'active' ? 'active' : 'inactive'}`}>
                                        {service.status === 'active' ? t('active') : t('inactive')}
                                      </span>
                                    </div>
                                    <div className="card-actions">
                                      {isOwner && (
                                        <>
                                          <button type="button" className="secondary" onClick={() => handleServiceEdit(service)}>
                                            {t('edit')}
                                          </button>
                                          <button type="button" className="secondary" onClick={() => handleServiceToggle(service)}>
                                            {service.status === 'active' ? t('setInactive') : t('setActive')}
                                          </button>
                                          <button type="button" className="danger" onClick={() => handleServiceDelete(service.id)}>
                                            {t('delete')}
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
                              <h3 id="employee-management-title">{t('employees')}</h3>
                            </div>
                            <button type="button" className="secondary" onClick={() => handleSalonSelect(selectedSalon)} disabled={loadingEmployees}>
                              {t('reloadEmployees')}
                            </button>
                          </div>

                          <form onSubmit={handleEmployeeSubmit} className="form-grid">
                            <label>
                              {t('name')}
                              <input name="name" type="text" value={employeeForm.name} onChange={handleEmployeeChange} required aria-label={t('name')} />
                            </label>
                            <label>
                              {t('role')}
                              <input name="role" type="text" value={employeeForm.role} onChange={handleEmployeeChange} required aria-label={t('role')} />
                            </label>
                            <label>
                              {t('phone')}
                              <input name="phone" type="tel" value={employeeForm.phone} onChange={handleEmployeeChange} required aria-label={t('phone')} />
                            </label>
                            <label>
                              {t('experience')}
                              <input name="experience" type="text" value={employeeForm.experience} onChange={handleEmployeeChange} aria-label={t('experience')} />
                            </label>
                            <button type="submit" className="primary" disabled={submitting}>
                              {submitting ? (editingEmployeeId ? t('updatingEmployee') : t('savingEmployee')) : (editingEmployeeId ? t('updateEmployee') : t('addEmployee'))}
                            </button>
                          </form>

                          {loadingEmployees ? (
                            <p>{t('loadingEmployees')}</p>
                          ) : employees.length === 0 ? (
                            <p>{t('noEmployees')}</p>
                          ) : (
                            <div className="management-list">
                              {employees.map((employee) => (
                                <article key={employee.id} className="seat-card">
                                  <div>
                                    <strong>{employee.name}</strong>
                                    <p>{employee.role} • {employee.phone}</p>
                                    <p>{employee.experience || t('noExperience')}</p>
                                  </div>
                                  <div className="card-actions">
                                    <button type="button" className="secondary" onClick={() => handleEmployeeEdit(employee)}>
                                      {t('edit')}
                                    </button>
                                    <button type="button" className="danger" onClick={() => handleEmployeeDelete(employee.id)}>
                                      {t('delete')}
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
                                  <h3 id="salon-appointments-title">{t('bookedAppointments')}</h3>
                                  <p className="page-description">{t('bookedAppointmentsDesc')}</p>
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
                                      setError(e.message || t('errReloadAppointments'))
                                    } finally {
                                      setLoadingAppointments(false)
                                    }
                                  }}
                                  disabled={loadingAppointments}
                                >
                                  {t('refreshBookings')}
                                </button>
                              </div>

                              {loadingAppointments ? (
                                <p>{t('loadingAppointments')}</p>
                              ) : appointments.length === 0 ? (
                                <p>{t('noAppointmentsSalon')}</p>
                              ) : (
                                <div className="management-list">
                                  {appointments.map((appt) => (
                                    <article key={appt.id} className="seat-card">
                                      <div className="appointment-detail-grid">
                                        <div className="appointment-detail-header">
                                          <strong>{appt.customerName} ({appt.customerGender})</strong>
                                          <span className="status-badge">{appt.status || t('scheduled')}</span>
                                        </div>
                                        <p><strong>{t('phoneLabel')}:</strong> {appt.customerPhone} | <strong>{t('emailLabel')}:</strong> {appt.customerEmail || t('na')}</p>
                                        <p><strong>{t('cityLabel')}:</strong> {appt.customerCity} | <strong>{t('addressLabel')}:</strong> {appt.customerAddress}</p>
                                        <p><strong>{t('seatLabel')}:</strong> {appt.seat?.name || t('unknownSeat')}</p>
                                        <p><strong>{t('timeLabel')}:</strong> {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString()}</p>
                                        <div>
                                          <strong>{t('servicesLabel')}:</strong>
                                          <ul className="services-list">
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
                                <h3>{t('bookAppointment')}</h3>
                              </div>

                              <form onSubmit={handleAppointmentSubmit} className="service-form">
                                <div className="form-grid">
                                  <label>
                                    {t('selectSeat')}
                                    <select name="seatId" value={appointmentForm.seatId} onChange={handleAppointmentChange} required>
                                      <option value="">{t('chooseSeat')}</option>
                                      {seats.filter(s => s.isActive).map((seat) => (
                                        <option key={seat.id} value={seat.id}>
                                          {seat.name}
                                        </option>
                                      ))}
                                    </select>
                                  </label>

                                  <label>
                                    {t('appointmentDate')}
                                    <input name="date" type="date" value={appointmentForm.date} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    {t('startTime')}
                                    <input name="startTime" type="time" value={appointmentForm.startTime} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    {t('customerName')}
                                    <input name="customerName" type="text" value={appointmentForm.customerName} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    {t('customerPhone')}
                                    <input name="customerPhone" type="tel" value={appointmentForm.customerPhone} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    {t('customerEmail')}
                                    <input name="customerEmail" type="email" value={appointmentForm.customerEmail} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label>
                                    {t('customerGender')}
                                    <select name="customerGender" value={appointmentForm.customerGender} onChange={handleAppointmentChange} required>
                                      <option value="Male">{t('male')}</option>
                                      <option value="Female">{t('female')}</option>
                                      <option value="Other">{t('other')}</option>
                                    </select>
                                  </label>

                                  <label>
                                    {t('customerCity')}
                                    <input name="customerCity" type="text" value={appointmentForm.customerCity} onChange={handleAppointmentChange} required />
                                  </label>

                                  <label className="full-width">
                                    {t('customerAddress')}
                                    <input name="customerAddress" type="text" value={appointmentForm.customerAddress} onChange={handleAppointmentChange} required />
                                  </label>

                                  <div className="full-width">
                                    <label>{t('selectServices')}</label>
                                    <div className="services-checkbox-grid">
                                      {services.filter(s => s.status === 'active').map((service) => (
                                        <label key={service.id} className="checkbox-label">
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
                                <button type="submit" className="primary full-width" disabled={submitting}>
                                  {submitting ? t('bookingAppointment') : t('bookAppointment')}
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
                  <h2 id="lookup-title">{t('lookupTitle')}</h2>
                  <p className="page-description">
                    {t('lookupDesc')}
                  </p>
                </div>

                <form onSubmit={handleLookupSearch} className="form-grid">
                  <label>
                    {t('emailAddress')}
                    <input
                      name="lookupEmail"
                      type="email"
                      placeholder={t('emailPlaceholder')}
                      value={lookupEmail}
                      onChange={(e) => setLookupEmail(e.target.value)}
                      aria-label={t('emailAddress')}
                    />
                  </label>

                  <label>
                    {t('phoneNumber')}
                    <input
                      name="lookupPhone"
                      type="tel"
                      placeholder={t('phonePlaceholder')}
                      value={lookupPhone}
                      onChange={(e) => setLookupPhone(e.target.value)}
                      aria-label={t('phoneNumber')}
                    />
                  </label>

                  <button type="submit" className="primary full-width" disabled={searchingAppointments}>
                    {searchingAppointments ? t('searching') : t('findAppointments')}
                  </button>
                </form>

                {lookupResults.length > 0 && (
                  <div className="lookup-results">
                    <h3>{t('bookingResults')}</h3>
                    {lookupResults.map((appt) => (
                      <article key={appt.id} className="salon-card lookup-card">
                        <div className="salon-card-inner appointment-detail-grid">
                          <div className="appointment-detail-header">
                            <strong>{appt.salon?.name || t('salon')}</strong>
                            <span className="status-badge">{appt.status || t('scheduled')}</span>
                          </div>
                          <p><strong>{t('addressLabel')}:</strong> {appt.salon?.address}, {appt.salon?.city}</p>
                          <p><strong>{t('seatLabel')}:</strong> {appt.seat?.name || t('unknownSeat')}</p>
                          <p><strong>{t('dateTime')}:</strong> {new Date(appt.startTime).toLocaleString()} - {new Date(appt.endTime).toLocaleTimeString()}</p>
                          <div>
                            <strong>{t('bookedServices')}:</strong>
                            <ul className="services-list">
                              {appt.services?.map((srv, idx) => (
                                <li key={idx}>{srv.service_name} (${srv.price} • {srv.duration_minutes} mins)</li>
                              ))}
                            </ul>
                          </div>
                          <div className="customer-footer">
                            <strong>{t('forLabel')}:</strong> {appt.customerName} ({appt.customerPhone})
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
                <div className="auth-header">
                  <div>
                    <span className="panel-label">{t('ownerAccess')}</span>
                    <h2 id="auth-title">{mode === 'register' ? t('registerOwner') : t('ownerLogin')}</h2>
                    <p className="page-description">
                      {mode === 'register'
                        ? t('registerOwnerDesc')
                        : t('ownerLoginDesc')}
                    </p>
                  </div>
                  <div className="auth-toggle">
                    <button
                      type="button"
                      className={mode === 'login' ? 'primary btn-compact' : 'secondary btn-compact'}
                      onClick={() => handleModeChange('login')}
                    >
                      {t('login')}
                    </button>
                    <button
                      type="button"
                      className={mode === 'register' ? 'primary btn-compact' : 'secondary btn-compact'}
                      onClick={() => handleModeChange('register')}
                    >
                      {t('register')}
                    </button>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="form-grid">
                  {mode === 'register' && (
                    <label>
                      {t('name')}
                      <input name="name" type="text" value={form.name} onChange={handleChange} required aria-label={t('name')} />
                    </label>
                  )}

                  <label>
                    {t('emailAddress')}
                    <input name="email" type="email" value={form.email} onChange={handleChange} required aria-label={t('emailAddress')} />
                  </label>

                  {mode === 'register' && (
                    <label>
                      {t('phoneNumber')}
                      <input name="phone" type="tel" value={form.phone} onChange={handleChange} required aria-label={t('phoneNumber')} />
                    </label>
                  )}

                  <label>
                    {t('password')}
                    <input name="password" type="password" value={form.password} onChange={handleChange} required aria-label={t('password')} />
                  </label>

                  <button type="submit" className="primary full-width" disabled={submitting}>
                    {submitting ? t('submitting') : mode === 'register' ? t('registerAccount') : t('login')}
                  </button>
                </form>
              </section>
            )}

            {activeView === 'owner-portal' && user && (
              <>
                <section className="dashboard-welcome" aria-label="Dashboard welcome">
                  <div className="dashboard-welcome-copy">
                    <span className="dashboard-welcome-eyebrow">{t('managementSuite')}</span>
                    <h2>{t('goodDay', { name: user.name.split(' ')[0] })}</h2>
                    <p>{t('dashboardWelcome')}</p>
                  </div>
                  <div className="dashboard-welcome-actions">
                    <button type="button" className="primary btn-compact" onClick={() => document.getElementById('salon-create-title')?.scrollIntoView({ behavior: 'smooth' })}>
                      <Icon name="plus" />
                      {t('newSalon')}
                    </button>
                    <button type="button" className="secondary btn-compact" onClick={loadSalons} disabled={loadingSalons}>
                      <Icon name="refresh" />
                      {t('refresh')}
                    </button>
                  </div>
                </section>

                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <div className="stat-icon"><Icon name="store" /></div>
                      <span className="stat-trend">{t('portfolio')}</span>
                    </div>
                    <div className="stat-body">
                      <h4>{t('salonsListed')}</h4>
                      <div className="stat-value">
                        {salons.filter((s) => s.ownerId && Number(s.ownerId) === Number(user.id)).length}
                      </div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <div className="stat-icon"><Icon name="chair" /></div>
                      <span className="stat-trend">{t('selected')}</span>
                    </div>
                    <div className="stat-body">
                      <h4>{t('activeSalon')}</h4>
                      <div className={`stat-value text ${selectedSalon ? '' : 'muted'}`}>
                        {selectedSalon ? selectedSalon.name : t('noneSelected')}
                      </div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <div className="stat-icon"><Icon name="calendar" /></div>
                      <span className="stat-trend">{t('clients')}</span>
                    </div>
                    <div className="stat-body">
                      <h4>{t('bookings')}</h4>
                      <div className="stat-value">
                        {selectedSalon ? appointments.length : 0}
                      </div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-card-top">
                      <div className="stat-icon"><Icon name="sparkle" /></div>
                      <span className="stat-trend">{t('menu')}</span>
                    </div>
                    <div className="stat-body">
                      <h4>{t('services')}</h4>
                      <div className="stat-value">
                        {selectedSalon ? services.length : '—'}
                      </div>
                    </div>
                  </div>
                </div>

                <section className="panel" aria-labelledby="salon-create-title">
                  <div className="section-header">
                    <div>
                      <span className="panel-label">{editingSalonId ? t('updateProfile') : t('newListing')}</span>
                      <h2 id="salon-create-title">{editingSalonId ? t('editSalon') : t('createSalon')}</h2>
                      <p className="page-description">
                        {editingSalonId ? t('editSalonDesc') : t('createSalonDesc')}
                      </p>
                    </div>
                    {editingSalonId && (
                      <button type="button" className="secondary" onClick={cancelSalonEdit}>
                        {t('cancelEdit')}
                      </button>
                    )}
                  </div>

                  <form onSubmit={editingSalonId ? handleSalonUpdate : handleSalonSubmit} className="form-grid">
                    <label>
                      {t('salonName')}
                      <input name="name" type="text" value={salonForm.name} onChange={handleSalonChange} required aria-label={t('salonName')} />
                    </label>
                    <label>
                      {t('publicPhone')}
                      <input name="phoneNumber" type="tel" value={salonForm.phoneNumber} onChange={handleSalonChange} required aria-label={t('publicPhone')} />
                    </label>
                    <label>
                      {t('address')}
                      <input name="address" type="text" value={salonForm.address} onChange={handleSalonChange} required aria-label={t('address')} />
                    </label>
                    <label>
                      {t('city')}
                      <input name="city" type="text" value={salonForm.city} onChange={handleSalonChange} required aria-label={t('city')} />
                    </label>
                    <label>
                      {t('state')}
                      <input name="state" type="text" value={salonForm.state} onChange={handleSalonChange} required aria-label={t('state')} />
                    </label>
                    <label>
                      {t('pincode')}
                      <input name="pincode" type="text" value={salonForm.pincode} onChange={handleSalonChange} required aria-label={t('pincode')} />
                    </label>
                    <label className="full-width">
                      {t('description')}
                      <textarea name="description" value={salonForm.description} onChange={handleSalonChange} rows="4" aria-label={t('description')} />
                    </label>
                    <label>
                      {t('logo')}
                      <input name="logo" type="file" accept="image/*" onChange={handleSalonChange} aria-label={t('logo')} />
                    </label>
                    <label>
                      {t('banner')}
                      <input name="banner" type="file" accept="image/*" onChange={handleSalonChange} aria-label={t('banner')} />
                    </label>
                    <label className="full-width">
                      {t('photos')}
                      <input name="photos" type="file" accept="image/*" multiple onChange={handleSalonChange} aria-label={t('photos')} />
                    </label>
                    <button type="submit" className="primary" disabled={submitting}>
                      {submitting ? (editingSalonId ? t('updatingSalon') : t('creatingSalon')) : (editingSalonId ? t('updateSalon') : t('createSalon'))}
                    </button>
                  </form>
                </section>

                <section className="panel" aria-labelledby="owner-salons-title">
                  <div className="section-header">
                    <div>
                      <span className="panel-label">{t('yourPortfolio')}</span>
                      <h2 id="owner-salons-title">{t('mySalons')}</h2>
                      <p className="page-description">{t('mySalonsDesc')}</p>
                    </div>
                    <button type="button" className="secondary btn-compact" onClick={loadSalons} disabled={loadingSalons}>
                      {t('refresh')}
                    </button>
                  </div>

                  {loadingSalons ? (
                    <p className="loading-text">{t('loadingSalons')}</p>
                  ) : salons.filter((s) => s.ownerId && Number(s.ownerId) === Number(user.id)).length === 0 ? (
                    <div className="empty-state">
                      <div className="empty-state-icon"><Icon name="store" /></div>
                      <p style={{ whiteSpace: 'pre-line' }}>{t('emptySalons')}</p>
                    </div>
                  ) : (
                    <div className="salon-list">
                      {salons
                        .filter((salon) => salon.ownerId && Number(salon.ownerId) === Number(user.id))
                        .map((salon) => (
                          <article key={salon.id} className="salon-card">
                            <div className="salon-card-inner">
                              <div className="salon-card-header">
                                <SalonInitials name={salon.name} />
                                <div className="salon-card-body">
                                  <strong>{salon.name}</strong>
                                  <div className="salon-card-meta">
                                    <span className="salon-meta-item"><Icon name="map-pin" /> {salon.address}, {salon.city}</span>
                                    <span className="salon-meta-item"><Icon name="phone" /> {salon.phoneNumber}</span>
                                  </div>
                                  {salon.description && <p className="salon-card-desc">{salon.description}</p>}
                                </div>
                              </div>
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
                                {t('manageSalon')}
                              </button>
                              <button type="button" className="secondary" onClick={() => handleSalonEdit(salon)}>
                                {t('editDetails')}
                              </button>
                              <button type="button" className="danger" onClick={() => handleSalonDelete(salon.id)}>
                                {t('delete')}
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

