// components/login/AdminLoginForm.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { X, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    setShowForgotPassword,
    setShowForgotContainer,
    handleBackToRoleSelection,
    showLoginContainer,
  } = useLoginContext();

  const [showPassword, setShowPassword] = useState(false);
  const emailInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus email input when form appears
  useEffect(() => {
    if (showLoginContainer && emailInputRef.current) {
      setTimeout(() => {
        emailInputRef.current?.focus();
      }, 500);
    }
  }, [showLoginContainer]);

  const validateForm = () => {
    const { isValid, errors } = validateAdminLoginForm(email, password);
    setValidationErrors(errors);
    return isValid;
  };

  const handleLogin = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (validateForm()) {
      handleAdminLogin(email, password);
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
      {/* Mobile Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBackToRoleSelection}
        className="absolute top-4 right-4 sm:hidden w-9 h-9 text-gray-500 hover:text-gray-700 hover:bg-gray-100 z-10 rounded-full"
      >
        <X size={20} />
      </Button>

      <div className="mb-6 sm:mb-6 text-center mt-2 sm:mt-0" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
        <p className="text-gray-400 text-[10px] sm:text-xs mb-1.5 tracking-widest font-medium">
          WELCOME BACK
        </p>
        <h2 className="text-xl sm:text-xl font-semibold text-gray-900">
          Log In to your Account
        </h2>
      </div>

      {error && <ErrorMessage message={error} className="mb-3 sm:mb-4" />}

      <form onSubmit={handleLogin} className="space-y-4" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
        <div>
          <Input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email or Phone"
            disabled={isLoading}
            required
            className="placeholder-gray-400 text-sm h-12 sm:h-14"
          />
          {validationErrors.email && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.email}</p>
          )}
        </div>

        <div className="relative">
          <Input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            disabled={isLoading}
            required
            className="placeholder-gray-400 text-sm pr-10 h-12 sm:h-14"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-500 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
          {validationErrors.password && (
            <p className="text-red-500 text-xs mt-1">{validationErrors.password}</p>
          )}
        </div>

        <div className="pt-3 sm:pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="h-12 sm:h-14 w-full bg-black hover:bg-gray-900 font-medium rounded-sm text-base transition-colors disabled:opacity-50"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            <span className="bg-gradient-to-r from-[#d1ab35] to-[#e8c84a] bg-clip-text text-transparent">
              {isLoading ? "Logging in..." : "Log in"}
            </span>
          </button>
        </div>

        <div className="text-right pt-1">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-[#333333] text-sm hover:text-black transition-colors"
            disabled={isLoading}
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
          >
            Forgot password?
          </button>
        </div>
      </form>
    </>
  );
};

export default AdminLoginForm;