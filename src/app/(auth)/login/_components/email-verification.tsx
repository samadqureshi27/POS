// components/login/EmailVerificationOverlay.tsx
"use client";
import React from "react";
import { toast } from "sonner";
import { User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLoginContext } from "./login-context";

const EmailVerificationOverlay: React.FC = () => {
  const {
    showVerification,
    showVerificationContainer,
    setShowVerificationContainer,
    setShowVerification,
    otpCode,
    setOtpCode,
    isLoading,
    setShowNewPassword,
    setShowNewPasswordContainer,
  } = useLoginContext();

  const handleOtpChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otpCode];
      newOtp[index] = value;
      setOtpCode(newOtp);

      if (value && index < 4) {
        const nextInput = document.getElementById(`otp-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  const handleVerifyOtp = () => {
    const otp = otpCode.join("");
    if (otp.length === 5) {
      setShowNewPassword(true);
      setTimeout(() => {
        setShowNewPasswordContainer(true);
      }, 100);
    }
  };

  const handleBackToForgotPassword = () => {
    setShowVerificationContainer(false);
    setTimeout(() => {
      setShowVerification(false);
      setOtpCode(["", "", "", "", ""]);
    }, 300);
  };

  const handleResendEmail = async () => {
    // Note: The reset email is stored in the context
    // You can add a resend API call here if needed
    toast.success("Reset email has been resent!");
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

          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={20} className="sm:size-6 text-gray-600" />
          </div>
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">
            Olivia Rhye
          </span>
        </div>
        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">
          Check your email
        </h2>
        <p className="text-gray-500 text-sm mb-1 sm:mb-2">
          We sent a reset link to{" "}
          <span className="font-medium text-gray-700">
            contact@ui.com
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          Enter the 5 digit code mentioned in the email
        </p>
      </div>

      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3 px-0">
          {otpCode.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-11 h-11 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold rounded-sm"
              style={{
                backgroundColor: digit ? "#fff5f0" : "white",
                borderColor: digit ? "#fb923c" : "#d1d5db",
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="pt-2 sm:pt-4">
          <Button
            type="button"
            variant="ghost"
            size="lg"
            className="w-full h-12 sm:h-14 bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest rounded-sm text-xs sm:text-sm"
            disabled={isLoading || otpCode.join("").length !== 5}
            onClick={handleVerifyOtp}
          >
            VERIFY & PROCEED
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