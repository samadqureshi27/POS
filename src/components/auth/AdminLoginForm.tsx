"use client";
import React, { useState } from 'react';
import { ArrowLeft, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import Button from '@/components/layout/UI/RoleButton';
import Input from '@/components//layout/UI/Input';
import ErrorMessage from '@/components/layout/UI/ErrorMessage';

interface AdminLoginFormProps {
  onBack: () => void;
  onSubmit: (credentials: { email: string; password: string; role: 'admin' }) => void;
  onForgotPassword: () => void;
  isLoading: boolean;
  error: string | null;
}

const AdminLoginForm: React.FC<AdminLoginFormProps> = ({
  onBack,
  onSubmit,
  onForgotPassword,
  isLoading,
  error
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});

  const validateForm = () => {
    const errors: { email?: string; password?: string } = {};
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit({ email, password, role: 'admin' });
    }
  };

  return (
    <div 
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: '#d1ab35' }}
    >
      {/* Background pattern */}
      <img
        src="/images/login-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 h-full w-auto object-contain opacity-20"
        draggable={false}
      />

      {/* Back button */}
      <button
        onClick={onBack}
        className="absolute top-8 left-8 z-10 flex items-center gap-2 text-black hover:text-gray-700 transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft size={24} />
        <span className="text-lg font-medium">Back</span>
      </button>

      {/* Login form */}
      <div className="relative z-10 w-full max-w-md mx-auto px-6">
        <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Login</h1>
            <p className="text-gray-600">Enter your credentials to access the admin panel</p>
          </div>

          {error && (
            <ErrorMessage message={error} className="mb-6" />
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              icon={<Mail size={20} />}
              error={validationErrors.email}
              disabled={isLoading}
              required
            />

            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              icon={<Lock size={20} />}
              rightIcon={
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              }
              error={validationErrors.password}
              disabled={isLoading}
              required
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={onForgotPassword}
                className="text-sm text-yellow-600 hover:text-yellow-500 font-medium"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              isLoading={isLoading}
              disabled={isLoading}
            >
              Sign In as Admin
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginForm;