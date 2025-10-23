// contexts/LoginContext.tsx
"use client";
import React, { createContext, useContext, useState } from "react";
import { useRouter } from "next/navigation";
import authService from "@/lib/auth-service";
// import {
//   validateAdminLoginForm,
//   validateManagerPinForm,
//   validateForgotPasswordForm,
//   validateResetPasswordForm,
// } from "@/lib/validations";

interface LoginContextType {
  // Phase management
  phase: "idle" | "toBlack" | "toGold" | "adminLogin" | "managerLogin";
  setPhase: (phase: "idle" | "toBlack" | "toGold" | "adminLogin" | "managerLogin") => void;
  hoverSide: "none" | "left" | "right";
  setHoverSide: (side: "none" | "left" | "right") => void;
  role: "admin" | "manager" | null;
  setRole: (role: "admin" | "manager" | null) => void;

  // Loading and error states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  error: string | null;
  setError: (error: string | null) => void;

  // Admin states
  showLoginContainer: boolean;
  setShowLoginContainer: (show: boolean) => void;
  showLine: boolean;
  setShowLine: (show: boolean) => void;
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  showForgotPassword: boolean;
  setShowForgotPassword: (show: boolean) => void;
  showForgotContainer: boolean;
  setShowForgotContainer: (show: boolean) => void;
  showVerification: boolean;
  setShowVerification: (show: boolean) => void;
  showVerificationContainer: boolean;
  setShowVerificationContainer: (show: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (show: boolean) => void;
  showNewPasswordContainer: boolean;
  setShowNewPasswordContainer: (show: boolean) => void;
  resetEmail: string;
  setResetEmail: (email: string) => void;
  resetEmailError: string;
  setResetEmailError: (error: string) => void;
  otpCode: string[];
  setOtpCode: (code: string[]) => void;
  newPassword: string;
  setNewPassword: (password: string) => void;
  confirmPassword: string;
  setConfirmPassword: (password: string) => void;
  validationErrors: {
    email?: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
    pin?: string;
  };
  setValidationErrors: (errors: any) => void;

  // Manager states
  showManagerContainer: boolean;
  setShowManagerContainer: (show: boolean) => void;
  showManagerLine: boolean;
  setShowManagerLine: (show: boolean) => void;
  pinCode: string[];
  setPinCode: (code: string[]) => void;
  showManagerForgotPin: boolean;
  setShowManagerForgotPin: (show: boolean) => void;
  showManagerForgotContainer: boolean;
  setShowManagerForgotContainer: (show: boolean) => void;

  // Actions
  handleAdminClick: () => void;
  handleManagerClick: () => void;
  handleBackToRoleSelection: () => void;
  handleAdminLogin: (email: string, password: string) => Promise<void>;
  handleManagerLogin: (pin: string) => Promise<void>;
}

const LoginContext = createContext<LoginContextType | undefined>(undefined);

export const useLoginContext = () => {
  const context = useContext(LoginContext);
  if (!context) {
    throw new Error("useLoginContext must be used within LoginProvider");
  }
  return context;
};

export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const transitionMs = 900;

  // Phase management
  const [phase, setPhase] = useState<"idle" | "toBlack" | "toGold" | "adminLogin" | "managerLogin">("idle");
  const [hoverSide, setHoverSide] = useState<"none" | "left" | "right">("none");
  const [role, setRole] = useState<"admin" | "manager" | null>(null);

