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

const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || 'https://api.tritechtechnologyllc.com';
const AUTH_LOGIN_PATH = process.env.NEXT_PUBLIC_API_AUTH_LOGIN || '/t/auth/login';
const AUTH_PIN_LOGIN_PATH = process.env.NEXT_PUBLIC_API_AUTH_PIN_LOGIN || '/t/auth/pin-login';
const AUTH_LOGOUT_PATH = process.env.NEXT_PUBLIC_API_AUTH_LOGOUT || '/t/auth/logout';
const AUTH_PROFILE_PATH = process.env.NEXT_PUBLIC_API_AUTH_PROFILE || '/t/auth/profile';
const AUTH_REFRESH_PATH = process.env.NEXT_PUBLIC_API_AUTH_REFRESH || '/t/auth/token/refresh';

const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || '').toLowerCase() === 'true';
function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

function getTenantSlug(): string | null {
  const envSlug = process.env.NEXT_PUBLIC_TENANT_SLUG || '';
  if (envSlug) return envSlug;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tenant_slug') || null;
  }
  return null;
}

function getTenantId(): string | null {
  const envId = process.env.NEXT_PUBLIC_TENANT_ID || '';
  if (envId) return envId;
  if (typeof window !== 'undefined') {
    return localStorage.getItem('tenant_id') || null;
  }
  return null;
}

function buildHeaders(token?: string, extra?: Record<string, string>) {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
  const slug = getTenantSlug();
  const id = getTenantId();
  if (slug) headers['x-tenant-slug'] = slug;
  else if (id) headers['x-tenant-id'] = id;
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return { ...headers, ...(extra || {}) };
}

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
      
      const response = await fetch(buildUrl(AUTH_LOGIN_PATH), {
        method: 'POST',
        headers: buildHeaders(undefined),
        body: JSON.stringify({ email, password, role })
      });

      console.log('📡 Login Response Status:', response.status);

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error('❌ Non-JSON response:', text.substring(0, 200));
        return { success: false, error: 'Server returned invalid response' };
      }

      const data: any = await response.json();

      // Handle backend response: { status, message, result: { token, user } }
      if (response.ok && data.result && data.result.token) {
        const token = data.result.token;
        const user = data.result.user || data.result;

        // Store authentication data
        this.setTokens(token, token);
        this.setUser(user);

        // Store tenant slug in localStorage for future requests
        if (typeof window !== 'undefined') {
          localStorage.setItem('tenant_slug', getTenantSlug());
        }

        return { success: true, user };
      } else {
        console.error('❌ Login failed:', data);

        // Extract error message from various possible formats
        let errorMessage = 'Invalid credentials';

        if (typeof data.error === 'string') {
          errorMessage = data.error;
        } else if (data.error && typeof data.error === 'object' && data.error.message) {
          errorMessage = data.error.message;
        } else if (typeof data.message === 'string') {
          errorMessage = data.message;
        }

        return {
          success: false,
          error: errorMessage,
          errors: data.errors
        };
      }
    } catch (error: unknown) {
      console.error('💥 Login error:', error);
      if (error instanceof Error) {
        return { success: false, error: `Network error: ${error.message}` };
      }
      return { success: false, error: 'Network connection failed' };
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
    
    const response = await fetch(buildUrl(AUTH_PIN_LOGIN_PATH), {
      method: 'POST',
      headers: buildHeaders(undefined),
      body: JSON.stringify(requestBody)
    });

    console.log('PIN Login response status:', response.status);
    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) {
      const text = await response.text();
      console.error('PIN login non-JSON response:', text);
      return { success: false, error: 'Unexpected response from server', message: text };
    }
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
      const response = await fetch(buildUrl('/t/auth/create-staff'), {
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
      const response = await fetch(buildUrl(`/t/auth/users/${userId}/reset-password`), {
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
      const response = await fetch(buildUrl('/t/auth/users'), {
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
      const response = await fetch(buildUrl(`/t/auth/users/${userId}/update-pin`), {
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
      const response = await fetch(buildUrl(`/t/auth/users/${userId}/toggle-status`), {
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
      const response = await fetch(buildUrl(AUTH_PROFILE_PATH), {
        headers: buildHeaders(this.token || undefined)
      });

      const data: any = await response.json();

      // Backend returns: { status, message, result: { user } }
      if (response.ok && data.result) {
        return { success: true, data: data.result };
      } else {
        return { success: false, error: data.message || 'Profile fetch failed' };
      }
    } catch (error) {
      console.error('Get profile error:', error);
      return { success: false, error: 'Network error' };
    }
  }

  async refreshAccessToken(): Promise<boolean> {
    if (!this.refreshToken) return false;

    try {
      const response = await fetch(buildUrl(AUTH_REFRESH_PATH), {
        method: 'POST',
        headers: buildHeaders(undefined),
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
        await fetch(buildUrl(AUTH_LOGOUT_PATH), {
          method: 'POST',
          headers: buildHeaders(this.token || undefined),
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
      localStorage.removeItem('user');
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
          ...buildHeaders(this.token || undefined, options.headers as Record<string, string>)
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

      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        const data: ApiResponse<T> = await response.json();
        return data;
      } else {
        const text = await response.text();
        console.error('Non-JSON response for authenticated request:', text);
        return { success: false, error: 'Unexpected non-JSON response', message: text } as ApiResponse<T>;
      }
    } catch (error) {
      console.error('Authenticated request error:', error);
      return { success: false, error: 'Request failed' };
    }
  }
}

export default new AuthService();