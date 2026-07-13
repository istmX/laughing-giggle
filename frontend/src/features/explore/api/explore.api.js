import { authFetch } from '@/features/auth/api/auth.api'

export const exploreApi = {
  getTopUsers: async () => {
    return authFetch(`/explore/users/top`)
  },
  
  searchUsers: async (query, page = 1, limit = 10) => {
    return authFetch(`/explore/users/search?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`)
  },
  
  getPublicUsers: async (page = 1, limit = 10) => {
    return authFetch(`/explore/users?page=${page}&limit=${limit}`)
  }
}
