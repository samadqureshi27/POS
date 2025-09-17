// components/login/EmailVerificationOverlay.tsx
"use client";
import React from "react";
import { User, ArrowLeft } from "lucide-react";
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
      console.log("Verifying OTP:", otp);
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

  const handleResendEmail = () => {
    console.log("Resending email");
  };

  if (!showVerification) return null;

  return (
    <div
      className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-6 sm:px-12 md:px-16 py-12 sm:py-16 md:py-20 z-20 transition-transform duration-1000 ease-out ${
        showVerificationContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
      }}
    >
      <div className="mb-8 sm:mb-12 text-center -mt-6 sm:-mt-8">
        <div className="mb-4 sm:mb-6 flex items-center justify-center relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleBackToForgotPassword}
            className="absolute left-0 w-6 h-6 sm:w-8 sm:h-8 text-gray-400 hover:text-gray-600"
            disabled={isLoading}
          >
            <ArrowLeft size={16} className="sm:w-5 sm:h-5" />
          </Button>
          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={20} className="sm:size-6 text-gray-600" />
          </div>
          <span className="ml-2 sm:ml-3 text-sm sm:text-base text-gray-700 font-medium">
            Olivia Rhye
          </span>
        </div>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
          Check your email
        </h2>
        <p className="text-gray-500 text-sm mb-2">
          We sent a reset link to{" "}
          <span className="font-medium text-gray-700">
            contact@ui.com
          </span>
        </p>
        <p className="text-gray-500 text-sm">
          Enter the 5 digit code mentioned in the email
        </p>
      </div>

      <div className="space-y-5 sm:space-y-6">
        <div className="flex justify-center gap-2 sm:gap-3 px-4 sm:px-0">
          {otpCode.map((digit, index) => (
            <Input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-base sm:text-lg font-semibold rounded-lg"
              style={{
                backgroundColor: digit ? "#fff5f0" : "white",
                borderColor: digit ? "#fb923c" : "#d1d5db",
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="pt-3 sm:pt-4">
          <Button
            onClick={handleVerifyOtp}
            className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-3 sm:py-4 rounded-xl text-xs sm:text-sm"
            disabled={isLoading || otpCode.join("").length !== 5}
          >
            VERIFY & PROCEED
          </Button>
        </div>

        <div className="text-center pt-2 sm:pt-3">
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