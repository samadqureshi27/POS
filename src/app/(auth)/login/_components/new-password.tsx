// components/login/NewPasswordOverlay.tsx
"use client";
import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLoginContext } from "./login-context";
import { validateResetPasswordForm } from "@/lib/validations";

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
  } = useLoginContext();

  const handleUpdatePassword = () => {
    const { isValid, errors } = validateResetPasswordForm(
      newPassword,
      confirmPassword
    );
    setValidationErrors(errors);

    if (isValid) {
      console.log("Updating password:", newPassword);

      // Hide all overlays and reset to show first login container
      setShowNewPasswordContainer(false);
      setShowNewPassword(false);
      setShowVerification(false);
      setShowVerificationContainer(false);
      setShowForgotPassword(false);
      setShowForgotContainer(false);
      setShowLoginContainer(false);
      setShowLine(false);

      // Reset all form data
      setEmail("");
      setPassword("");
      setResetEmail("");
      setOtpCode(["", "", "", "", ""]);
      setNewPassword("");
      setConfirmPassword("");
      setValidationErrors({});
      setResetEmailError("");

      // Show the first login container sliding up from bottom
      setTimeout(() => {
        setShowLoginContainer(true);
        setTimeout(() => {
          setShowLine(true);
        }, 200);
      }, 100);
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
            isLoading={isLoading}
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