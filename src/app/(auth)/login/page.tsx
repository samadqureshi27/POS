"use client";
import { useState } from 'react';
import RoleSelector from '@/components/auth/RoleSelection';
import AdminLoginForm from '@/components/auth/AdminLoginForm';
import ManagerLoginForm from '@/components/auth/ManagerLoginForm';
import ForgotPasswordModal from '@/components/auth/ForgotPassword';
import { useAuth } from '@/lib/hooks/useAuth';

export default function LoginPage() {
  const [currentView, setCurrentView] = useState<'role' | 'admin' | 'manager'>('role');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const { login, isLoading, error } = useAuth();

  const handleRoleSelect = (role: 'admin' | 'manager') => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView(role);
      setIsTransitioning(false);
    }, 900); // Match your existing animation timing
  };

  const handleBackToRoles = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentView('role');
      setIsTransitioning(false);
    }, 400); // Faster back transition
  };

  const handleLogin = async (credentials: any) => {
    const success = await login(credentials);
    if (success) {
      // Redirect to dashboard or appropriate page
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {currentView === 'role' && !isTransitioning && (
        <RoleSelector onRoleSelect={handleRoleSelect} />
      )}
      
      {currentView === 'admin' && !isTransitioning && (
        <AdminLoginForm 
          onBack={handleBackToRoles}
          onSubmit={handleLogin}
          onForgotPassword={() => setShowForgotPassword(true)}
          isLoading={isLoading}
          error={error}
        />
      )}
      
      {currentView === 'manager' && !isTransitioning && (
        <ManagerLoginForm 
          onBack={handleBackToRoles}
          onSubmit={handleLogin}
          isLoading={isLoading}
          error={error}
        />
      )}

      {/* Transition overlay matching your animation style */}
      {isTransitioning && (
        <div 
          className="absolute inset-0 z-50 transition-opacity duration-900"
          style={{ 
            background: currentView === 'admin' ? '#d1ab35' : '#000000',
            opacity: 1 
          }}
        />
      )}

      {/* Forgot Password Modal */}
      <ForgotPasswordModal 
        isOpen={showForgotPassword}
        onClose={() => setShowForgotPassword(false)}
      />
    </div>
  );
}