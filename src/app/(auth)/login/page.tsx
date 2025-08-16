// src/app/(auth)/login/page.tsx (Admin/Manager Selection)
'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

export default function LoginSelection() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gold to-yellow-600">
      <div className="bg-black text-white p-12 rounded-lg shadow-2xl">
        <div className="flex items-center justify-center mb-8">
          <div className="text-gold text-6xl font-bold transform -skew-x-12">
            <div className="border-4 border-gold p-6 bg-black">
              <div className="text-4xl">⚡</div>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-8">
          <button
            onClick={() => router.push('/login/admin')}
            className="bg-gold text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-dark transition-colors"
          >
            ADMIN
          </button>
          <button
            onClick={() => router.push('/login/manager')}
            className="bg-gold text-black px-8 py-4 rounded-lg font-bold text-lg hover:bg-gold-dark transition-colors"
          >
            MANAGER
          </button>
        </div>
      </div>
    </div>
  );
}