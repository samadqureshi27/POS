// src/components/auth/LoginCard.tsx
import React from 'react';

interface LoginCardProps {
  children: React.ReactNode;
  title?: string;
  className?: string;
}

const LoginCard: React.FC<LoginCardProps> = ({ children, title, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-8 w-full max-w-md ${className}`}>
      {title && <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">{title}</h2>}
      {children}
    </div>
  );
};

export default LoginCard;