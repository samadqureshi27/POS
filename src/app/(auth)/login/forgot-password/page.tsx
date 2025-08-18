// src/app/(auth)/login/forgot-password/page.tsx
'use client';
import React, { useState } from 'react';
import LoginCard from '../../../../components/auth/LoginCard';
import { useRouter } from 'next/navigation';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Reset password for:', email);
      alert('Password reset link sent to your email!');
      router.push('/login/verify-email');
    } catch (error) {
      console.error('Reset failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold to-yellow-600 p-4">
      <div className="flex max-w-4xl w-full bg-gold rounded-lg shadow-2xl overflow-hidden">
        <div className="flex-1 p-12 flex items-center justify-center">
          <div className="text-black text-center">
            <h1 className="text-4xl font-bold mb-4">Admin</h1>
            <div className="text-8xl mb-4">🔒</div>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-12 flex items-center justify-center">
          <LoginCard title="Forgot your password?">
            <p className="text-gray-600 text-center mb-6">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'SENDING...' : 'SEND RESET LINK'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <a 
                href="/login/admin" 
                className="text-sm text-gray-600 hover:text-gold"
              >
                Back to login
              </a>
            </div>
          </LoginCard>
        </div>
      </div>
    </div>
  );
}