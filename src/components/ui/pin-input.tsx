"use client";
import React, { useRef } from 'react';
import { Input } from './input';
import { cn } from '@/lib/utils';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean | string;
  className?: string;
}

const PinInput: React.FC<PinInputProps> = ({
  value,
  onChange,
  disabled = false,
  error = false,
  className = ''
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, inputValue: string) => {
    // Only allow digits
    const digit = inputValue.replace(/\D/g, '').slice(-1);
    
    const newValue = value.split('');
    newValue[index] = digit;
    
    // Fill array to length 4
    while (newValue.length < 4) {
      newValue.push('');
    }
    
    onChange(newValue.join(''));
    
    // Auto-focus next input
    if (digit && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace') {
      if (!value[index] && index > 0) {
        // Focus previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
    onChange(pastedData.padEnd(4, ''));
    
    // Focus the next empty input or last input
    const nextIndex = Math.min(pastedData.length, 3);
    inputRefs.current[nextIndex]?.focus();
  };

  const digits = value.padEnd(4, '').split('').slice(0, 4);

  return (
    <div>
      <div className={cn("flex gap-3 justify-center", className)}>
        {digits.map((digit, index) => (
          <Input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="\d*"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            disabled={disabled}
            className={cn(
              "w-14 h-14 text-center text-2xl font-bold",
              error && "border-destructive focus-visible:ring-destructive/20"
            )}
          />
        ))}
      </div>
      
      {error && (
        <p className="text-sm text-destructive mt-1">
          {typeof error === 'string' ? error : 'Invalid input'}
        </p>
      )}
    </div>
  );
};

export default PinInput;