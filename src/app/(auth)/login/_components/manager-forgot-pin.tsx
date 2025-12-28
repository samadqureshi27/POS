// components/login/ManagerForgotPinOverlay.tsx
"use client";
import React from "react";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLoginContext } from "./login-context";

const ManagerForgotPinOverlay: React.FC = () => {
  const {
    showManagerForgotPin,
    showManagerForgotContainer,
    setShowManagerForgotContainer,
    setShowManagerForgotPin,
  } = useLoginContext();

  const handleBackToManagerLogin = () => {
    setShowManagerForgotContainer(false);
    setTimeout(() => {
      setShowManagerForgotPin(false);
    }, 300);
  };

  if (!showManagerForgotPin) return null;

  return (
    <div
      className={`absolute inset-0 bg-white rounded-t-2xl sm:rounded-sm flex flex-col justify-center px-6 sm:px-12 md:px-16 pb-8 sm:pb-40 z-10 transition-transform duration-700 sm:duration-1000 ease-out ${
        showManagerForgotContainer
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

      <div className="mb-6 sm:mb-12 text-center mt-4 sm:-mt-8">
        <h2 className="text-xl sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-4">
          Reset Your PIN
        </h2>
        <p className="text-gray-500 text-sm">
          Please contact your administrator to reset your PIN code
        </p>
      </div>

      <div className="space-y-5 sm:space-y-8">
        <div className="text-center py-4 sm:py-8">
          <div className="w-14 h-14 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <Lock size={24} className="sm:size-7 md:size-8 text-orange-500" />
          </div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            PIN Reset Required
          </h3>
          <p className="text-gray-500 text-sm max-w-sm mx-auto px-2 sm:px-0">
            For security reasons, PIN codes can only be reset by your
            system administrator. Please contact them for assistance.
          </p>
        </div>

        <div className="pt-2 sm:pt-4">
          <Button
            type="button"
            variant="default"
            size="lg"
            className="w-full h-12 sm:h-14 bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest rounded-sm text-xs sm:text-sm"
            onClick={handleBackToManagerLogin}
          >
            BACK TO LOGIN
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManagerForgotPinOverlay;