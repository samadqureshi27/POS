// contexts/LoginContext.tsx
"use client";
import { Toast } from "@/lib/util/toast-helpers";
import React, { createContext, useContext, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

const LoginProviderContent: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
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
  const [pinCode, setPinCode] = useState(["", "", "", "", "", ""]);
  const [showManagerForgotPin, setShowManagerForgotPin] = useState(false);
  const [showManagerForgotContainer, setShowManagerForgotContainer] = useState(false);

  const handleAdminClick = () => {
    if (phase !== "idle") return;
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
      const response = await authService.adminLogin(
        email,
        password,
        role || "admin"
      );

      if (response.success && response.user) {
        Toast.success("Login successful! Redirecting...");

        // Wait for cookies to be set before redirecting
        // This ensures middleware can read the token
        const waitForCookies = async () => {
          const { getAccessToken } = await import('@/lib/util/token-manager');
          const { PersistentLogger } = await import('@/lib/util/persistent-logger');

          PersistentLogger.log('Login successful, waiting for cookies...');

          // Try up to 10 times (1 second total) to verify cookie is set
          for (let i = 0; i < 10; i++) {
            const token = getAccessToken();
            if (token) {
              PersistentLogger.log('Cookie verified, redirecting...', {
                tokenLength: token.length,
                attempt: i + 1
              });

              // Cookie is set, safe to redirect
              const next = searchParams.get('next');
              const redirectUrl = next || "/dashboard";
              PersistentLogger.log('Redirecting to: ' + redirectUrl);

              window.location.href = redirectUrl;
              return;
            }
            // Wait 100ms before trying again
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // If we get here, cookie wasn't set - something went wrong
          PersistentLogger.error('Cookie not set after 10 attempts!', {
            allCookies: document.cookie,
            localStorage: localStorage.getItem('user') ? 'HAS USER' : 'NO USER'
          });

          const next = searchParams.get('next');
          window.location.href = next || "/dashboard";
        };

        waitForCookies();
      } else {
        // Extract error message
        const errorMessage =
          response.error ||
          response.message ||
          (response.errors && typeof response.errors === 'object'
            ? Object.values(response.errors).flat().join(", ")
            : "Login failed. Please check your credentials.");

        setError(errorMessage);
        Toast.error(errorMessage);
      }
    } catch (error: any) {
      const errorMsg = "Network error. Please check your connection.";
      setError(errorMsg);
      Toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManagerLogin = async (pin: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.pinLogin(pin, role || "manager");

      if (response.success && response.user) {
        Toast.success("Login successful! Redirecting...");

        // Wait for cookies to be set before redirecting
        const waitForCookies = async () => {
          const { getAccessToken } = await import('@/lib/util/token-manager');

          // Try up to 10 times (1 second total) to verify cookie is set
          for (let i = 0; i < 10; i++) {
            const token = getAccessToken();
            if (token) {
              // Cookie is set, safe to redirect
              const next = searchParams.get('next');
              if (next) {
                window.location.href = next;
                return;
              }

              switch (response.user.role) {
                case "manager":
                  window.location.href = "/dashboard";
                  break;
                case "cashier":
                  window.location.href = "/pos";
                  break;
                case "waiter":
                  window.location.href = "/orders";
                  break;
                default:
                  window.location.href = "/dashboard";
              }
              return;
            }
            // Wait 100ms before trying again
            await new Promise(resolve => setTimeout(resolve, 100));
          }

          // If we get here, cookie wasn't set - something went wrong
          const next = searchParams.get('next');
          if (next) {
            window.location.href = next;
          } else {
            window.location.href = "/dashboard";
          }
        };

        waitForCookies();
      } else {

        // Handle error message safely
        let errorMessage = "Invalid PIN";

        if (typeof response.error === 'string') {
          errorMessage = response.error;
        } else if (typeof response.message === 'string') {
          errorMessage = response.message;
        } else if (response.error && typeof response.error === 'object' && response.error.message) {
          errorMessage = response.error.message;
        } else if (response.message && typeof response.message === 'object' && response.message.message) {
          errorMessage = response.message.message;
        }

        setError(errorMessage);
      }
    } catch (error: any) {
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
    setOtpCode(["", "", "", "", "", ""]);
    setNewPassword("");
    setConfirmPassword("");
    setPinCode(["", "", "", "", "", ""]);
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

// Wrapper component with Suspense boundary
export const LoginProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <Suspense fallback={<div className="h-screen w-full flex items-center justify-center bg-[#d1ab35]">
      <div className="animate-pulse text-white text-xl">Loading...</div>
    </div>}>
      <LoginProviderContent>{children}</LoginProviderContent>
    </Suspense>
  );
};