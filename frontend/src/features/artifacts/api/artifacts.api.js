import { authFetch } from '@/features/auth/api/auth.api'

export const getProjectArtifacts = async (token, projectId) => {
  return authFetch(`/artifacts/project/${projectId}`, {
    method: 'GET',
    token,
  })
}

export const updateArtifact = async (token, artifactId, payload) => {
  return authFetch(`/artifacts/${artifactId}`, {
    method: 'PUT',
    token,
    body: JSON.stringify(payload)
  })
}

export const getArtifactsZipUrl = (projectId) => {
  // Since this is a direct download link, we return the URL.
  // Note: For authenticated download via browser, we either need to send token via query param
  // or use a service worker. For now, assuming cookie or simple URL.
  // We can also fetch the blob via fetch API and trigger download.
  return `${import.meta.env.VITE_API_URL}/api/artifacts/project/${projectId}/export`;
}

export const downloadArtifactsZip = async (token, projectId) => {
  const url = getArtifactsZipUrl(projectId);
  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  if (!response.ok) throw new Error("Download failed");
  const blob = await response.blob();
  const downloadUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = downloadUrl;
  a.download = `project-${projectId}-artifacts.zip`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(downloadUrl);
  document.body.removeChild(a);
}
