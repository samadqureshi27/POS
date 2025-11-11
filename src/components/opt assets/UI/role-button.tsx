"use client";
import React, { ReactNode } from 'react';
import { Button as ShadcnButton, buttonVariants } from './button';
import { cn } from '@/lib/utils';
import LoadingSpinner from './loading-spinner';

interface RoleButtonProps {
  children: ReactNode;
  type?: 'button' | 'submit';
  variant?: 'primary' | 'secondary' | 'outline' | 'login';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}

const RoleButton: React.FC<RoleButtonProps> = ({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  onClick,
  className = ''
}) => {
  // Map custom variants to shadcn variants
  const getShadcnVariant = () => {
    switch (variant) {
      case 'primary':
        return 'default';
      case 'secondary':
        return 'secondary';
      case 'outline':
        return 'outline';
      case 'login':
        return 'default';
      default:
        return 'default';
    }
  };

  // Map custom sizes to shadcn sizes
  const getShadcnSize = () => {
    switch (size) {
      case 'sm':
        return 'sm';
      case 'md':
        return 'default';
      case 'lg':
        return 'lg';
      default:
        return 'default';
    }
  };

  // Custom styling for specific variants
  const getCustomStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-black hover:bg-black text-[#d1ab35] focus:ring-black-500 shadow-lg hover:shadow-xl';
      case 'secondary':
        return 'bg-muted-foreground hover:bg-muted-foreground/90 text-muted shadow-lg hover:shadow-xl';
      case 'outline':
        return 'border-2 border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white focus:ring-yellow-500';
      case 'login':
        return 'bg-black text-[#d1ab35] hover:bg-muted-foreground font-semibold tracking-widest min-w-[200px]';
      default:
        return '';
    }
  };

  return (
    <ShadcnButton
      type={type}
      variant={getShadcnVariant() as any}
      size={getShadcnSize() as any}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        getCustomStyles(),
        className
      )}
    >
      {isLoading && <LoadingSpinner size="sm" color="white" className="mr-2" />}
      <span className="relative z-10">{children}</span>
    </ShadcnButton>
  );
};

export default RoleButton;