"use client";
import React, { useState, useEffect, Suspense } from "react";
import { Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter, useSearchParams } from "next/navigation";

const SetPasswordContent: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    newPassword?: string;
    confirmPassword?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    length: false,
    uppercase: false,
    lowercase: false,
    number: false,
    special: false,
  });

  useEffect(() => {
    // Check password strength
    setPasswordStrength({
      length: newPassword.length >= 8,
      uppercase: /[A-Z]/.test(newPassword),
      lowercase: /[a-z]/.test(newPassword),
      number: /[0-9]/.test(newPassword),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    });
  }, [newPassword]);

  const validateForm = () => {
    const errors: { newPassword?: string; confirmPassword?: string } = {};

    if (!newPassword) {
      errors.newPassword = "Password is required";
    } else if (newPassword.length < 8) {
      errors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
      errors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!confirmPassword) {
      errors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSetPassword = async () => {
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/set-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ token, password: newPassword })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      setSuccess(true);

      // Redirect to login after 2 seconds
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (error) {
      console.error("Error setting password:", error);
      setValidationErrors({
        newPassword: "Failed to set password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStrengthColor = () => {
    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score <= 2) return "bg-red-500";
    if (score <= 3) return "bg-yellow-500";
    if (score <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  const getStrengthText = () => {
    const score = Object.values(passwordStrength).filter(Boolean).length;
    if (score <= 2) return "Weak";
    if (score <= 3) return "Fair";
    if (score <= 4) return "Good";
    return "Strong";
  };

  if (success) {
    return (
      <div
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ background: "#d1ab35" }}
      >
        <div className="bg-white rounded-sm shadow-2xl p-8 sm:p-12 md:p-16 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="mb-6 flex justify-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-green-600" />
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-4">
              Password Set Successfully!
            </h2>
            <p className="text-gray-600 text-sm md:text-base mb-6">
              Your password has been set successfully. You can now log in to your
              account.
            </p>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
            <p className="text-gray-500 text-sm mt-4">
              Redirecting to login page...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative h-screen w-full overflow-hidden flex items-center justify-center"
      style={{ background: "#d1ab35" }}
    >
      <div className="bg-white rounded-sm shadow-2xl p-8 sm:p-12 md:p-16 max-w-md w-full mx-4">
        {/* Header */}
        <div className="mb-8 sm:mb-10 text-center">
          <p className="text-gray-500 text-xs sm:text-sm mb-2 sm:mb-3 tracking-widest font-medium">
            WELCOME
          </p>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-3">
            Set Your Password
          </h2>
          <p className="text-gray-600 text-sm">
            Create a secure password for your new account
          </p>
        </div>

        {/* Password Strength Indicator */}
        {newPassword && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-600">Password Strength</span>
              <span className={`text-xs font-semibold ${
                getStrengthText() === "Weak" ? "text-red-500" :
                getStrengthText() === "Fair" ? "text-yellow-500" :
                getStrengthText() === "Good" ? "text-blue-500" :
                "text-green-500"
              }`}>
                {getStrengthText()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${getStrengthColor()}`}
                style={{
                  width: `${(Object.values(passwordStrength).filter(Boolean).length / 5) * 100}%`,
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2 mt-3">
              {[
                { key: "length", label: "8+ characters" },
                { key: "uppercase", label: "Uppercase" },
                { key: "lowercase", label: "Lowercase" },
                { key: "number", label: "Number" },
              ].map((item) => (
                <div
                  key={item.key}
                  className={`flex items-center text-xs ${
                    passwordStrength[item.key as keyof typeof passwordStrength]
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  <CheckCircle2
                    size={14}
                    className={`mr-1 ${
                      passwordStrength[item.key as keyof typeof passwordStrength]
                        ? "opacity-100"
                        : "opacity-30"
                    }`}
                  />
                  {item.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Form */}
        <div className="space-y-5">
          {/* New Password */}
          <div>
            <Label
              htmlFor="newPassword"
              className="text-sm font-medium text-gray-700 mb-1.5 block"
            >
              Password
            </Label>
            <div className="relative">
              <Input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    newPassword: undefined,
                  }));
                }}
                placeholder="Enter your password"
                disabled={isLoading}
                className="placeholder-gray-400 text-sm tracking-wide rounded-sm py-3 sm:py-4 pl-12 pr-12"
              />
              <Lock
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.newPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.newPassword}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <Label
              htmlFor="confirmPassword"
              className="text-sm font-medium text-gray-700 mb-1.5 block"
            >
              Confirm Password
            </Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setValidationErrors((prev) => ({
                    ...prev,
                    confirmPassword: undefined,
                  }));
                }}
                placeholder="Re-enter your password"
                disabled={isLoading}
                className="placeholder-gray-400 text-sm tracking-wide rounded-sm py-3 sm:py-4 pl-12 pr-12"
              />
              <Lock
                size={18}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {validationErrors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1.5">
                {validationErrors.confirmPassword}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button
              type="button"
              size="lg"
              className="w-full bg-black text-[#d1ab35] hover:bg-gray-800 font-semibold tracking-widest py-3 sm:py-4 rounded-sm text-xs sm:text-sm"
              disabled={isLoading || !newPassword || !confirmPassword}
              onClick={handleSetPassword}
            >
              {isLoading ? "SETTING PASSWORD..." : "SET PASSWORD"}
            </Button>
          </div>

          {/* Footer */}
          <div className="text-center pt-4">
            <p className="text-gray-500 text-xs">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-gray-700 hover:text-black font-medium"
              >
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Powered by text */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <p className="text-black text-xs tracking-wider opacity-60">
          POWERED BY{" "}
          <span className="font-semibold">Tri Tech Technology</span>
        </p>
      </div>
    </div>
  );
};

const SetPasswordPage: React.FC = () => {
  return (
    <Suspense fallback={
      <div
        className="relative h-screen w-full overflow-hidden flex items-center justify-center"
        style={{ background: "#d1ab35" }}
      >
        <div className="bg-white rounded-sm shadow-2xl p-8 sm:p-12 md:p-16 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      </div>
    }>
      <SetPasswordContent />
    </Suspense>
  );
};

export default SetPasswordPage;
