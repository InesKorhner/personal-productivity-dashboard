
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';


export function getApiUrl(endpoint: string): string {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${API_URL}/${cleanEndpoint}`;
}
