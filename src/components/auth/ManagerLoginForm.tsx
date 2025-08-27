"use client";
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
// import Keypad from '@components/auth/Keypad';
import ErrorMessage from '@/components/layout/UI/ErrorMessage';

interface ManagerLoginFormProps {
  onBack: () => void;
  onSubmit: (credentials: { email: string; pin: string; role: 'manager' }) => void;
  isLoading: boolean;
  error: string | null;
}

const ManagerLoginForm: React.FC<ManagerLoginFormProps> = ({
  onBack,
  onSubmit,
  isLoading,
  error
}) => {
  const [pin, setPin] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ pin?: string }>({});

  const handleKeyPress = (key: string) => {
    if (pin.length < 4) {
      setPin(prev => prev + key);
      // Clear any validation errors when user starts typing
      if (validationErrors.pin) {
        setValidationErrors({});
      }
    }
  };

  const handleBackspace = () => {
    setPin(prev => prev.slice(0, -1));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.length === 4) {
      onSubmit({ email: '', pin, role: 'manager' });
    } else {
      setValidationErrors({ pin: 'Please enter a 4-digit PIN' });
    }
  };

  const handleForgotPin = () => {
    // Add your forgot PIN logic here
    console.log('Forgot PIN clicked');
  };

  return (
    <div className="align-bottom min-h-screen bg-gray-900 flex">
      {/* Left Section - Login Card */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="bg-gray-100 rounded-2xl p-10 w-full max-w-sm">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm font-medium mb-2 tracking-wide">WELCOME</p>
            <h1 className="text-gray-900 text-lg font-semibold">Log In to your Account</h1>
          </div>

          {/* PIN Dots */}
          <div className="flex justify-center gap-3 mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  i < pin.length ? 'bg-gray-900' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Error Message */}
          {error && <ErrorMessage message={error} />}
          {validationErrors.pin && (
            <div className="mb-4 text-center">
              <p className="text-red-500 text-sm">{validationErrors.pin}</p>
            </div>
          )}

          {/* Keypad */}
          {/* <div className="mb-08">
            <Keypad onKeyPress={handleKeyPress} onBackspace={handleBackspace} />
          </div> */}

          {/* Forgot PIN Link */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleForgotPin}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors underline"
            >
              Forgot Your PIN Code?
            </button>
          </div>
        </div>
      </div>

      {/* Right Section - Manager Title */}
      <div className="flex-1 flex flex-col items-center justify-center relative">
        <h1 className="text-yellow-500 text-6xl font-light tracking-wide">Manager</h1>
        
        {/* Footer - Powered By */}
        <div className="absolute bottom-6 right-6 flex items-center gap-2">
          {/* Crown Icon */}
          <div className="w-4 h-4 relative">
            <svg 
              viewBox="0 0 24 24" 
              className="w-4 h-4 fill-yellow-500"
            >
              <path d="M12 6l4 6h-8l4-6zm0-4l-6 9h12l-6-9z"/>
              <rect x="2" y="15" width="20" height="3" />
            </svg>
          </div>
          <span className="text-gray-400 text-xs">Powered by Tri Tech Technology</span>
        </div>
      </div>

      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-10 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
        disabled={isLoading}
      >
        <ArrowLeft size={20} />
        <span className="text-sm">Back</span>
      </button>

      {/* Auto-submit when PIN is complete */}
      {pin.length === 4 && (
        <form onSubmit={handleSubmit} className="hidden">
          <button type="submit" />
        </form>
      )}
    </div>
  );
};

export default ManagerLoginForm;