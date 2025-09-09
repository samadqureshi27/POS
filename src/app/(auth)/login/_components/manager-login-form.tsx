// components/login/ManagerLoginForm.tsx
"use client";
import React from "react";
import ErrorMessage from "@/components/layout/UI/ErrorMessage";
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
      <div className="mb-12 text-center -mt-8">
        <p className="text-gray-500 text-sm mb-3 tracking-widest font-medium">
          WELCOME BACK
        </p>
        <h2 className="text-2xl font-semibold text-gray-900">
          Log In to your Account
        </h2>
      </div>

      {error && <ErrorMessage message={error} className="mb-6" />}

      <div className="space-y-8">
        {/* PIN Input */}
        <div className="flex justify-center gap-4">
          {pinCode.map((digit, index) => (
            <input
              key={index}
              id={`pin-${index}`}
              type="password"
              maxLength={1}
              value={digit}
              onChange={(e) => handlePinChange(index, e.target.value)}
              className="w-12 h-12 text-center text-2xl font-bold border-0 bg-gray-100 rounded-lg focus:bg-gray-800 focus:text-white focus:ring-2 focus:ring-gray-600 focus:outline-none transition-colors"
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
        <div className="grid grid-cols-3 gap-4 max-w-xs mx-auto">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              type="button"
              className="h-14 text-xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
              onClick={() => handleKeypadInput(num.toString())}
              disabled={
                isLoading || pinCode.every((digit) => digit !== "")
              }
            >
              {num}
            </button>
          ))}
          <div></div> {/* Empty space */}
          <button
            type="button"
            className="h-14 text-xl font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
            onClick={() => handleKeypadInput("0")}
            disabled={isLoading || pinCode.every((digit) => digit !== "")}
          >
            0
          </button>
          <button
            type="button"
            className="h-14 text-lg font-medium text-gray-500 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-orange-200"
            onClick={handleBackspace}
            disabled={isLoading || pinCode.every((digit) => digit === "")}
          >
            ⌫
          </button>
        </div>

        <div className="text-center pt-3">
          <button
            type="button"
            onClick={handleManagerForgotPin}
            className="text-gray-500 text-sm hover:text-gray-700 transition-colors duration-200"
            disabled={isLoading}
          >
            Forgot Your PIN Code?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManagerLoginForm;