// Form validation schemas and functions

export const validateEmail = (email: string): string | null => {
  if (!email) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email address';
  return null;
};

export const validatePassword = (password: string): string | null => {
  if (!password) return 'Password is required';
  if (password.length < 6) return 'Password must be at least 6 characters long';
  if (password.length > 128) return 'Password is too long';
  return null;
};

export const validatePin = (pin: string): string | null => {
  if (!pin) return 'PIN is required';
  if (pin.length !== 4) return 'PIN must be exactly 4 digits';
  if (!/^\d+$/.test(pin)) return 'PIN must contain only numbers';
  return null;
};

export const validateLoginForm = (credentials: {
  email: string;
  password?: string;
  pin?: string;
  role: 'admin' | 'manager';
}) => {
  const errors: { email?: string; password?: string; pin?: string } = {};

  const emailError = validateEmail(credentials.email);
  if (emailError) errors.email = emailError;

  if (credentials.role === 'admin') {
    const passwordError = validatePassword(credentials.password || '');
    if (passwordError) errors.password = passwordError;
  } else if (credentials.role === 'manager') {
    const pinError = validatePin(credentials.pin || '');
    if (pinError) errors.pin = pinError;
  }

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