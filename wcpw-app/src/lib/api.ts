export const API_BASE = "https://wcpw-network.vercel.app";

export function apiUrl(path: string) {
  return `${API_BASE}${path}`;
}