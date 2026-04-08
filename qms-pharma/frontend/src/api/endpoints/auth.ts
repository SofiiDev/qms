import { apiClient } from '../client';
import type { CurrentUser } from '../../types/auth';

interface LoginResponse {
  access_token: string;
  user: CurrentUser;
}

export const authApi = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>('/api/auth/login', { email, password });
    return data;
  },
  async logout(): Promise<void> {
    await apiClient.post('/api/auth/logout');
  },
};
