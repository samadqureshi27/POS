// components/login/NewPasswordOverlay.tsx
"use client";
import React from "react";
import { Lock } from "lucide-react";
import Button from "@/components/ui/role-button";
import Input from "@/components/ui/input";
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
      className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-30 transition-transform duration-1000 ease-out ${
        showNewPasswordContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
      }}
    >
      <div className="mb-12 text-center -mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Set a new password
        </h2>
        <p className="text-gray-500 text-sm">
          Create a new password. Ensure it differs from previous ones
          for security
        </p>
      </div>

      <div className="space-y-5">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Password
          </label>
          <Input
            label=""
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
            icon={<Lock size={18} className="text-gray-400" />}
            error={validationErrors.newPassword}
            disabled={isLoading}
            className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
          />
        </div>

        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Confirm Password
          </label>
          <Input
            label=""
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
            icon={<Lock size={18} className="text-gray-400" />}
            error={validationErrors.confirmPassword}
            disabled={isLoading}
            className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
          />
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
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