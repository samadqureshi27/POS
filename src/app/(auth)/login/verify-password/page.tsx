// src/app/(auth)/login/verify-email/page.tsx
'use client';
import React, { useState } from 'react';
import LoginCard from '../../../../components/auth/LoginCard';
import { useRouter } from 'next/navigation';

export default function VerifyEmail() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length <= 1) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);
      
      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Verification code:', code.join(''));
      alert('Email verified successfully!');
      router.push('/login/reset-password');
    } catch (error) {
      console.error('Verification failed:', error);
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
            <div className="text-8xl mb-4">📧</div>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-12 flex items-center justify-center">
          <LoginCard title="Check your email">
            <p className="text-gray-600 text-center mb-6">
              We sent a verification code to your email address.
            </p>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex justify-center space-x-2">
                {code.map((digit, index) => (
                  <input
                    key={index}
                    id={`code-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    className="w-12 h-12 text-center text-xl font-bold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                    maxLength={1}
                    disabled={loading}
                  />
                ))}
              </div>
              <button
                type="submit"
                disabled={loading || code.some(digit => !digit)}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'VERIFYING...' : 'VERIFY EMAIL'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <button 
                className="text-sm text-gray-600 hover:text-gold"
                disabled={loading}
              >
                Resend code
              </button>
            </div>
          </LoginCard>
        </div>
      </div>
    </div>
  );
}
