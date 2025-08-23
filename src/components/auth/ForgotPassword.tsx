"use client";
import React, { useState } from 'react';
import { X, Mail, ArrowRight } from 'lucide-react';
import Input from '@/components/layout/UI/Input';
import Modal from '@/components/layout/UI/Model';
// import Input from '@/components/layout/UI/PinInput';
import Button from '@/components/layout/UI/RoleButton';
import { useForgotPassword } from '@/lib/hooks/useForgetPassword';

interface ForgotPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ForgotPasswordModal: React.FC<ForgotPasswordModalProps> = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const { sendResetEmail, isLoading, isSuccess, error } = useForgotPassword();

  const validateEmail = (email: string) => {
    if (!email) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(email)) return 'Please enter a valid email';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const emailValidationError = validateEmail(email);
    if (emailValidationError) {
      setEmailError(emailValidationError);
      return;
    }
    
    setEmailError('');
    await sendResetEmail(email);
  };

  const handleClose = () => {
    setEmail('');
    setEmailError('');
    onClose();
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (emailError) setEmailError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <X size={24} />
          </button>
        </div>

        {isSuccess ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ArrowRight className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Check your email</h3>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
            <Button onClick={handleClose} variant="primary">
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Enter your email address and we'll send you a link to reset your password.
              </p>
              
              <Input
                label="Email Address"
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="Enter your email"
                icon={<Mail size={20} />}
                error={emailError || error}
                disabled={isLoading}
                required
              />
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isLoading}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                isLoading={isLoading}
                disabled={isLoading || !email}
                className="flex-1"
              >
                Send Reset Link
              </Button>
            </div>
          </form>
        )}
      </div>
    </Modal>
  );
};

export default ForgotPasswordModal;