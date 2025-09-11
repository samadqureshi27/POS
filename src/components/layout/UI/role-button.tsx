"use client";
import React, { ReactNode } from 'react';
import LoadingSpinner from './Loader';

interface ButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline' | 'login';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = ''
}) => {
  const baseClasses = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
    disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden
  `;

  const variants = {
    primary: `
      bg-black hover:bg-black text-[#d1ab35] rounded-lg
      focus:ring-black-500 shadow-lg hover:shadow-xl
    `,
    secondary: `
      bg-gray-900 hover:bg-gray-800 text-white rounded-lg
      focus:ring-gray-500 shadow-lg hover:shadow-xl
    `,
    outline: `
      border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white rounded-lg
      focus:ring-yellow-500
    `
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg'
  };

  // Special sizing for login variant
  const loginSize = variant === 'login' ? 'px-12 py-4 text-sm min-w-[200px]' : sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variants[variant]} ${variant === 'login' ? loginSize : sizes[size]} ${className}`}
    >
      {isLoading && <LoadingSpinner size="sm" className="mr-2" />}
      <span className="relative z-10">{children}</span>
    </button>
  );
};

export default Button;