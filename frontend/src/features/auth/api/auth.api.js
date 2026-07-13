import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';

const DEFAULT_BASE_URL = 'http://localhost:3000/api'

const getGoogleClientId = () => {
  return import.meta.env.VITE_GOOGLE_CLIENT_ID || ''
}

const getBaseUrl = () => {
  return import.meta.env.VITE_API_BASE_URL || DEFAULT_BASE_URL
}

const getStoredToken = () => {
  try {
    const stored = localStorage.getItem('zenix-auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed?.state?.token || null
    }
  } catch (e) {
    return null
  }
  return null
}

const authFetch = async (path, options = {}) => {
  const { headers, ...rest } = options

  await auth.authStateReady();
  let token = null;
  if (auth.currentUser) {
    token = await auth.currentUser.getIdToken();
  } else {
    token = getStoredToken();
  }

  const response = await fetch(`${getBaseUrl()}${path}`, {
    cache: 'no-cache',
    ...rest,
    credentials: 'omit',
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
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  const res = await authFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ token }),
  });
  return { ...res, token };
}

const registerUser = async ({ name, username, email, password }) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const token = await userCredential.user.getIdToken();
  const res = await authFetch('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ token, name, username }),
  });
  return { ...res, token };
}

const googleLogin = async ({ credential }) => {
  const res = await authFetch('/auth/google-login', {
    method: 'POST',
    body: JSON.stringify({ credential }),
  });
  return { ...res, token: credential };
}

const logoutUser = async () => {
  await auth.signOut();
  return authFetch('/auth/logout', {
    method: 'POST',
  })
}

export { authFetch, getBaseUrl, getGoogleClientId, googleLogin, loginUser, logoutUser, registerUser }
