"use client";
import React from 'react';
import { Info } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ResponsiveDetailButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

const ResponsiveDetailButton: React.FC<ResponsiveDetailButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <>
      {/* Desktop Detail Icon - Hidden on mobile */}
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className={cn(
          "desktop-edit-icon text-muted-foreground hover:text-foreground",
          className
        )}
        title="Detail"
      >
        <Info size={16} />
      </Button>

      {/* Mobile Detail Button - Hidden on desktop */}
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="default"
        className={cn(
          "mobile-edit-button w-full flex items-center justify-center gap-2 mt-3",
          className
        )}
      >
        <Info size={16} />
        Details
      </Button>
    </>
  );
};

export default ResponsiveDetailButton;