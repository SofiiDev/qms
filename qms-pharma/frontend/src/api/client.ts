import axios from 'axios';

let authToken: string | null = null;
let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? 'http://localhost:4000',
  withCredentials: true,
});

apiClient.interceptors.request.use((config) => {
  if (authToken) config.headers.Authorization = `Bearer ${authToken}`;
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const original = error.config as any;
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true;
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) return reject(error);
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }
      isRefreshing = true;
      try {
        const response = await apiClient.post('/api/auth/refresh');
        const newToken = response.data.access_token as string;
        setAuthToken(newToken);
        pendingQueue.forEach((cb) => cb(newToken));
        pendingQueue = [];
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      } catch {
        setAuthToken(null);
        pendingQueue.forEach((cb) => cb(null));
        pendingQueue = [];
        window.location.href = '/login';
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);
