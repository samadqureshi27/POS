import { LoginCredentials, AuthResponse, ForgotPasswordData, ForgotPasswordResponse } from '@/types/auth';

// Simulate network delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock user data
const MOCK_USERS = {
  admin: {
    'admin@example.com': { password: 'admin123', name: 'John Admin' },
    'admin@test.com': { password: 'password123', name: 'Test Admin' }
  },
  manager: {
    'manager@example.com': { pin: '1234', name: 'Jane Manager' },
    'manager@test.com': { pin: '5678', name: 'Test Manager' }
  }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  await delay(1000); // Simulate API call delay

  const { email, password, pin, role } = credentials;

  try {
    if (role === 'admin') {
      const adminData = MOCK_USERS.admin[email as keyof typeof MOCK_USERS.admin];
      if (adminData && adminData.password === password) {
        return {
          success: true,
          user: {
            id: `admin_${Date.now()}`,
            email,
            role: 'admin',
            name: adminData.name,
            lastLogin: new Date().toISOString()
          },
          token: `mock_admin_token_${Date.now()}`
        };
      }
    } else if (role === 'manager') {
      const managerData = MOCK_USERS.manager[email as keyof typeof MOCK_USERS.manager];
      if (managerData && managerData.pin === pin) {
        return {
          success: true,
          user: {
            id: `manager_${Date.now()}`,
            email,
            role: 'manager',
            name: managerData.name,
            lastLogin: new Date().toISOString()
          },
          token: `mock_manager_token_${Date.now()}`
        };
      }
    }

    // Invalid credentials
    return {
      success: false,
      message: 'Invalid credentials. Please check your email and password/PIN.'
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during login. Please try again.'
    };
  }
};

export const forgotPassword = async (data: ForgotPasswordData): Promise<ForgotPasswordResponse> => {
  await delay(800);

  const { email } = data;

  // Check if email exists in our mock data
  const adminExists = MOCK_USERS.admin[email as keyof typeof MOCK_USERS.admin];
  const managerExists = MOCK_USERS.manager[email as keyof typeof MOCK_USERS.manager];

  if (adminExists || managerExists) {
    return {
      success: true,
      message: 'Password reset link sent successfully.'
    };
  }

  return {
    success: false,
    message: 'No account found with this email address.'
  };
};