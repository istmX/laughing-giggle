import { getBaseUrl } from '../../auth/api/auth.api';

import { authFetch } from '../../auth/api/auth.api';

const adminFetch = async (path, options = {}) => {
  const response = await authFetch(path, options);
  
  if (response.error || (response.statusCode && response.statusCode >= 400)) {
    throw new Error(response.message || 'Admin request failed');
  }

  return response;
};

export const getAdminStats = async () => adminFetch('/admin/stats', { method: 'GET' });
export const getAdminUsers = async () => adminFetch('/admin/users', { method: 'GET' });
export const getAdminProjects = async () => adminFetch('/admin/projects', { method: 'GET' });
export const updateAdminUser = async (userId, data) => adminFetch(`/admin/users/${userId}`, {
  method: 'PUT',
  body: JSON.stringify(data),
});
export const createAdminUser = async (data) => adminFetch(`/admin/users`, {
  method: 'POST',
  body: JSON.stringify(data),
});
export const deleteAdminUser = async (userId) => adminFetch(`/admin/users/${userId}`, {
  method: 'DELETE',
});
export const deleteAdminProject = async (projectId) => adminFetch(`/admin/projects/${projectId}`, {
  method: 'DELETE',
});
