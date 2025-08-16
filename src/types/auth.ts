export interface User {
  id: string;
  email: string;
  role: 'admin' | 'manager';
}

export interface LoginCredentials {
  email: string;
  password: string;
}