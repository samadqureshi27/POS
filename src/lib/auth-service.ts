// src/lib/authService.ts

export interface User {
  id: string;
  username: string;
  email: string;
  role: 'superadmin' | 'admin' | 'manager' | 'cashier' | 'waiter';
  is_active: boolean;
  created_at: string;
  created_by?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  tokens?: AuthTokens;
  message?: string;
  errors?: any;
  error?: string;
}

export interface CreateStaffData {
  username: string;
  email?: string;
  role: 'manager' | 'cashier' | 'waiter';
  pin: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any;
  error?: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/auth';

class AuthService {
  private token: string | null = null;
  private refreshToken: string | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('accessToken');
      this.refreshToken = localStorage.getItem('refreshToken');
    }
  }

  // Updated admin login with proper role handling
  async adminLogin(
  email: string, 
  password: string, 
  role: 'admin' | 'manager' = 'admin'  // default set here
): Promise<LoginResponse> {

    try {
      console.log('Attempting login with role:', role);
      
      const response = await fetch(`${API_BASE_URL}/login/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password,
          role // Use the passed role instead of hardcoding
        })
      });
      
      console.log('Admin login response status:', response.status);
    const data: LoginResponse = await response.json();
    console.log('Admin login response data:', data);
    
    if (data.success && data.user && data.tokens) {
      this.setTokens(data.tokens.access, data.tokens.refresh);
      this.setUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { 
        success: false, 
        errors: data.errors, 
        error: data.error,
        message: data.message 
      };
    }
  } catch (error: unknown) {
    console.error('Admin login error:', error);
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: 'Unknown network error' };
  }
}

  // PIN login for staff (no changes needed here)
  async pinLogin(pin: string, role?: string): Promise<LoginResponse> {
  try {
    console.log('PIN Login attempt:', { pin: pin.replace(/./g, '*'), role });
    
    const requestBody: any = { pin };
    
    // Include role if provided (for manager login from role selection)
    if (role) {
      requestBody.role = role;
    }
    
    const response = await fetch(`${API_BASE_URL}/pin-login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    console.log('PIN Login response status:', response.status);
    const data: LoginResponse = await response.json();
    console.log('PIN Login response data:', data);
    
    if (data.success && data.user && data.tokens) {
      this.setTokens(data.tokens.access, data.tokens.refresh);
      this.setUser(data.user);
      return { success: true, user: data.user };
    } else {
      return { 
        success: false, 
        message: data.message,
        error: data.error,
        errors: data.errors
      };
    }
  } catch (error) {
    console.error('PIN login error:', error);
    return { success: false, error: 'Network error' };
  }
}


  // Rest of the methods remain the same...
  async createStaff(staffData: CreateStaffData): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/create-staff/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify(staffData)
      });

      const data: ApiResponse<User> = await response.json();
      return data;
    } catch (error) {
      console.error('Create staff error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async resetUserPassword(userId: string, newPassword: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/reset-password/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ password: newPassword })
      });

      const data: ApiResponse<User> = await response.json();
      return data;
    } catch (error) {
      console.error('Reset password error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getUsers(): Promise<ApiResponse<User[]>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data: ApiResponse<User[]> = await response.json();
      return data;
    } catch (error) {
      console.error('Get users error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async updateUserPin(userId: string, newPin: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/update-pin/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        body: JSON.stringify({ pin: newPin })
      });

      const data: ApiResponse<User> = await response.json();
      return data;
    } catch (error) {
      console.error('Update PIN error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async toggleUserStatus(userId: string): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}/toggle-status/`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data: ApiResponse<User> = await response.json();
      return data;
    } catch (error) {
      console.error('Toggle user status error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async getProfile(): Promise<ApiResponse<User>> {
    try {
      const response = await fetch(`${API_BASE_URL}/profile/`, {
        headers: {
          'Authorization': `Bearer ${this.token}`
        }
      });

      const data: ApiResponse<User> = await response.json();
      return data;
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(`${API_BASE_URL}/token/refresh/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh: this.refreshToken })
      });

      const data = await response.json();
      
      if (data.access) {
        this.token = data.access;
        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', data.access);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      if (this.refreshToken) {
        await fetch(`${API_BASE_URL}/logout/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.token}`
          },
          body: JSON.stringify({ refresh_token: this.refreshToken })
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      this.clearTokens();
    }
  }

  private setTokens(accessToken: string, refreshToken: string): void {
    this.token = accessToken;
    this.refreshToken = refreshToken;
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    }
  }

  private setUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  getUser(): User | null {
    if (typeof window !== 'undefined') {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    }
    return null;
  }

  private clearTokens(): void {
    this.token = null;
    this.refreshToken = null;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeUser('user');
    }
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getCurrentUser(): User | null {
    return this.getUser();
  }

  getToken(): string | null {
    return this.token;
  }

  async makeAuthenticatedRequest<T = any>(
    url: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`,
          ...options.headers
        }
      });

      if (response.status === 401) {
        const refreshed = await this.refreshAccessToken();
        if (refreshed) {
          return this.makeAuthenticatedRequest(url, options);
        } else {
          await this.logout();
          throw new Error('Authentication expired');
        }
      }

      const data: ApiResponse<T> = await response.json();
      return data;
    } catch (error) {
      console.error('Authenticated request error:', error);
      return { success: false, error: 'Request failed' };
    }
  }
}

export default new AuthService();