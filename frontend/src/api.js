const BASE_URL = '/api'

export async function registerUser(payload) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  const data = await response.json()
  if (!response.ok) {
    throw new Error(data.error || data.message || 'Registration failed')
  }

  return data
}
