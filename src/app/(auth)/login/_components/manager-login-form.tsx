// components/login/ManagerLoginForm.tsx
"use client";
import React, { useEffect, useCallback, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Keypad } from "@/components/ui/Keypad";
import ErrorMessage from "@/components/ui/error-message";
import { useLoginContext } from "./login-context";

const ManagerLoginForm: React.FC = () => {
  const {
    showManagerContainer,
    isLoading,
    error,
    pinCode,
    setPinCode,
    validationErrors,
    setValidationErrors,
    handleManagerLogin,
    setShowManagerForgotPin,
    setShowManagerForgotContainer,
    handleBackToRoleSelection,
  } = useLoginContext();

  const [pinError, setPinError] = useState(false);
  const pin = pinCode.filter(d => d !== "").join("");

  const handlePinInput = useCallback((value: string) => {
    if (pin.length < 6 && /^\d$/.test(value)) {
      const newPin = [...pinCode];
      const emptyIndex = newPin.findIndex(d => d === "");
      if (emptyIndex !== -1) {
        newPin[emptyIndex] = value;
        setPinCode(newPin);

        if (validationErrors.pin) {
          setValidationErrors((prev: any) => ({ ...prev, pin: undefined }));
        }

        // Check if PIN is complete (6 digits)
        if (newPin.every(digit => digit !== "")) {
          const pinString = newPin.join("");
          handleManagerLogin(pinString);
        }
      }
    }
  }, [pin.length, pinCode, setPinCode, validationErrors.pin, setValidationErrors, handleManagerLogin]);

  const handleBackspace = useCallback(() => {
    const lastFilledIndex = pinCode
      .map((digit, index) => (digit !== "" ? index : -1))
      .filter((index) => index !== -1)
      .pop();
    if (lastFilledIndex !== undefined) {
      const newPin = [...pinCode];
      newPin[lastFilledIndex] = "";
      setPinCode(newPin);
      setPinError(false);
    }
  }, [pinCode, setPinCode]);

  // Show error animation when there's an error
  useEffect(() => {
    if (error) {
      setPinError(true);
      // Clear PIN after error
      setTimeout(() => {
        setPinCode(["", "", "", "", "", ""]);
        setPinError(false);
      }, 600);
    }
  }, [error, setPinCode]);

  // Global keyboard listener for PIN input
  useEffect(() => {
    if (!showManagerContainer || isLoading) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Handle number keys (0-9)
      if (/^[0-9]$/.test(e.key)) {
        e.preventDefault();
        handlePinInput(e.key);
      }

      // Handle backspace
      if (e.key === "Backspace") {
        e.preventDefault();
        handleBackspace();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [showManagerContainer, isLoading, handlePinInput, handleBackspace]);

  const handleManagerForgotPin = () => {
    setShowManagerForgotPin(true);
    setTimeout(() => {
      setShowManagerForgotContainer(true);
    }, 100);
  };

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
          Enter Your PIN
        </h2>
      </div>

      {error && <ErrorMessage message={error} className="mb-3 sm:mb-4" />}

      <div className="space-y-5" style={{ fontFamily: "Manrope, system-ui, sans-serif" }}>
        {/* PIN Dots - also serves as loading indicator */}
        <div className={`flex justify-center gap-2.5 sm:gap-3 mb-4 transition-all duration-200 ${pinError ? 'animate-shake' : ''}`}>
          {[0, 1, 2, 3, 4, 5].map((index) => (
            <div
              key={index}
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full transition-all duration-200 ${
                pinError
                  ? 'bg-red-500 scale-110 shadow-lg shadow-red-500/50'
                  : isLoading
                  ? 'bg-gray-800 animate-bounce'
                  : index < pin.length
                  ? 'bg-gray-800 scale-110 shadow-lg shadow-gray-800/30'
                  : 'bg-gray-200'
              }`}
              style={isLoading ? { animationDelay: `${index * 100}ms` } : undefined}
            />
          ))}
        </div>

        {/* Error message for PIN */}
        {validationErrors.pin && (
          <div className="text-center">
            <span className="text-red-500 text-xs">
              {validationErrors.pin}
            </span>
          </div>
        )}

        {/* Number Keypad */}
        <Keypad
          onInput={handlePinInput}
          onClear={() => setPinCode(["", "", "", "", "", ""])}
          onBackspace={handleBackspace}
          showDecimal={false}
          className="max-w-[220px] sm:max-w-[240px] mx-auto"
        />

        <div className="text-right pt-2">
          <button
            type="button"
            onClick={handleManagerForgotPin}
            className="text-[#333333] text-sm hover:text-black transition-colors"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
            disabled={isLoading}
          >
            Forgot Your PIN?
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </>
  );
};

export default ManagerLoginForm;
