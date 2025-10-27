// components/login/NewPasswordOverlay.tsx
"use client";
import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginContext } from "./login-context";
import { validateResetPasswordForm } from "@/lib/validations";
import authService from "@/lib/auth-service";

const NewPasswordOverlay: React.FC = () => {
  const {
    showNewPassword,
    showNewPasswordContainer,
    setShowNewPasswordContainer,
    setShowNewPassword,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    validationErrors,
    setValidationErrors,
    isLoading,
    setIsLoading,
    setShowLoginContainer,
    setShowLine,
    setEmail,
    setPassword,
    setResetEmail,
    setOtpCode,
    setResetEmailError,
    setShowVerification,
    setShowVerificationContainer,
    setShowForgotPassword,
    setShowForgotContainer,
    setError,
    otpCode,
  } = useLoginContext();

  const handleUpdatePassword = async () => {
    const { isValid, errors } = validateResetPasswordForm(
      newPassword,
      confirmPassword
    );
    setValidationErrors(errors);

    if (!isValid) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert OTP array to string to use as token
      const token = otpCode.join("");
      console.log("Resetting password with token:", token);

      const response = await authService.resetPassword(token, newPassword);

      if (response.success) {
        console.log("Password reset successful");

        // First, hide all other overlays immediately
        setShowVerification(false);
        setShowVerificationContainer(false);
        setShowForgotPassword(false);
        setShowForgotContainer(false);

        // Reset all form data
        setEmail("");
        setPassword("");
        setResetEmail("");
        setOtpCode(["", "", "", "", ""]);
        setResetEmailError("");

        // Set up the login container to be revealed underneath
        setShowLoginContainer(true);

        // Small delay to ensure login container is ready, then start animations
        setTimeout(() => {
          setShowLine(true);
          // Start the slide down animation
          setShowNewPasswordContainer(false);
        }, 50);

        // After the animation completes, clean up the new password overlay
        setTimeout(() => {
          setShowNewPassword(false);
          setNewPassword("");
          setConfirmPassword("");
          setValidationErrors({});
        }, 1000); // Wait for the slide down animation to complete
      } else {
        // Ensure error is a string
        const errorMessage = typeof response.error === 'string'
          ? response.error
          : typeof response.message === 'string'
          ? response.message
          : "Failed to reset password";
        setValidationErrors({
          confirmPassword: errorMessage
        });
      }
    } catch (error: any) {
      console.error("Password reset error:", error);
      setValidationErrors({
        confirmPassword: "Network error. Please try again."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToVerification = () => {
    setShowNewPasswordContainer(false);
    setTimeout(() => {
      setShowNewPassword(false);
      setNewPassword("");
      setConfirmPassword("");
      setValidationErrors({});
    }, 300);
  };

  if (!showNewPassword) return null;

  return (
    <div
      className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12 sm:py-16 md:py-20 z-30 transition-transform duration-1000 ease-out ${
        showNewPasswordContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
      }}
    >
      <div className="mb-8 sm:mb-12 text-center -mt-6 sm:-mt-8">
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Set a new password
        </h2>
        <p className="text-gray-500 text-sm">
          Create a new password. Ensure it differs from previous ones
          for security
        </p>
      </div>

      <div className="space-y-4 sm:space-y-5">
        <div>
          <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setValidationErrors((prev) => ({
                ...prev,
                newPassword: undefined,
              }));
            }}
            placeholder="Enter your new password"
            disabled={isLoading}
            className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-3 sm:py-4"
          />
          {validationErrors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.newPassword}</p>
          )}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setValidationErrors((prev) => ({
                ...prev,
                confirmPassword: undefined,
              }));
            }}
            placeholder="Re-enter password"
            disabled={isLoading}
            className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-3 sm:py-4"
          />
          {validationErrors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.confirmPassword}</p>
          )}
        </div>

        <div className="pt-3 sm:pt-4">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-3 sm:py-4 rounded-xl text-xs sm:text-sm"
            disabled={isLoading || !newPassword || !confirmPassword}
            onClick={handleUpdatePassword}
          >
            UPDATE PASSWORD
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NewPasswordOverlay;