const BASE_URL = '/api'

async function request(path, options = {}) {
  // attach JWT if available (skip for FormData)
  const token = typeof window !== 'undefined' ? window.localStorage.getItem('token') : null
  const headers = Object.assign({}, options.headers || {})
  if (token && !(options.body instanceof FormData)) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${BASE_URL}${path}`, { ...options, headers })
  const token = localStorage.getItem('salonAppToken')
  const headers = { ...(options.headers || {}) }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Request failed')
  }
  return data
}

export function registerUser(payload) {
  return request('/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload) {
  return request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function createSalon(formData) {
  return request('/salons', {
    method: 'POST',
    body: formData,
  })
}

export function getSalons() {
  return request('/salons')
}

export function deleteSalon(id) {
  return request(`/salons/${id}`, {
    method: 'DELETE',
  })
}

export function getSeatsBySalon(salonId) {
  return request(`/salons/${salonId}/seats`)
}

export function addSeat(salonId, payload) {
  return request(`/salons/${salonId}/seats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteSeat(id) {
  return request(`/seats/${id}`, {
    method: 'DELETE',
  })
}

export function toggleSeatStatus(id, isActive) {
  return request(`/seats/${id}/toggle-status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isActive }),
  })
}

export function getServicesBySalon(salonId) {
  return request(`/salons/${salonId}/services`)
}

export function addService(salonId, payload) {
  return request(`/salons/${salonId}/services`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteService(id) {
  return request(`/services/${id}`, {
    method: 'DELETE',
  })
}

export function toggleServiceStatus(id, status) {
  return request(`/services/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  })
}

export function getEmployeesBySalon(salonId) {
  return request(`/salons/${salonId}/employees`)
}

export function addEmployee(salonId, payload) {
  return request(`/salons/${salonId}/employees`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function updateEmployee(id, payload) {
  return request(`/employees/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function deleteEmployee(id) {
  return request(`/employees/${id}`, {
    method: 'DELETE',
  })
}

// Salon Management
export function getSalonById(id) {
  return request(`/salons/${id}`)
}

export function getMySalons() {
  return request('/salons/my-salons')
}

export function updateSalon(id, formData) {
  return request(`/salons/${id}`, {
    method: 'PUT',
    body: formData,
  })
}

// Service Management
export function editService(id, payload) {
  return request(`/services/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

// Appointments
export function bookAppointment(payload) {
  return request('/appointments', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getAvailability(seatId, date) {
  return request(`/seats/${seatId}/availability?date=${date}`)
}

export function getSalonAvailability(salonId) {
  return request(`/salons/${salonId}/seats-availability`)
}
