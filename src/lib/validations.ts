// Form validation schemas and functions

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters';
  if (password.length > 128) return 'Password is too long';
  return null;
};

export const validatePin = (pin: string[]): string | null => {
  const pinString = pin.join('');
  if (pinString.length !== 4) return 'Please enter a 4-digit PIN';
  if (!/^\d+$/.test(pinString)) return 'PIN must contain only numbers';
  return null;
};

export const validateOtp = (otp: string[]): string | null => {
  const otpString = otp.join('');
  if (otpString.length !== 5) return 'Please enter the 5-digit code';
  if (!/^\d+$/.test(otpString)) return 'Code must contain only numbers';
  return null;
};

export const validateNewPassword = (password: string, confirmPassword?: string): { newPassword?: string; confirmPassword?: string } => {
  const errors: { newPassword?: string; confirmPassword?: string } = {};
  
  if (!password) {
    errors.newPassword = 'New password is required';
  } else if (password.length < 6) {
    errors.newPassword = 'Password must be at least 6 characters';
  }
  
  if (confirmPassword !== undefined) {
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
  }
  
  return errors;
};

export const validateAdminLoginForm = (email: string, password: string) => {
  const errors: { email?: string; password?: string } = {};
  
  const emailError = validateEmail(email);
  if (emailError) errors.email = emailError;
  
  const passwordError = validatePassword(password);
  if (passwordError) errors.password = passwordError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateManagerPinForm = (pin: string[]) => {
  const errors: { pin?: string } = {};
  
  const pinError = validatePin(pin);
  if (pinError) errors.pin = pinError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateForgotPasswordForm = (email: string) => {
  const emailError = validateEmail(email);
  return {
    isValid: !emailError,
    error: emailError
  };
};

export const validateOtpForm = (otp: string[]) => {
  const otpError = validateOtp(otp);
  return {
    isValid: !otpError,
    error: otpError
  };
};

export const validateResetPasswordForm = (newPassword: string, confirmPassword: string) => {
  const errors = validateNewPassword(newPassword, confirmPassword);
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};