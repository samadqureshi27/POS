// src/app/(auth)/login/manager/page.tsx
'use client';
import React, { useState } from 'react';
import Keypad from '../../../../components/auth/Keypad';
import { useRouter } from 'next/navigation';

export default function ManagerLogin() {
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleKeyPress = (key: string) => {
    if (pin.length < 4) { // Changed to 4 to match the design
      setPin(pin + key);
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
  };

  const handleSubmit = async () => {
    if (pin.length >= 4) {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Manager PIN:', pin);
        alert('Manager login successful!');
        router.push('/dashboard'); // Redirect to dashboard
        setPin('');
      } catch (error) {
        console.error('Login failed:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleForgotPin = () => {
    setPin(''); // Clear PIN when forgot is clicked
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Dark */}
      <div className="flex-1 bg-gray-900 flex flex-col justify-between p-8">
        <div></div>
        <div className="text-center">
          <h1 className="text-yellow-500 text-4xl font-light">Manager</h1>
        </div>
        <div className="flex items-center text-gray-400 text-sm">
          <div className="w-4 h-4 bg-yellow-500 rounded mr-2 flex items-center justify-center">
            <span className="text-black text-xs font-bold">T</span>
          </div>
          <span>Powered by Tri Tech Technology</span>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-lg p-8 w-80">
          {/* Header */}
          <div className="text-center mb-8">
            <p className="text-gray-500 text-sm mb-2">WELCOME BACK</p>
            <h2 className="text-gray-900 text-lg font-medium">Log In to your Account</h2>
          </div>

          {/* PIN Dots */}
          <div className="flex justify-center mb-8">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full mx-1 ${
                  i < pin.length ? 'bg-black' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>

          {/* Custom Number Pad - Exact Layout */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((number) => (
              <button
                key={number}
                onClick={() => handleKeyPress(number.toString())}
                disabled={loading}
                className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-medium text-gray-700 transition-colors disabled:opacity-50"
              >
                {number}
              </button>
            ))}
          </div>

          {/* Zero Button */}
          <div className="flex justify-center mb-6">
            <button
              onClick={() => handleKeyPress('0')}
              disabled={loading}
              className="w-16 h-16 bg-gray-100 hover:bg-gray-200 rounded-lg flex items-center justify-center text-xl font-medium text-gray-700 transition-colors disabled:opacity-50"
            >
              0
            </button>
          </div>

          {/* Forgot PIN Link */}
          <div className="text-center">
            <button 
              onClick={handleForgotPin}
              disabled={loading}
              className="text-gray-500 text-sm hover:text-gray-700 transition-colors disabled:opacity-50"
            >
              Forgot Your PIN Code?
            </button>
          </div>

          {/* Hidden Submit - Auto submit when 4 digits entered */}
          {pin.length === 4 && (
            <div className="mt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:bg-gray-400"
              >
                {loading ? 'LOGGING IN...' : 'LOGIN'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}