  // Loading and error states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin states
  const [showLoginContainer, setShowLoginContainer] = useState(false);
  const [showLine, setShowLine] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showForgotContainer, setShowForgotContainer] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const [showVerificationContainer, setShowVerificationContainer] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordContainer, setShowNewPasswordContainer] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState("");
  const [otpCode, setOtpCode] = useState(["", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
    newPassword?: string;
    confirmPassword?: string;
    pin?: string;
  }>({});

  // Manager states
  const [showManagerContainer, setShowManagerContainer] = useState(false);
  const [showManagerLine, setShowManagerLine] = useState(false);
  const [pinCode, setPinCode] = useState(["", "", "", ""]);
  const [showManagerForgotPin, setShowManagerForgotPin] = useState(false);
  const [showManagerForgotContainer, setShowManagerForgotContainer] = useState(false);

  const handleAdminClick = () => {
    if (phase !== "idle") return;
    console.log("admin label clicked, setting role to admin");
    setPhase("toGold");
    setRole("admin");
    setError(null);

    window.setTimeout(() => {
      setPhase("adminLogin");
      setTimeout(() => {
        setShowLoginContainer(true);
        setTimeout(() => {
          setShowLine(true);
        }, 200);
      }, 100);
    }, transitionMs);
  };

  const handleManagerClick = () => {
    if (phase !== "idle") return;
    console.log("Manager label clicked, setting role to manager");
    setPhase("toBlack");
    setRole("manager");
    setError(null);

    window.setTimeout(() => {
      setPhase("managerLogin");
      setTimeout(() => {
        setShowManagerContainer(true);
        setTimeout(() => {
          setShowManagerLine(true);
        }, 200);
      }, 100);
    }, transitionMs);
  };

  const handleAdminLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Admin login attempt:", { email, role });

      const response = await authService.adminLogin(
        email,
        password,
        role || "admin"
      );

      if (response.success && response.user) {
        console.log("Admin login successful:", response.user);
        if (
          response.user.role === "admin" ||
          response.user.role === "superadmin"
        ) {
          router.push("/dashboard");
        } else {
          router.push("/dashboard");
        }
      } else {
        console.log("Admin login failed:", response);
        setError(response.error || response.message || "Login failed");
        if (response.errors) {
          const fieldErrors = Object.values(response.errors).flat().join(", ");
          setError(fieldErrors);
        }
      }
    } catch (error: any) {
      console.error("Admin login error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagerLogin = async (pin: string) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log("Manager login attempt:", {
        pin: pin.replace(/./g, "*"),
        role,
      });

      const response = await authService.pinLogin(pin, role || "manager");

      if (response.success && response.user) {
        console.log("Manager login successful:", response.user);
        switch (response.user.role) {
          case "manager":
            router.push("/dashboard");
            break;
          case "cashier":
            router.push("/pos");
            break;
          case "waiter":
            router.push("/orders");
            break;
          default:
            router.push("/dashboard");
        }
      } else {
        console.log("Manager login failed:", response);
        setError(response.error || response.message || "Invalid PIN");
      }
    } catch (error: any) {
      console.error("Manager login error:", error);
      setError("Network error. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToRoleSelection = () => {
    // Reset admin states
    setShowLoginContainer(false);
    setShowLine(false);
    setShowForgotPassword(false);
    setShowForgotContainer(false);
    setShowVerification(false);
    setShowVerificationContainer(false);
    setShowNewPassword(false);
    setShowNewPasswordContainer(false);

    // Reset manager states
    setShowManagerContainer(false);
    setShowManagerLine(false);
    setShowManagerForgotPin(false);
    setShowManagerForgotContainer(false);

    setPhase("idle");
    setEmail("");
    setPassword("");
    setResetEmail("");
    setOtpCode(["", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setPinCode(["", "", "", ""]);
    setValidationErrors({});
    setResetEmailError("");
    setError(null);
  };

  const contextValue: LoginContextType = {
    // Phase management
    phase,
    setPhase,
    hoverSide,
    setHoverSide,
    role,
    setRole,

    // Loading and error states
    isLoading,
    setIsLoading,
    error,
    setError,

    // Admin states
    showLoginContainer,
    setShowLoginContainer,
    showLine,
    setShowLine,
    email,
    setEmail,
    password,
    setPassword,
    showForgotPassword,
    setShowForgotPassword,
    showForgotContainer,
    setShowForgotContainer,
    showVerification,
    setShowVerification,
    showVerificationContainer,
    setShowVerificationContainer,
    showNewPassword,
    setShowNewPassword,
    showNewPasswordContainer,
    setShowNewPasswordContainer,
    resetEmail,
    setResetEmail,
    resetEmailError,
    setResetEmailError,
    otpCode,
    setOtpCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    validationErrors,
    setValidationErrors,

    // Manager states
    showManagerContainer,
    setShowManagerContainer,
    showManagerLine,
    setShowManagerLine,
    pinCode,
    setPinCode,
    showManagerForgotPin,
    setShowManagerForgotPin,
    showManagerForgotContainer,
    setShowManagerForgotContainer,

    // Actions
    handleAdminClick,
    handleManagerClick,
    handleBackToRoleSelection,
    handleAdminLogin,
    handleManagerLogin,
  };

  return (
    <LoginContext.Provider value={contextValue}>
      {children}
    </LoginContext.Provider>
  );
};