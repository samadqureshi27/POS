"use client";
import React, { useState, useEffect } from 'react';
import { User, Lock, Shield } from 'lucide-react';
import Button from '@/components/layout/UI/RoleButton';
import Input from '@/components/layout/UI/Input';
import ErrorMessage from '@/components/layout/UI/ErrorMessage';

interface AdminLoginOverlayProps {
  onClose?: () => void;
  onLogin?: (email: string, password: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

const AdminLoginOverlay: React.FC<AdminLoginOverlayProps> = ({ 
  onClose, 
  onLogin,
  isLoading = false,
  error = null
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);

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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && onLogin) {
      onLogin(email, password);
    }
  };

  const handleForgotPassword = () => {
    // Handle forgot password logic
    console.log('Forgot password clicked');
  };

  return (
    <div className="fixed inset-0 z-50 h-screen w-screen overflow-hidden">
      <div className="h-full w-full flex" style={{ backgroundColor: '#d1ab35' }}>
        {/* Left Side - Admin Text */}
        <div className="flex-[2] relative">
          {/* Admin label positioned like in RoleSelector */}
          <div className="absolute inset-0 z-40 flex items-center justify-center gap-16">
            <span
              className="pointer-events-auto cursor-pointer select-none text-black text-3xl md:text-4xl font-semibold tracking-wide"
              style={{ textShadow: '0 0 2px rgba(0,0,0,0.25)' }}
            >
              ADMIN
            </span>
          </div>
          
          {/* Bottom left logo */}
          <div className="absolute bottom-8 left-8 flex items-center text-gray-800 text-sm">
            <Shield className="w-4 h-4 mr-2" />
            <span>Powered by Tri Tech Technology</span>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div 
          className={`flex-[1] bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-12 py-16 shadow-lg mr-12 mt-12 transition-transform duration-1000 ease-out ${
            isVisible 
              ? 'transform translate-y-0' 
              : 'transform translate-y-full'
          }`}
          style={{
            willChange: 'transform'
          }}
        >
          <div className="mb-12 text-center">
            <p className="text-gray-500 text-xs mb-3 tracking-widest font-medium">WELCOME BACK</p>
            <h2 className="text-xl font-semibold text-gray-900">Log In to your Account</h2>
          </div>

          {error && (
            <ErrorMessage message={error} className="mb-6" />
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <Input
              label=""
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="EMAIL-OR-NUMBER"
              icon={<User size={18} className="text-gray-400" />}
              error={validationErrors.email}
              disabled={isLoading}
              className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
            />

            <Input
              label=""
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="PASSWORD"
              icon={<Lock size={18} className="text-gray-400" />}
              error={validationErrors.password}
              disabled={isLoading}
              className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
            />

            <div className="pt-4">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full bg-black text-white hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
                isLoading={isLoading}
                disabled={isLoading}
              >
                LOGIN
              </Button>
            </div>

            <div className="text-center pt-3">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Close button - optional, if you want users to be able to close the overlay */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 text-2xl font-bold z-10"
          disabled={isLoading}
        >
          ×
        </button>
      )}
    </div>
  );
};

export default AdminLoginOverlay;