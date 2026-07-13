import { authFetch } from '@/features/auth/api/auth.api'

export const getMe = async (token) => {
  return authFetch('/auth/me', {
    method: 'GET',
    token,
  })
}

export const getProfile = async () => {
  return authFetch('/profile', { method: 'GET' });
};

export const updateProfile = async (data) => {
  return authFetch('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const updatePfp = async (pfpUrl) => {
  return authFetch('/profile/pfp', {
    method: 'PUT',
    body: JSON.stringify({ pfpUrl }),
  });
};

export const deleteAccount = async () => {
  return authFetch('/profile', { method: 'DELETE' });
};
