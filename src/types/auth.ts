export type UserRole = 'admin' | 'manager';

export interface LoginCredentials {
  email: string;
  password?: string; // for admin
  pin?: string;      // for manager (4 digits)
  role: UserRole;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  lastLogin?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  message?: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ForgotPasswordResponse {
  success: boolean;
  message?: string;
}

export interface ResetPasswordData {
  token: string;
  newPassword: string;
  confirmPassword: string;
}
