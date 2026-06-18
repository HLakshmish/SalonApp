const BASE_URL = '/api'

async function request(path, options = {}) {
  // attach JWT if available
  const token = typeof window !== 'undefined' ? (window.localStorage.getItem('salonAppToken') || window.localStorage.getItem('token')) : null
  const headers = { ...(options.headers || {}) }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  // Safely parse JSON only when body exists and is JSON
  let data = {}
  const contentType = response.headers.get('content-type') || ''
  const text = await response.text()
  if (text) {
    if (contentType.includes('application/json')) {
      try {
        data = JSON.parse(text)
      } catch (err) {
        // Invalid JSON — fallback to raw text
        data = { message: text }
      }
    } else {
      // Non-JSON response — return as message
      data = { message: text }
    }
  }

  if (!response.ok) {
    throw new Error((data && (data.error || data.message)) || 'Request failed')
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

export function getMyAppointments() {
  return request('/appointments/me')
}

export function getSalonAppointments(salonId) {
  return request(`/appointments/salon/${salonId}`)
}

export function getOwnerSalonsAppointments() {
  return request('/appointments/owner/salons')
}

export function updateSeat(id, payload) {
  return request(`/seats/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
}

export function getAppointmentsPublic(params) {
  const query = new URLSearchParams(params).toString()
  return request(`/appointments/my-appointments?${query}`)
}

