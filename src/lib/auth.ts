import { LoginCredentials, User } from "../types/auth";

// src/lib/auth.ts
export const mockLogin = async (credentials: LoginCredentials): Promise<User> => {
  // Mock authentication logic
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '1',
        email: credentials.email,
        role: 'admin'
      });
    }, 1000);
  });
};

export const mockPinLogin = async (pin: string): Promise<User> => {
  // Mock PIN authentication
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: '2',
        email: 'manager@example.com',
        role: 'manager'
      });
    }, 1000);
  });
};