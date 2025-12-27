// components/login/ManagerLoginForm.tsx
"use client";
import React from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import ErrorMessage from "@/components/ui/error-message";
import { useLoginContext } from "./login-context";
import { validateManagerPinForm } from "@/lib/validations";

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

  const handlePinChange = (index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newPin = [...pinCode];
      newPin[index] = value;
      setPinCode(newPin);

      if (value && index < 3) {
        const nextInput = document.getElementById(`pin-${index + 1}`);
        nextInput?.focus();
      }

      if (validationErrors.pin) {
        setValidationErrors((prev) => ({ ...prev, pin: undefined }));
      }

      const completedPin = [...newPin];
      if (completedPin.every((digit) => digit !== "")) {
        const { isValid, errors } = validateManagerPinForm(completedPin);
        setValidationErrors(errors);

        if (isValid) {
          const pin = completedPin.join("");
          handleManagerLogin(pin);
        }
      }
    }
  };

  const handleManagerForgotPin = () => {
    setShowManagerForgotPin(true);
    setTimeout(() => {
      setShowManagerForgotContainer(true);
    }, 100);
  };

  const handleKeypadInput = (num: string) => {
    const emptyIndex = pinCode.findIndex((digit) => digit === "");
    if (emptyIndex !== -1) {
      handlePinChange(emptyIndex, num);
    }
  };

  const handleBackspace = () => {
    const lastFilledIndex = pinCode
      .map((digit, index) => (digit !== "" ? index : -1))
      .filter((index) => index !== -1)
      .pop();
    if (lastFilledIndex !== undefined) {
      handlePinChange(lastFilledIndex, "");
    }
  };

  return (
    <div
      className={`transition-all duration-500 ease-out ${
        showManagerContainer
          ? "opacity-100 transform translate-y-0"
          : "opacity-0 transform translate-y-4"
      }`}
    >
      {/* Mobile Back Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleBackToRoleSelection}
        className="absolute top-4 left-4 sm:hidden w-8 h-8 text-gray-400 hover:text-gray-600 z-10"
      >
        <ArrowLeft size={20} />
      </Button>

      <div className="mb-8 sm:mb-12 text-center -mt-6 sm:-mt-8">
        <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 tracking-widest font-medium">
          WELCOME BACK
        </p>
        <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
          Log In to your Account
        </h2>
      </div>

      {error && <ErrorMessage message={error} className="mb-4 sm:mb-6" />}

      <div className="space-y-6 sm:space-y-8">
        {/* PIN Input */}
        <div className="flex justify-center gap-2 sm:gap-3 md:gap-4">
          {pinCode.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              className="w-10 h-10 sm:w-12 sm:h-12 text-center text-lg sm:text-xl md:text-2xl font-bold border-0 bg-gray-100 rounded-sm focus:bg-gray-800 focus:text-white focus:ring-2 focus:ring-gray-600 focus:outline-none transition-colors"
              style={{
                backgroundColor: digit ? "#374151" : "#f3f4f6",
                color: digit ? "white" : "#374151",
              }}
              disabled={isLoading}
            />
          ))}
        </div>

        {/* Error message for PIN */}
        {validationErrors.pin && (
          <div className="text-center">
            <span className="text-red-500 text-sm">
              {validationErrors.pin}
            </span>
          </div>
        )}

        {/* Number Keypad */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 max-w-xs mx-auto px-4 sm:px-0">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <Button
              key={num}
              type="button"
              variant="secondary"

              className="h-12 sm:h-14 text-lg sm:text-xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              onClick={() => handleKeypadInput(num.toString())}
              disabled={
                isLoading || pinCode.every((digit) => digit !== "")
              }
            >
              {num}
            </Button>
          ))}
          <div></div> {/* Empty space */}
          <Button
            type="button"
            variant="secondary"

            className="h-12 sm:h-14 text-lg sm:text-xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
            onClick={() => handleKeypadInput("0")}
            disabled={isLoading || pinCode.every((digit) => digit !== "")}
          >
            0
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-12 sm:h-14 text-base sm:text-lg font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-sm transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
            onClick={handleBackspace}
            disabled={isLoading || pinCode.every((digit) => digit === "")}
          >
            ⌫
          </Button>
        </div>

        <div className="text-center pt-3">
          <Button
            type="button"
            variant="link"
            onClick={handleManagerForgotPin}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200 p-0 h-auto"
            disabled={isLoading}
          >
            Forgot Your PIN Code?
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginForm;