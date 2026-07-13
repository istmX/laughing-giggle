import { authFetch } from '@/features/auth/api/auth.api'

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001'

export const exploreApi = {
  getTopUsers: async () => {
    const response = await authFetch(`${BASE_URL}/api/explore/users/top`)
    if (!response.ok) {
      throw new Error('Failed to fetch top creators')
    }
    return response.json()
  },
  
  searchUsers: async (query, page = 1, limit = 10) => {
    const response = await authFetch(`${BASE_URL}/api/explore/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to search users')
    }
    return response.json()
  },
  
  getPublicUsers: async (page = 1, limit = 10) => {
    const response = await authFetch(`${BASE_URL}/api/explore/users?page=${page}&limit=${limit}`)
    if (!response.ok) {
      throw new Error('Failed to fetch users')
    }
    return response.json()
  }
}
