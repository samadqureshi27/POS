// src/app/(auth)/login/admin/page.tsx
'use client';
import React, { useState } from 'react';
// import LoginCard from '../../components/auth/LoginCard';
// Update the path below to the correct location of LoginCard, for example:
import LoginCard from '../../../../components/auth/LoginCard';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Mock login logic
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Admin login:', credentials);
      alert('Admin login successful!');
      router.push('/dashboard'); // Redirect to dashboard
    } catch (error) {
      console.error('Login failed:', error);
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
            <div className="text-8xl mb-4">👤</div>
          </div>
        </div>
        
        <div className="flex-1 bg-white p-12 flex items-center justify-center">
          <LoginCard title="Log in to your Account">
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={credentials.email}
                onChange={(e) => setCredentials({...credentials, email: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                disabled={loading}
              />
              <input
                type="password"
                placeholder="Password"
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gold"
                required
                disabled={loading}
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </form>
            <div className="mt-4 text-center">
              <a 
                href="/login/forgot-password" 
                className="text-sm text-gray-600 hover:text-gold"
              >
                Forgot your password?
              </a>
            </div>
            <div className="mt-2 text-center">
              <a 
                href="/login" 
                className="text-sm text-gray-600 hover:text-gold"
              >
                ← Back to selection
              </a>
            </div>
          </LoginCard>
        </div>
      </div>
    </div>
  );
}