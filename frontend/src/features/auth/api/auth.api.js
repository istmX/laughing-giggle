const DEFAULT_BASE_URL = 'http://localhost:3000/api'

const getGoogleClientId = () => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
}

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL
}

const authFetch = async (path, options = {}) => {
  const { token, headers, ...rest } = options
  const response = await fetch(`${getBaseUrl()}${path}`, {
    ...rest,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  })

  const contentType = response.headers.get('content-type') || ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && (data.message || data.error)) ||
      (typeof data === 'string' && data) ||
      'Something went wrong'

    throw new Error(message)
  }

  return data
}

const loginUser = async ({ email, password }) => {
  return authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

const registerUser = async ({ name, username, email, password }) => {
  return authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, username, email, password }),
  })
}

const googleLogin = async ({ credential }) => {
  return authFetch('/auth/google-login', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  })
}

const logoutUser = async (token) => {
  return authFetch('/auth/logout', {
    method: 'POST',
    token: token,
  })
}

export { authFetch, getBaseUrl, getGoogleClientId, googleLogin, loginUser, logoutUser, registerUser }
