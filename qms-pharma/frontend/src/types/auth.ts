export type Role = 'ADMIN' | 'QUALITY_MANAGER' | 'QUALITY_ANALYST' | 'VIEWER';

export interface CurrentUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
}
