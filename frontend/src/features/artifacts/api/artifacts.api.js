import { authFetch, getBaseUrl } from '@/features/auth/api/auth.api'

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
  return `${getBaseUrl()}/artifacts/project/${projectId}/export`;
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
