// components/login/ForgotPasswordOverlay.tsx
"use client";
import React from "react";
import { User } from "lucide-react";
import Button from "@/components/ui/role-button";
import Input from "@/components/ui/input";
import { useLoginContext } from "./login-context";
import { validateForgotPasswordForm } from "@/lib/validations";

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
    setShowVerification,
    setShowVerificationContainer,
  } = useLoginContext();

  const handleResetPassword = () => {
    const { isValid, error } = validateForgotPasswordForm(resetEmail);

    if (isValid) {
      setResetEmailError("");
      console.log("Reset password for:", resetEmail);

      setShowVerification(true);
      setTimeout(() => {
        setShowVerificationContainer(true);
      }, 100);
    } else {
      setResetEmailError(error || "");
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
      className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-10 transition-transform duration-1000 ease-out ${
        showForgotContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
      }}
    >
      <div className="mb-12 text-center -mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Forgot your password?
        </h2>
        <p className="text-gray-500 text-sm">
          Please enter your email to reset the password
        </p>
      </div>

      <div className="space-y-5">
        <Input
          label=""
          type="email"
          value={resetEmail}
          onChange={(e) => {
            setResetEmail(e.target.value);
            setResetEmailError("");
          }}
          placeholder="EMAIL OR NUMBER"
          icon={<User size={18} className="text-gray-400" />}
          error={resetEmailError}
          disabled={isLoading}
          className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
        />

        <div className="pt-4">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleResetPassword}
          >
            RESET
          </Button>
        </div>

        <div className="text-center pt-3">
          <button
            type="button"
            onClick={handleBackToLogin}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200"
            disabled={isLoading}
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordOverlay;