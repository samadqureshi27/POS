"use client";
import React, { useState, useEffect } from 'react';
import { User, Lock } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Button from '@/components/layout/UI/RoleButton';
import Input from '@/components/layout/UI/Input';
import ErrorMessage from '@/components/layout/UI/ErrorMessage';
import { 
  validateAdminLoginForm, 
  validateManagerPinForm, 
  validateForgotPasswordForm, 
  validateResetPasswordForm 
} from '@/lib/validations';

const LoginPage: React.FC = () => {
  const router = useRouter();
  const [phase, setPhase] = React.useState<'idle' | 'toBlack' | 'toGold' | 'adminLogin' | 'managerLogin'>('idle');
  const [hoverSide, setHoverSide] = React.useState<'none' | 'left' | 'right'>('none');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Admin states
  const [showLoginContainer, setShowLoginContainer] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotContainer, setShowForgotContainer] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showVerificationContainer, setShowVerificationContainer] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordContainer, setShowNewPasswordContainer] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetEmailError, setResetEmailError] = useState('');
  const [otpCode, setOtpCode] = useState(['', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ 
    email?: string; 
    password?: string; 
    newPassword?: string; 
    confirmPassword?: string;
    pin?: string;
  }>({});

  // Manager states
  const [showManagerContainer, setShowManagerContainer] = useState(false);
  const [showManagerLine, setShowManagerLine] = useState(false);
  const [pinCode, setPinCode] = useState(['', '', '', '']);
  const [showManagerForgotPin, setShowManagerForgotPin] = useState(false);
  const [showManagerForgotContainer, setShowManagerForgotContainer] = useState(false);
  
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const transitionMs = 900;

  // Login handlers
  const handleAdminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your actual admin login API call
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login - store token, redirect, etc.
        localStorage.setItem('admin_token', data.token);
        router.push('/admin/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Login failed');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Admin login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagerLogin = async (pin: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Replace with your actual manager login API call
      const response = await fetch('/api/manager/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
      });

      if (response.ok) {
        const data = await response.json();
        // Handle successful login - store token, redirect, etc.
        localStorage.setItem('manager_token', data.token);
        router.push('/manager/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Invalid PIN');
      }
    } catch (error) {
      setError('An error occurred during login');
      console.error('Manager login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdminClick = () => {
    if (phase !== 'idle') return;
    setPhase('toGold');
    setError(null);
    
    // After the gold transition, show the login container
    window.setTimeout(() => {
      setPhase('adminLogin');
      // Small delay before showing container for smooth transition
      setTimeout(() => {
        setShowLoginContainer(true);
        // Show line animation after container starts appearing
        setTimeout(() => {
          setShowLine(true);
        }, 200);
      }, 100);
    }, transitionMs);
  };

  const handleManagerClick = () => {
    if (phase !== 'idle') return;
    setPhase('toBlack');
    setError(null);
    
    // After the black transition, show the manager container
    window.setTimeout(() => {
      setPhase('managerLogin');
      // Small delay before showing container for smooth transition
      setTimeout(() => {
        setShowManagerContainer(true);
        // Show line animation after container starts appearing
        setTimeout(() => {
          setShowManagerLine(true);
        }, 200);
      }, 100);
    }, transitionMs);
  };

  const validateForm = () => {
    const { isValid, errors } = validateAdminLoginForm(email, password);
    setValidationErrors(errors);
    return isValid;
  };

  const validatePin = () => {
    const { isValid, errors } = validateManagerPinForm(pinCode);
    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = () => {
    if (validateForm()) {
      handleAdminLogin(email, password);
    }
  };

  const handleManagerPinLogin = () => {
    if (validatePin()) {
      const pin = pinCode.join('');
      handleManagerLogin(pin);
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    // Small delay before showing container for smooth transition
    setTimeout(() => {
      setShowForgotContainer(true);
    }, 100);
  };

  const handleManagerForgotPin = () => {
    setShowManagerForgotPin(true);
    setTimeout(() => {
      setShowManagerForgotContainer(true);
    }, 100);
  };

  const handleResetPassword = () => {
    const { isValid, error } = validateForgotPasswordForm(resetEmail);
    
    if (isValid) {
      setResetEmailError('');
      console.log('Reset password for:', resetEmail);
      
      // Show verification overlay
      setShowVerification(true);
      setTimeout(() => {
        setShowVerificationContainer(true);
      }, 100);
    } else {
      setResetEmailError(error || '');
    }
  };

  const handleBackToLogin = () => {
    setShowForgotContainer(false);
    // Wait for animation to complete before hiding overlay
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail('');
      setResetEmailError('');
    }, 300);
  };

  const handleBackToManagerLogin = () => {
    setShowManagerForgotContainer(false);
    setTimeout(() => {
      setShowManagerForgotPin(false);
    }, 300);
  };

  const handleBackToForgotPassword = () => {
    setShowVerificationContainer(false);
    setTimeout(() => {
      setShowVerification(false);
      setOtpCode(['', '', '', '', '']);
    }, 300);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);
      
      // Auto-focus next input
      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pinCode];
      newPin[index] = value;
      setPinCode(newPin);
      
      // Auto-focus next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }
      
      // Clear validation error when user types
      if (validationErrors.pin) {
        setValidationErrors(prev => ({ ...prev, pin: undefined }));
      }

      // Check if PIN is complete and trigger login automatically
      const completedPin = [...newPin];
      if (completedPin.every(digit => digit !== '')) {
        const { isValid, errors } = validateManagerPinForm(completedPin);
        setValidationErrors(errors);
        
        if (isValid) {
          const pin = completedPin.join('');
          handleManagerLogin(pin);
        }
      }
    }
  };

  const handleVerifyOtp = () => {
    const otp = otpCode.join('');
    if (otp.length === 5) {
      console.log('Verifying OTP:', otp);
      // Simulate successful OTP verification
      // Keep verification overlay open, just show new password screen on top
      setShowNewPassword(true);
      // Small delay before showing container sliding up from bottom
      setTimeout(() => {
        setShowNewPasswordContainer(true);
      }, 100);
    }
  };

  const handleResendEmail = () => {
    console.log('Resending email to:', resetEmail);
    // Add resend logic here
  };

  const handleUpdatePassword = () => {
    const { isValid, errors } = validateResetPasswordForm(newPassword, confirmPassword);
    setValidationErrors(errors);
    
    if (isValid) {
      console.log('Updating password:', newPassword);
      // Add your password update logic here
      
      // Hide all overlays and reset to show first login container
      setShowNewPasswordContainer(false);
      setShowNewPassword(false);
      setShowVerification(false);
      setShowVerificationContainer(false);
      setShowForgotPassword(false);
      setShowForgotContainer(false);
      setShowLoginContainer(false);
      setShowLine(false);
      
      // Reset all form data
      setEmail('');
      setPassword('');
      setResetEmail('');
      setOtpCode(['', '', '', '', '']);
      setNewPassword('');
      setConfirmPassword('');
      setValidationErrors({});
      setResetEmailError('');
      
      // Show the first login container sliding up from bottom
      setTimeout(() => {
        setShowLoginContainer(true);
        setTimeout(() => {
          setShowLine(true);
        }, 200);
      }, 100);
    }
  };

  const handleBackToVerification = () => {
    setShowNewPasswordContainer(false);
    setTimeout(() => {
      setShowNewPassword(false);
      setNewPassword('');
      setConfirmPassword('');
      setValidationErrors({});
    }, 300);
  };

  const handleBackToRoleSelection = () => {
    // Reset admin states
    setShowLoginContainer(false);
    setShowLine(false);
    setShowForgotPassword(false);
    setShowForgotContainer(false);
    setShowVerification(false);
    setShowVerificationContainer(false);
    setShowNewPassword(false);
    setShowNewPasswordContainer(false);
    
    // Reset manager states
    setShowManagerContainer(false);
    setShowManagerLine(false);
    setShowManagerForgotPin(false);
    setShowManagerForgotContainer(false);
    
    setPhase('idle');
    setEmail('');
    setPassword('');
    setResetEmail('');
    setOtpCode(['', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setPinCode(['', '', '', '']);
    setValidationErrors({});
    setResetEmailError('');
    setError(null);
  };

  // Your existing diagonal geometry and styling logic
  const topX = 35;
  const bottomX = 65;
  const stripeHalf = 0.6;
  const topLeft = topX - stripeHalf;
  const topRight = topX + stripeHalf;
  const bottomLeft = bottomX - stripeHalf;
  const bottomRight = bottomX + stripeHalf;
  const accentPolygon = `polygon(${topLeft}% 0, ${topRight}% 0, ${bottomRight}% 100%, ${bottomLeft}% 100%)`;
  const accentColor = hoverSide === 'right' ? '#000000' : hoverSide === 'left' ? '#d1ab35' : 'transparent';

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#d1ab35' }}
      onMouseLeave={() => setHoverSide('none')}
      onMouseMove={(e) => {
        if (!containerRef.current || (phase !== 'idle')) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const threshold = 0.35 + 0.30 * y;
        setHoverSide(x >= threshold ? 'right' : 'left');
      }}
    >
      {/* Rest of your JSX remains exactly the same */}
      <img
        src="/images/login-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 h-full w-auto object-contain z-0"
        draggable={false}
      />

      <div
        className="absolute inset-0 bg-black z-10"
        style={{
          clipPath:
            phase === 'toBlack' || phase === 'managerLogin'
              ? 'polygon(-35% 0, 100% 0, 100% 100%, -5% 100%)'
              : phase === 'toGold' || phase === 'adminLogin'
              ? 'polygon(135% 0, 100% 0, 100% 100%, 165% 100%)'
              : 'polygon(35% 0, 100% 0, 100% 100%, 65% 100%)',
          transition: 'clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'clip-path',
          pointerEvents: phase === 'idle' ? 'auto' : 'none'
        }}
        onClick={phase === 'idle' ? handleManagerClick : undefined}
      >
        <img
          src="/images/login-right.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-0 top-0 h-full w-auto object-contain"
          draggable={false}
        />
      </div>

      <div
        className="absolute inset-0 z-20"
        style={{
          clipPath: 'polygon(0 0, 35% 0, 65% 100%, 0 100%)',
          pointerEvents: phase === 'idle' ? 'auto' : 'none'
        }}
        onClick={phase === 'idle' ? handleAdminClick : undefined}
      />

      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          clipPath: hoverSide === 'none' ? 'polygon(0 0,0 0,0 0,0 0)' : accentPolygon,
          background: hoverSide === 'left' ? accentColor : hoverSide === 'right' ? accentColor : 'transparent',
          opacity: hoverSide === 'none' || (phase !== 'idle') ? 0 : 1,
          transition: 'opacity 150ms ease',
          willChange: 'opacity, clip-path'
        }}
      />

      {/* Role selection labels - always visible */}
      <div className="absolute inset-0 z-40 flex items-center justify-center gap-16">
        <span
          className={`pointer-events-auto cursor-pointer select-none text-black text-3xl md:text-4xl font-semibold tracking-wide transition-opacity duration-300 ${
            phase === 'managerLogin' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          style={{ textShadow: '0 0 2px rgba(0,0,0,0.25)' }}
          onClick={phase === 'adminLogin' ? handleBackToRoleSelection : phase === 'idle' ? handleAdminClick : undefined}
        >
          <span style={{ opacity: hoverSide === 'right' ? 0.6 : 1 }}>ADMIN</span>
        </span>
        <span
          className={`pointer-events-auto cursor-pointer select-none pl-[50px] text-[#d1ab35] text-3xl md:text-4xl font-semibold tracking-wide transition-opacity duration-300 ${
            phase === 'adminLogin' ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
          onClick={phase === 'managerLogin' ? handleBackToRoleSelection : phase === 'idle' ? handleManagerClick : undefined}
        >
          <span style={{ opacity: hoverSide === 'left' ? 0.6 : 1 }}>MANAGER</span>
        </span>
      </div>

      {/* Animated text that comes from left for admin */}
      {phase === 'adminLogin' && (
        <div 
          className="absolute bottom-12 left-4 z-45 flex items-center transition-all duration-1000 ease-out"
          style={{
            transform: showLine ? 'translateX(0)' : 'translateX(-100%)',
            opacity: showLine ? 1 : 0,
            willChange: 'transform, opacity'
          }}
        >
          <div className="w-4 h-4 mr-2 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
          <span className="text-base font-medium" style={{ color: '#2e2e2e' }}>
            Powered by Tit Tech Technology
          </span>
        </div>
      )}

      {/* Animated text that comes from right for manager */}
      {phase === 'managerLogin' && (
        <div 
          className="absolute bottom-12 right-4 z-45 flex items-center transition-all duration-1000 ease-out"
          style={{
            transform: showManagerLine ? 'translateX(0)' : 'translateX(100%)',
            opacity: showManagerLine ? 1 : 0,
            willChange: 'transform, opacity'
          }}
        >
          <span className="text-base font-medium text-gray-500 mr-2">
            Powered by Tit Tech Technology
          </span>
          <div className="w-4 h-4 bg-orange-500 rounded-sm flex items-center justify-center">
            <span className="text-white text-xs font-bold">T</span>
          </div>
        </div>
      )}

      {/* Admin login container */}
      {phase === 'adminLogin' && (
        <div className="absolute right-0 top-0 h-full z-50">
          {/* Right side - Login form */}
          <div 
            className={`h-full bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 shadow-lg mr-16 mt-16 transition-transform duration-1000 ease-out ${
              showLoginContainer 
                ? 'transform translate-y-0' 
                : 'transform translate-y-full'
            }`}
            style={{
              willChange: 'transform',
              width: '450px',
              marginLeft: '-50px'
            }}
          >
            <div className="mb-12 text-center -mt-8">
              <p className="text-gray-500 text-sm mb-3 tracking-widest font-medium">WELCOME BACK</p>
              <h2 className="text-2xl font-semibold text-gray-900">Log In to your Account</h2>
            </div>

            {error && (
              <ErrorMessage message={error} className="mb-6" />
            )}

            <div className="space-y-5">
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
                  className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
                  isLoading={isLoading}
                  disabled={isLoading}
                  onClick={handleLogin}
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
            </div>

            {/* Forgot Password Overlay */}
            {showForgotPassword && (
              <div 
                className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-10 transition-transform duration-1000 ease-out ${
                  showForgotContainer 
                    ? 'transform translate-y-0' 
                    : 'transform translate-y-full'
                }`}
                style={{
                  willChange: 'transform'
                }}
              >
                <div className="mb-12 text-center -mt-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Forgot your password?</h2>
                  <p className="text-gray-500 text-sm">Please enter your email to reset the password</p>
                </div>

                <div className="space-y-5">
                  <Input
                    label=""
                    type="email"
                    value={resetEmail}
                    onChange={(e) => {
                      setResetEmail(e.target.value);
                      setResetEmailError('');
                    }}
                    placeholder="EMAIL OR NUMBER"
                    icon={<User size={18} className="text-gray-400" />}
                    error={resetEmailError}
                    disabled={isLoading}
                    className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
                  />

                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
                      isLoading={isLoading}
                      disabled={isLoading}
                      onClick={handleResetPassword}
                    >
                      RESET
                    </Button>
                  </div>

                  <div className="text-center pt-3">
                    <button
                      type="button"
                      onClick={handleBackToLogin}
                      className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200"
                      disabled={isLoading}
                    >
                      Back to login
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Email Verification Overlay */}
            {showVerification && (
              <div 
                className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-20 transition-transform duration-1000 ease-out ${
                  showVerificationContainer 
                    ? 'transform translate-y-0' 
                    : 'transform translate-y-full'
                }`}
                style={{
                  willChange: 'transform'
                }}
              >
                <div className="mb-12 text-center -mt-8">
                  <div className="mb-6 flex items-center justify-center relative">
                    <button
                      onClick={handleBackToForgotPassword}
                      className="absolute left-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isLoading}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="m15 18-6-6 6-6"/>
                      </svg>
                    </button>
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <User size={24} className="text-gray-600" />
                    </div>
                    <span className="ml-3 text-gray-700 font-medium">Olivia Rhye</span>
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Check your email</h2>
                  <p className="text-gray-500 text-sm mb-2">We sent a reset link to <span className="font-medium text-gray-700">contact@ui.com</span></p>
                  <p className="text-gray-500 text-sm">Enter the 5 digit code mentioned in the email</p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {otpCode.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-colors"
                        style={{
                          backgroundColor: digit ? '#fff5f0' : 'white',
                          borderColor: digit ? '#fb923c' : '#d1d5db'
                        }}
                        disabled={isLoading}
                      />
                    ))}
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
                      isLoading={isLoading}
                      disabled={isLoading || otpCode.join('').length !== 5}
                      onClick={handleVerifyOtp}
                    >
                      VERIFY & PROCEED
                    </Button>
                  </div>

                  <div className="text-center pt-3">
                    <p className="text-gray-500 text-sm">
                      Haven't got the email yet?{' '}
                      <button
                        type="button"
                        onClick={handleResendEmail}
                        className="text-gray-500 hover:text-orange-600 transition-colors duration-200 underline font-medium"
                        disabled={isLoading}
                      >
                        Resend email
                      </button>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* New Password Overlay */}
            {showNewPassword && (
              <div 
                className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-30 transition-transform duration-1000 ease-out ${
                  showNewPasswordContainer 
                    ? 'transform translate-y-0' 
                    : 'transform translate-y-full'
                }`}
                style={{
                  willChange: 'transform'
                }}
              >
                <div className="mb-12 text-center -mt-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Set a new password</h2>
                  <p className="text-gray-500 text-sm">Create a new password. Ensure it differs from previous ones for security</p>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                    <Input
                      label=""
                      type="password"
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        setValidationErrors(prev => ({ ...prev, newPassword: undefined }));
                      }}
                      placeholder="Enter your new password"
                      icon={<Lock size={18} className="text-gray-400" />}
                      error={validationErrors.newPassword}
                      disabled={isLoading}
                      className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                    <Input
                      label=""
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        setValidationErrors(prev => ({ ...prev, confirmPassword: undefined }));
                      }}
                      placeholder="Re-enter password"
                      icon={<Lock size={18} className="text-gray-400" />}
                      error={validationErrors.confirmPassword}
                      disabled={isLoading}
                      className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
                    />
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
                      isLoading={isLoading}
                      disabled={isLoading || !newPassword || !confirmPassword}
                      onClick={handleUpdatePassword}
                    >
                      UPDATE PASSWORD
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Manager PIN login container */}
      {phase === 'managerLogin' && (
        <div className="absolute left-0 top-0 h-full z-50">
          {/* Left side - PIN form */}
          <div 
            className={`h-full bg-white rounded-tr-3xl rounded-tl-3xl flex flex-col justify-center px-16 py-20 shadow-lg ml-16 mt-16 transition-transform duration-1000 ease-out ${
              showManagerContainer 
                ? 'transform translate-y-0' 
                : 'transform translate-y-full'
            }`}
            style={{
              willChange: 'transform',
              width: '450px',
              marginRight: '-50px'
            }}
          >
            <div className="mb-12 text-center -mt-8">
              <p className="text-gray-500 text-sm mb-3 tracking-widest font-medium">WELCOME BACK</p>
              <h2 className="text-2xl font-semibold text-gray-900">Log In to your Account</h2>
            </div>

            {error && (
              <ErrorMessage message={error} className="mb-6" />
            )}

            <div className="space-y-8">
              {/* PIN Input */}
              <div className="flex justify-center gap-4">
                {pinCode.map((digit, index) => (
                  <input
                    key={index}
                    id={`pin-${index}`}
                    type="password"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handlePinChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-2xl font-bold border-0 bg-gray-100 rounded-lg focus:bg-gray-800 focus:text-white focus:ring-2 focus:ring-gray-600 focus:outline-none transition-colors"
                    style={{
                      backgroundColor: digit ? '#374151' : '#f3f4f6',
                      color: digit ? 'white' : '#374151'
                    }}
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Error message for PIN */}
              {validationErrors.pin && (
                <div className="text-center">
                  <span className="text-red-500 text-sm">{validationErrors.pin}</span>
                </div>
              )}

              {/* Number Keypad */}
              <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                  <button
                    key={num}
                    type="button"
                    className="h-14 text-xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                    onClick={() => {
                      const emptyIndex = pinCode.findIndex(digit => digit === '');
                      if (emptyIndex !== -1) {
                        handlePinChange(emptyIndex, num.toString());
                      }
                    }}
                    disabled={isLoading || pinCode.every(digit => digit !== '')}
                  >
                    {num}
                  </button>
                ))}
                <div></div> {/* Empty space */}
                <button
                  type="button"
                  className="h-14 text-xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  onClick={() => {
                    const emptyIndex = pinCode.findIndex(digit => digit === '');
                    if (emptyIndex !== -1) {
                      const newPin = [...pinCode];
                      newPin[emptyIndex] = '0';
                      setPinCode(newPin);
                      
                      // Auto-focus next input
                      if (emptyIndex < 3) {
                        const nextInput = document.getElementById(`pin-${emptyIndex + 1}`);
                        nextInput?.focus();
                      }
                      
                      // Check if PIN is complete and trigger login automatically
                      if (newPin.every(digit => digit !== '')) {
                        const { isValid, errors } = validateManagerPinForm(newPin);
                        setValidationErrors(errors);
                        
                        if (isValid) {
                          const pin = newPin.join('');
                          handleManagerLogin(pin);
                        }
                      }
                    }
                  }}
                  disabled={isLoading || pinCode.every(digit => digit !== '')}
                >
                  0
                </button>
                <button
                  type="button"
                  className="h-14 text-lg font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
                  onClick={() => {
                    const lastFilledIndex = pinCode.map((digit, index) => digit !== '' ? index : -1).filter(index => index !== -1).pop();
                    if (lastFilledIndex !== undefined) {
                      handlePinChange(lastFilledIndex, '');
                    }
                  }}
                  disabled={isLoading || pinCode.every(digit => digit === '')}
                >
                  ⌫
                </button>
              </div>

              <div className="text-center pt-3">
                <button
                  type="button"
                  onClick={handleManagerForgotPin}
                  className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200"
                  disabled={isLoading}
                >
                  Forgot Your PIN Code?
                </button>
              </div>
            </div>

            {/* Forgot PIN Overlay */}
            {showManagerForgotPin && (
              <div 
                className={`absolute inset-0 bg-white rounded-tr-3xl rounded-tl-3xl flex flex-col justify-center px-16 py-20 z-10 transition-transform duration-1000 ease-out ${
                  showManagerForgotContainer 
                    ? 'transform translate-y-0' 
                    : 'transform translate-y-full'
                }`}
                style={{
                  willChange: 'transform'
                }}
              >
                <div className="mb-12 text-center -mt-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">Reset Your PIN</h2>
                  <p className="text-gray-500 text-sm">Please contact your administrator to reset your PIN code</p>
                </div>

                <div className="space-y-8">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Lock size={32} className="text-orange-500" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">PIN Reset Required</h3>
                    <p className="text-gray-500 text-sm max-w-sm mx-auto">
                      For security reasons, PIN codes can only be reset by your system administrator. 
                      Please contact them for assistance.
                    </p>
                  </div>

                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="primary"
                      size="lg"
                      className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
                      onClick={handleBackToManagerLogin}
                    >
                      BACK TO LOGIN
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;