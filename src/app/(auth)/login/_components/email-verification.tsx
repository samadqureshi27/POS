// components/login/EmailVerificationOverlay.tsx
"use client";
import React from "react";
import { User } from "lucide-react";
import Button from "@/components/ui/role-button";
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
      className={`absolute inset-0 bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 z-20 transition-transform duration-1000 ease-out ${
        showVerificationContainer
          ? "transform translate-y-0"
          : "transform translate-y-full"
      }`}
      style={{
        willChange: "transform",
      }}
    >
      <div className="mb-12 text-center -mt-8">
        <div className="mb-6 flex items-center justify-center relative">
          <button
            onClick={handleBackToForgotPassword}
            className="absolute left-0 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
            disabled={isLoading}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-gray-600" />
          </div>
          <span className="ml-3 text-gray-700 font-medium">
            Olivia Rhye
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
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

      <div className="space-y-6">
        <div className="flex justify-center gap-3">
          {otpCode.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              className="w-12 h-12 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:border-gray-400 focus:ring-2 focus:ring-orange-100 focus:outline-none transition-colors"
              style={{
                backgroundColor: digit ? "#fff5f0" : "white",
                borderColor: digit ? "#fb923c" : "#d1d5db",
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        <div className="pt-4">
          <Button
            type="button"
            variant="primary"
            size="lg"
            className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-4 rounded-xl text-sm"
            isLoading={isLoading}
            disabled={isLoading || otpCode.join("").length !== 5}
            onClick={handleVerifyOtp}
          >
            VERIFY & PROCEED
          </Button>
        </div>

        <div className="text-center pt-3">
          <p className="text-gray-500 text-sm">
            Haven't got the email yet?{" "}
            <button
              type="button"
              onClick={handleResendEmail}
              className="text-gray-500 hover:text-orange-600 transition-colors duration-200 underline font-medium"
              disabled={isLoading}
            >
              Resend email
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmailVerificationOverlay;