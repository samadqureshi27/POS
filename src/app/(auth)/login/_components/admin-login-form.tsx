// components/login/AdminLoginForm.tsx
"use client";
import React from "react";
import { User, Lock, ArrowLeft } from "lucide-react";
import Button from "@/components/ui/role-button";
import Input from "@/components/ui/input";
import ErrorMessage from "@/components/ui/error-message";
import { useLoginContext } from "./login-context";
import { validateAdminLoginForm } from "@/lib/validations";

const AdminLoginForm: React.FC = () => {
  const {
    phase,
    isLoading,
    error,
    email,
    setEmail,
    password,
    setPassword,
    validationErrors,
    setValidationErrors,
    handleAdminLogin,
    showForgotPassword,
    setShowForgotPassword,
    setShowForgotContainer,
    handleBackToRoleSelection,
  } = useLoginContext();

  const validateForm = () => {
    const { isValid, errors } = validateAdminLoginForm(email, password);
    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = () => {
    console.log("Form data:", { email, password });
    console.log("Email length:", email.length, "Password length:", password.length);

    if (validateForm()) {
      handleAdminLogin(email, password);
    } else {
      console.log("Form validation failed");
    }
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
    setTimeout(() => {
      setShowForgotContainer(true);
    }, 100);
  };

  if (phase !== "adminLogin") return null;

  return (
    <>
      {/* Mobile Back Button */}
      <button
        onClick={handleBackToRoleSelection}
        className="absolute top-4 left-4 sm:hidden w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors z-10"
      >
        <ArrowLeft size={20} />
      </button>

      <div className="mb-8 sm:mb-12 text-center -mt-8 sm:-mt-16">
        <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 tracking-widest font-medium">
          WELCOME BACK
        </p>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Log In to your Account
        </h2>
      </div>

      {error && <ErrorMessage message={error} className="mb-4 sm:mb-6" />}

      <div className="space-y-4 sm:space-y-5">
        <Input
          label=""
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="EMAIL-OR-NUMBER"
          icon={<User size={18} className="text-gray-400" />}
          error={validationErrors.email}
          disabled={isLoading}
          className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-3 sm:py-4"
        />

        <Input
          label=""
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="PASSWORD"
          icon={<Lock size={18} className="text-gray-400" />}
          error={validationErrors.password}
          disabled={isLoading}
          className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-3 sm:py-4"
        />

        <div className="pt-3 sm:pt-4">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-3 sm:py-4 rounded-xl text-xs sm:text-sm"
            isLoading={isLoading}
            disabled={isLoading}
            onClick={handleLogin}
          >
            LOGIN
          </Button>
        </div>

        <div className="text-center pt-2 sm:pt-3">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot password?
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminLoginForm;