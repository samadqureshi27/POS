"use client";
import { useState } from 'react';
import * as mockApi from '@/lib/mock-api';

export const useForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendResetEmail = async (email: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    setIsSuccess(false);

    try {
      const response = await mockApi.forgotPassword({ email });
      
      if (response.success) {
        setIsSuccess(true);
        return true;
      } else {
        setError(response.message || 'Failed to send reset email');
        return false;
      }
    } catch (err) {
      setError('Network error. Please try again.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setIsSuccess(false);
    setError(null);
  };

  return {
    sendResetEmail,
    reset,
    isLoading,
    isSuccess,
    error
  };
};