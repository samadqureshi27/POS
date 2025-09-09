// components/login/AdminLoginForm.tsx
"use client";
import React from "react";
import { User, Lock } from "lucide-react";
import Button from "@/components/layout/UI/RoleButton";
import Input from "@/components/layout/UI/Input";
import ErrorMessage from "@/components/layout/UI/ErrorMessage";
import { useLoginContext } from "./login-context";
import { validateAdminLoginForm } from "@/lib/validations";

const AdminLoginForm: React.FC = () => {
  const {
    phase,
    showLoginContainer,
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
    <div className="absolute right-0 top-0 h-full z-1">
      <div
        className={`absolute bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-10 transition-transform duration-1000 ease-out ${

          showLoginContainer
            ? "transform translate-y-0"
            : "transform translate-y-full"
        }`}
        style={{
          willChange: "transform",
          width: "450px",
          marginLeft: "-50px",
        }}
      >
        <div className="mb-12 text-center -mt-16">

          <p className="text-gray-500 text-sm mb-3 tracking-widest font-medium">
            WELCOME BACK
          </p>
          <h2 className="text-2xl font-semibold text-gray-900">
            Log In to your Account
          </h2>
        </div>

        {error && <ErrorMessage message={error} className="mb-6" />}

        <div className="space-y-5">
          <Input
            label=""
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="EMAIL-OR-NUMBER"
            icon={<User size={18} className="text-gray-400" />}
            error={validationErrors.email}
            disabled={isLoading}
            className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
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
            className="placeholder-gray-400 text-sm tracking-wide border-gray-300 rounded-xl py-4"
          />

          <div className="pt-4">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
              isLoading={isLoading}
              disabled={isLoading}
              onClick={handleLogin}
            >
              LOGIN
            </Button>
          </div>

          <div className="text-center pt-3">
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
      </div>
    </div>
  );
};

export default AdminLoginForm;