// lib/mock-api.ts

// Types for API responses
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface AuthUser {
  id: number;
  email?: string;
  name: string;
  role: 'admin' | 'manager';
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface ResetTokenData {
  token: string;
  email: string;
  expires: number;
}

// Mock Database - In real app, this would be your actual database
class MockDatabase {
  private static instance: MockDatabase;
  
  private users = {
    admin: {
      id: 1,
      email: 'admin@example.com',
      password: 'admin123',
      name: 'John Admin',
      role: 'admin' as const
    },
    manager: {
      id: 2,
      pin: '1234',
      name: 'Jane Manager',
      role: 'manager' as const
    }
  };
  
  private resetTokens = new Map<string, ResetTokenData>();
  private otpCodes = new Map<string, { code: string; expires: number }>();

  static getInstance(): MockDatabase {
    if (!MockDatabase.instance) {
      MockDatabase.instance = new MockDatabase();
    }
    return MockDatabase.instance;
  }

  getAdminUser() {
    return this.users.admin;
  }

  getManagerUser() {
    return this.users.manager;
  }

  updateAdminPassword(newPassword: string) {
    this.users.admin.password = newPassword;
  }

  storeResetToken(email: string, token: string) {
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes
    this.resetTokens.set(email, { token, email, expires });
  }

  getResetToken(email: string): ResetTokenData | undefined {
    return this.resetTokens.get(email);
  }

  deleteResetToken(email: string) {
    this.resetTokens.delete(email);
  }

  storeOtpCode(email: string, code: string) {
    const expires = Date.now() + 5 * 60 * 1000; // 5 minutes
    this.otpCodes.set(email, { code, expires });
  }

  getOtpCode(email: string) {
    return this.otpCodes.get(email);
  }

  deleteOtpCode(email: string) {
    this.otpCodes.delete(email);
  }
}

// API Service Class
export class MockApiService {
  private static db = MockDatabase.getInstance();

  // Utility method to simulate network delay
  private static delay = (ms: number): Promise<void> => 
    new Promise(resolve => setTimeout(resolve, ms));

  // Generate mock JWT token
  private static generateToken(userId: number, role: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
    const payload = btoa(JSON.stringify({ 
      userId, 
      role, 
      iat: Date.now() / 1000,
      exp: (Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }));
    const signature = 'mock-signature-' + Math.random().toString(36);
    return `${header}.${payload}.${signature}`;
  }

  /**
   * Admin Authentication
   */
  static async adminLogin(email: string, password: string): Promise<ApiResponse<LoginResponse>> {
    await this.delay(1000);
    
    try {
      const user = this.db.getAdminUser();
      
      if (email === user.email && password === user.password) {
        const token = this.generateToken(user.id, user.role);
        
        return {
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              role: user.role
            }
          }
        };
      }
      
      return {
        success: false,
        error: 'Invalid email or password'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication service unavailable'
      };
    }
  }

  /**
   * Manager Authentication
   */
  static async managerLogin(pin: string): Promise<ApiResponse<LoginResponse>> {
    await this.delay(800);
    
    try {
      const user = this.db.getManagerUser();
      
      if (pin === user.pin) {
        const token = this.generateToken(user.id, user.role);
        
        return {
          success: true,
          data: {
            token,
            user: {
              id: user.id,
              name: user.name,
              role: user.role
            }
          }
        };
      }
      
      return {
        success: false,
        error: 'Invalid PIN code'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Authentication service unavailable'
      };
    }
  }

  /**
   * Password Reset - Send Email
   */
  static async sendResetEmail(email: string): Promise<ApiResponse<{ message: string; mockOtp?: string }>> {
    await this.delay(1500);
    
    try {
      const adminUser = this.db.getAdminUser();
      
      if (email !== adminUser.email) {
        return {
          success: false,
          error: 'Email not found in our system'
        };
      }
      
      // Generate reset token and OTP
      const resetToken = Math.random().toString(36).substring(2, 15);
      const otpCode = '12345'; // In real app, generate random 5-digit code
      
      // Store in mock database
      this.db.storeResetToken(email, resetToken);
      this.db.storeOtpCode(email, otpCode);
      
      console.log('📧 Mock Email Sent:');
      console.log(`To: ${email}`);
      console.log(`OTP Code: ${otpCode}`);
      console.log(`Reset Token: ${resetToken}`);
      
      return {
        success: true,
        data: {
          message: 'Reset code sent to your email',
          // Only include mockOtp in development/demo mode
          ...(process.env.NODE_ENV === 'development' && { mockOtp: otpCode })
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to send reset email'
      };
    }
  }

  /**
   * Verify OTP Code
   */
  static async verifyOtp(email: string, otp: string): Promise<ApiResponse<{ token: string; message: string }>> {
    await this.delay(1000);
    
    try {
      const resetTokenData = this.db.getResetToken(email);
      const otpData = this.db.getOtpCode(email);
      
      if (!resetTokenData || resetTokenData.expires < Date.now()) {
        return {
          success: false,
          error: 'Reset session has expired. Please request a new reset link.'
        };
      }
      
      if (!otpData || otpData.expires < Date.now()) {
        return {
          success: false,
          error: 'Verification code has expired'
        };
      }
      
      if (otp !== otpData.code) {
        return {
          success: false,
          error: 'Invalid verification code'
        };
      }
      
      // Clean up OTP (but keep reset token for password update)
      this.db.deleteOtpCode(email);
      
      return {
        success: true,
        data: {
          token: resetTokenData.token,
          message: 'OTP verified successfully'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Verification failed'
      };
    }
  }

  /**
   * Reset Password
   */
  static async resetPassword(token: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    await this.delay(1200);
    
    try {
      // Find the reset token
      let emailForToken: string | null = null;
      
      // In real app, you'd query database with token
      // Here we simulate by checking all stored tokens
      for (const [email, tokenData] of Array.from(MockDatabase.getInstance()['resetTokens'].entries())) {
        if (tokenData.token === token && tokenData.expires > Date.now()) {
          emailForToken = email;
          break;
        }
      }
      
      if (!emailForToken) {
        return {
          success: false,
          error: 'Invalid or expired reset token'
        };
      }
      
      // Update password
      this.db.updateAdminPassword(newPassword);
      
      // Clean up token
      this.db.deleteResetToken(emailForToken);
      
      return {
        success: true,
        data: {
          message: 'Password updated successfully'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to update password'
      };
    }
  }

  /**
   * Request PIN Reset (Manager)
   */
  static async requestPinReset(managerId?: string): Promise<ApiResponse<{ message: string; ticketId: string }>> {
    await this.delay(1000);
    
    try {
      const ticketId = `PIN-RESET-${Date.now()}`;
      
      // In real app, this would:
      // 1. Create a support ticket
      // 2. Notify administrators
      // 3. Send email to manager
      
      console.log('🎫 PIN Reset Request Created:');
      console.log(`Ticket ID: ${ticketId}`);
      console.log(`Manager ID: ${managerId || 'current-manager'}`);
      console.log(`Timestamp: ${new Date().toISOString()}`);
      
      return {
        success: true,
        data: {
          message: 'PIN reset request has been sent to administrators',
          ticketId
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Failed to submit PIN reset request'
      };
    }
  }

  /**
   * Validate Token (for authenticated requests)
   */
  static async validateToken(token: string): Promise<ApiResponse<AuthUser>> {
    await this.delay(300);
    
    try {
      // In real app, verify JWT signature and check database
      if (token.startsWith('mock-admin-jwt-token') || token.includes('admin')) {
        const user = this.db.getAdminUser();
        return {
          success: true,
          data: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        };
      }
      
      if (token.startsWith('mock-manager-jwt-token') || token.includes('manager')) {
        const user = this.db.getManagerUser();
        return {
          success: true,
          data: {
            id: user.id,
            name: user.name,
            role: user.role
          }
        };
      }
      
      return {
        success: false,
        error: 'Invalid or expired token'
      };
    } catch (error) {
      return {
        success: false,
        error: 'Token validation failed'
      };
    }
  }

  /**
   * Logout
   */
  static async logout(): Promise<ApiResponse<{ message: string }>> {
    await this.delay(200);
    
    try {
      // In real app, blacklist token on server
      return {
        success: true,
        data: {
          message: 'Logged out successfully'
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Logout failed'
      };
    }
  }
}

// Utility functions for easy migration to real API
export const createApiService = (baseUrl: string) => {
  return {
    adminLogin: (email: string, password: string) => 
      fetch(`${baseUrl}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      }).then(res => res.json()),
    
    managerLogin: (pin: string) =>
      fetch(`${baseUrl}/auth/manager/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin })
      }).then(res => res.json()),
    
    // Add other endpoints...
  };
};

export default MockApiService;