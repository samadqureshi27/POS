// components/login/ForgotPasswordOverlay.tsx
"use client";
import React from "react";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginContext } from "./login-context";
import { validateForgotPasswordForm } from "@/lib/validations";
import authService from "@/lib/auth-service";

const ForgotPasswordOverlay: React.FC = () => {
  const {
    showForgotPassword,
    showForgotContainer,
    setShowForgotContainer,
    setShowForgotPassword,
    resetEmail,
    setResetEmail,
    resetEmailError,
    setResetEmailError,
    isLoading,
    setIsLoading,
    setShowVerification,
    setShowVerificationContainer,
    setError,
  } = useLoginContext();

  const handleResetPassword = async () => {
    const { isValid, error } = validateForgotPasswordForm(resetEmail);

    if (!isValid) {
      setResetEmailError(error || "");
      return;
    }

    setResetEmailError("");
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.forgotPassword(resetEmail);

      if (response.success) {
        // Show verification screen
        setShowVerification(true);
        setTimeout(() => {
          setShowVerificationContainer(true);
        }, 100);
      } else {
        // Ensure error is a string
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : typeof response.message === 'string'
          ? response.message
          : "Failed to send reset email";
        setResetEmailError(errorMessage);
      }
    } catch (error: any) {
      console.error("Password reset request error:", error);
      setResetEmailError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToLogin = () => {
    setShowForgotContainer(false);
    setTimeout(() => {
      setShowForgotPassword(false);
      setResetEmail("");
      setResetEmailError("");
    }, 300);
  };

  if (!showForgotPassword) return null;

  return (
    <div
      className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12 sm:py-16 md:py-20 z-10 transition-transform duration-1000 ease-out ${
        showForgotContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
      }}
    >
      <div className="mb-8 sm:mb-12 text-center -mt-6 sm:-mt-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Forgot your password?
        </h2>
        <p className="text-gray-500 text-sm">
          Please enter your email to reset the password
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div className="relative">
          <Input
            type="email"
            value={resetEmail}
            onChange={(e) => {
              setResetEmail(e.target.value);
              setResetEmailError("");
            }}
            placeholder="EMAIL OR NUMBER"
            disabled={isLoading}
            className="placeholder-gray-400 text-sm tracking-wide rounded-sm py-3 sm:py-4 pl-12"
          />
          <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
          {resetEmailError && (
            <p className="text-red-500 text-sm mt-1">{resetEmailError}</p>
          )}
        </div>

        <div className="pt-3 sm:pt-4">
          <Button
            type="button"
            size="lg"
            className="h-11 w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-3 sm:py-4 rounded-sm text-xs sm:text-sm"
            disabled={isLoading}
            onClick={handleResetPassword}
          >
            {isLoading ? "RESETTING..." : "RESET"}
          </Button>
        </div>

        <div className="text-center pt-2 sm:pt-3">
          <Button
            type="button"
            variant="ghost"
            onClick={handleBackToLogin}
            className="text-gray-500 text-sm hover:text-gray-700"
            disabled={isLoading}
          >
            Back to login
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOverlay;