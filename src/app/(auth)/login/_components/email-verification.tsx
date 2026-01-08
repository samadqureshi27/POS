// components/login/EmailVerificationOverlay.tsx
"use client";
import { Toast } from "@/lib/util/toast-helpers";
import React, { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginContext } from "./login-context";
import authService from "@/lib/auth-service";

const EmailVerificationOverlay: React.FC = () => {
  const {
    showVerification,
    showVerificationContainer,
    setShowVerificationContainer,
    setShowVerification,
    otpCode,
    setOtpCode,
    isLoading,
    setIsLoading,
    setShowNewPassword,
    setShowNewPasswordContainer,
    resetEmail,
  } = useLoginContext();

  const [otpError, setOtpError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Auto-focus first input when component mounts
  useEffect(() => {
    if (showVerificationContainer && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showVerificationContainer]);

  const handleOtpChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otpCode];

    if (value.length === 0) {
      // User cleared the input
      newOtp[index] = "";
      setOtpCode(newOtp);
      setOtpError("");
    } else if (value.length === 1) {
      // User entered a single digit
      newOtp[index] = value;
      setOtpCode(newOtp);
      setOtpError("");

      // Move to next input
      if (index < otpCode.length - 1) {
        setTimeout(() => {
          inputRefs.current[index + 1]?.focus();
        }, 10);
      }
    } else if (value.length > 1) {
      // User pasted or entered multiple characters
      const digits = value.slice(0, 6 - index).split("");

      digits.forEach((digit, i) => {
        if (index + i < otpCode.length && /^\d$/.test(digit)) {
          newOtp[index + i] = digit;
        }
      });

      setOtpCode(newOtp);
      setOtpError("");

      // Focus on the next empty box or the last box
      const nextIndex = Math.min(index + digits.length, otpCode.length - 1);
      setTimeout(() => {
        inputRefs.current[nextIndex]?.focus();
      }, 10);
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;

    if (e.key === "Backspace") {
      e.preventDefault();

      const newOtp = [...otpCode];

      if (otpCode[index]) {
        // Clear current box
        newOtp[index] = "";
        setOtpCode(newOtp);
      } else if (index > 0) {
        // Move to previous box and clear it
        newOtp[index - 1] = "";
        setOtpCode(newOtp);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < otpCode.length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    } else if (e.key === "Delete") {
      e.preventDefault();
      const newOtp = [...otpCode];
      newOtp[index] = "";
      setOtpCode(newOtp);
    } else if (/^\d$/.test(e.key)) {
      // If there's already a value, prevent default and replace it
      if (otpCode[index]) {
        e.preventDefault();
        const newOtp = [...otpCode];
        newOtp[index] = e.key;
        setOtpCode(newOtp);

        // Move to next
        if (index < otpCode.length - 1) {
          setTimeout(() => {
            inputRefs.current[index + 1]?.focus();
          }, 10);
        }
      }
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text/plain").trim();

    // Only process if it's 6 digits
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtpCode(digits);
      setOtpError("");

      // Focus on the last input
      inputRefs.current[5]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpCode.join("");
    if (otp.length === 6 && resetEmail) {
      setIsLoading(true);
      setOtpError("");

      try {
        const response = await authService.verifyPasswordResetOtp(resetEmail, otp);

        console.log("OTP Verification Response:", response);

        // Check if response is successful (handle both success field and HTTP status)
        if (response.success && !response.error) {
          Toast.success(response.message || "OTP verified successfully");
          setShowNewPassword(true);
          setTimeout(() => {
            setShowNewPasswordContainer(true);
          }, 100);
        } else {
          // Extract error message from various possible formats
          const errorMessage =
            response.error ||
            response.message ||
            (response.data && response.data.message) ||
            "Invalid OTP. Please try again.";

          setOtpError(errorMessage);
          Toast.error(errorMessage);
        }
      } catch (error) {
        console.error("OTP verification error:", error);
        setOtpError("Failed to verify OTP. Please try again.");
        Toast.error("Failed to verify OTP");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleBackToForgotPassword = () => {
    setShowVerificationContainer(false);
    setTimeout(() => {
      setShowVerification(false);
      setOtpCode(["", "", "", "", "", ""]);
      setOtpError("");
    }, 300);
  };

  const handleResendEmail = async () => {
    if (!resetEmail) {
      Toast.error("Email not found. Please try again.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await authService.requestPasswordResetOtp(resetEmail);

      if (response.success) {
        Toast.success(response.message || "Reset email has been resent!");
        setOtpCode(["", "", "", "", "", ""]);
        setOtpError("");
      } else {
        Toast.error(response.message || response.error || "Failed to resend email");
      }
    } catch (error) {
      console.error("Resend email error:", error);
      Toast.error("Failed to resend email");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showVerification) return null;

  return (
    <div
      className={`absolute inset-0 bg-white rounded-t-2xl sm:rounded-tl-3xl sm:rounded-tr-3xl flex flex-col justify-center px-6 sm:px-12 md:px-16 py-8 sm:py-16 md:py-20 z-20 transition-transform duration-700 sm:duration-1000 ease-out ${
        showVerificationContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
        fontFamily: "Manrope, system-ui, sans-serif",
      }}
    >
      {/* Mobile: Drag handle indicator - positioned at top edge */}
      <div className="sm:hidden absolute top-2 left-1/2 -translate-x-1/2 z-20">
        <div className="w-10 h-1 bg-gray-300 rounded-full" />
      </div>

      {/* Mobile Close Button */}
      <button
        type="button"
        onClick={handleBackToForgotPassword}
        className="absolute top-3 right-3 sm:hidden p-1 text-gray-400 hover:text-gray-600 z-10 transition-colors"
        disabled={isLoading}
      >
        <X size={24} strokeWidth={1.5} />
      </button>

      <div className="mb-6 sm:mb-12 text-center mt-4 sm:-mt-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-center relative">
          {/* Desktop back button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToForgotPassword}
            className="absolute left-0 w-8 h-8 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full hidden sm:flex"
            disabled={isLoading}
          >
            <X size={18} strokeWidth={1.5} />
          </Button>
        </div>
        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">
          Check your email
        </h2>
        <p className="text-gray-500 text-sm mb-1 sm:mb-2">
          We sent a reset link to{" "}
          <span className="font-medium text-gray-700">
            {resetEmail || "your email"}
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          Enter the 6 digit code mentioned in the email
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3 px-0">
          {otpCode.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              id={`otp-${index}`}
              type="text"
              inputMode="numeric"
              pattern="\d*"
              value={digit}
              onChange={(e) => handleOtpChange(index, e)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              onPaste={handleOtpPaste}
              onFocus={(e) => e.target.select()}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold rounded-sm"
              style={{
                backgroundColor: digit ? "#fff5f0" : "white",
                borderColor: otpError ? "#ef4444" : digit ? "#fb923c" : "#d1d5db",
              }}
              disabled={isLoading}
              autoComplete="off"
            />
          ))}
        </div>

        {otpError && (
          <p className="text-red-500 text-sm text-center -mt-2">{otpError}</p>
        )}

        <div className="pt-2 sm:pt-4">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full h-12 sm:h-14 bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest rounded-sm text-xs sm:text-sm"
            disabled={isLoading || otpCode.join("").length !== 6}
            onClick={handleVerifyOtp}
          >
            {isLoading ? "VERIFYING..." : "VERIFY & PROCEED"}
          </Button>
        </div>

        <div className="text-center pt-1 sm:pt-3">
          <p className="text-gray-500 text-sm">
            Haven't got the email yet?{" "}
            <Button
              type="button"
              variant="link"
              onClick={handleResendEmail}
              className="text-gray-500 hover:text-orange-600 underline font-medium p-0 h-auto"
              disabled={isLoading}
            >
              Resend email
            </Button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationOverlay;