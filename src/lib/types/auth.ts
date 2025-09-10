// src/types/auth.ts

export type UserRole = 'superadmin' | 'admin' | 'manager' | 'cashier' | 'waiter';

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  pin?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
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
  errors?: Record<string, any>;
  error?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, any>;
  error?: string;
}

export interface CreateStaffData {
  username: string;
  email?: string; // Optional email field from your authService
  role: 'manager' | 'cashier' | 'waiter';
  pin: string;
  // Note: Admin cannot set email/password - only PIN-based staff
}

export interface ResetPasswordData {
  password: string;
}

// Admin permissions - what admin can do vs superadmin
export interface AdminPermissions {
  canCreateStaff: boolean; // PIN-only users
  canResetPasswords: boolean; // Can reset existing passwords
  canCreateAdmins: false; // Cannot create email/password admin accounts
  canManageOwnUsers: boolean; // Only users they created
  canDeleteUsers: boolean;
  canToggleUserStatus: boolean;
}

export interface UpdatePinData {
  pin: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string, role?: 'admin') => Promise<LoginResponse>;
  pinLogin: (pin: string, role?: string) => Promise<LoginResponse>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<boolean>;
  updateUser: (user: User) => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
  hasPermission: (requiredRole: UserRole) => boolean;
  isAdmin: () => boolean;
  isStaff: () => boolean;
}

// Component Props Types
export interface PinLoginProps {
  onLogin: (user: User) => void;
  onError: (message: string) => void;
  className?: string;
}

export interface AdminLoginProps {
  onLogin: (user: User) => void;
  onError: (message: string) => void;
  className?: string;
}

export interface UserListProps {
  users: User[];
  onUpdatePin: (userId: string, newPin: string) => Promise<void>;
  onToggleStatus: (userId: string) => Promise<void>;
  onResetPassword: (userId: string, newPassword: string) => Promise<void>;
  isLoading: boolean;
  className?: string;
}

export interface CreateStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (user: User) => void;
  className?: string;
}

// Staff Management Component Props (based on your StaffManagement component)
export interface StaffManagementProps {
  className?: string;
}

// Modal Props for Reset Password
export interface ResetPasswordModalProps {
  isOpen: boolean;
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

// API Endpoints Response Types
export interface UsersListResponse extends ApiResponse<User[]> {
  data: User[];
  total?: number;
}

export interface UserProfileResponse extends ApiResponse<User> {
  data: User;
}

export interface CreateStaffResponse extends ApiResponse<User> {
  data: User;
  user: User; // Your authService returns both 'data' and 'user'
}

export interface UpdatePinResponse extends ApiResponse<User> {
  data: User;
}

export interface ToggleStatusResponse extends ApiResponse<User> {
  data: User;
}

export interface ResetPasswordResponse extends ApiResponse<User> {
  data: User;
}

export interface RefreshTokenResponse {
  access: string;
  refresh?: string;
}

// Form Data Interfaces
export interface AdminLoginFormData {
  email: string;
  password: string;
}

export interface PinLoginFormData {
  pin: string;
}

export interface CreateStaffFormData extends CreateStaffData {
  confirmPin?: string; // For form validation
}

export interface ResetPasswordFormData {
  newPassword: string;
  confirmPassword: string;
}

export interface UpdatePinFormData {
  currentPin?: string;
  newPin: string;
  confirmPin: string;
}

// Auth Service Interface (for better type safety)
export interface IAuthService {
  adminLogin(email: string, password: string): Promise<LoginResponse>;
  pinLogin(pin: string): Promise<LoginResponse>;
  createStaff(staffData: CreateStaffData): Promise<ApiResponse<User>>;
  resetUserPassword(userId: string, newPassword: string): Promise<ApiResponse<User>>;
  getUsers(): Promise<ApiResponse<User[]>>;
  updateUserPin(userId: string, newPin: string): Promise<ApiResponse<User>>;
  toggleUserStatus(userId: string): Promise<ApiResponse<User>>;
  getProfile(): Promise<ApiResponse<User>>;
  refreshAccessToken(): Promise<boolean>;
  logout(): Promise<void>;
  isAuthenticated(): boolean;
  getCurrentUser(): User | null;
  getToken(): string | null;
  makeAuthenticatedRequest<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>>;
}

// Error Types
export interface AuthError {
  code: string;
  message: string;
  field?: string;
}

export interface ValidationErrors {
  [field: string]: string[];
}

// util Types
export type StaffRole = Extract<UserRole, 'manager' | 'cashier' | 'waiter'>;
export type AdminRole = Extract<UserRole, 'superadmin' | 'admin'>;

// Constants (you might want to export these from a separate constants file)
export const USER_ROLES = {
  SUPERADMIN: 'superadmin' as const,
  ADMIN: 'admin' as const,
  MANAGER: 'manager' as const,
  CASHIER: 'cashier' as const,
  WAITER: 'waiter' as const,
} as const;

export const ROLE_HIERARCHY = {
  [USER_ROLES.SUPERADMIN]: 5,
  [USER_ROLES.ADMIN]: 4,
  [USER_ROLES.MANAGER]: 3,
  [USER_ROLES.CASHIER]: 2,
  [USER_ROLES.WAITER]: 1,
} as const;

// Permission helpers type
export type PermissionChecker = {
  canCreateStaff: (userRole: UserRole) => boolean;
  canResetPassword: (userRole: UserRole) => boolean;
  canToggleUserStatus: (userRole: UserRole) => boolean;
  canManageUser: (currentUserRole: UserRole, targetUserRole: UserRole) => boolean;
};

// State Management Types (if you're using Redux/Zustand)
export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;
}

export interface AuthActions {
  setUser: (user: User | null) => void;
  setTokens: (tokens: AuthTokens | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearAuth: () => void;
  updateLastActivity: () => void;
}