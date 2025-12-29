"use client";
import React from 'react';
import { Edit } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface ResponsiveEditButtonProps {
  onClick: (e: React.MouseEvent) => void;
  disabled?: boolean;
  className?: string;
}

const ResponsiveEditButton: React.FC<ResponsiveEditButtonProps> = ({ 
  onClick, 
  disabled = false, 
  className = '' 
}) => {
  return (
    <>
      {/* Desktop Edit Icon - Hidden on mobile */}
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="ghost"
        size="icon"
        className={cn(
          "desktop-edit-icon text-muted-foreground hover:text-foreground",
          className
        )}
        title="Edit"
      >
        <Edit size={16} />
      </Button>

      {/* Mobile Edit Button - Hidden on desktop */}
      <Button
        onClick={onClick}
        disabled={disabled}
        variant="default"
        className={cn(
          "mobile-edit-button w-full flex items-center justify-center gap-2 mt-3",
          className
        )}
      >
        <Edit size={16} />
        Edit
      </Button>
    </>
  );
};

export default ResponsiveEditButton;