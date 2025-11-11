"use client";
import React, { ReactNode } from 'react';
import { Input as ShadcnInput } from './input';
import { Label } from './label';
import { cn } from '@/lib/utils';

interface InputComponentProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: ReactNode;
  rightIcon?: ReactNode;
  error?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
}

const InputComponent: React.FC<InputComponentProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  rightIcon,
  error,
  disabled = false,
  required = false,
  className = ''
}) => {
  return (
    <div className={cn("space-y-2", className)}>
      {label && (
        <Label className="text-sm font-medium text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </Label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <div className="text-muted-foreground">{icon}</div>
          </div>
        )}
        
        <ShadcnInput
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          className={cn(
            icon && "pl-10",
            rightIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive/20",
            "transition-all duration-200"
          )}
        />
        
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-1">{error}</p>
      )}
    </div>
  );
};

export default InputComponent;