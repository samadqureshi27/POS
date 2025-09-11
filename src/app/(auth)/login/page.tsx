// pages/LoginPage.tsx (Main Component)
"use client";
import React, { useRef } from "react";
import { LoginProvider, useLoginContext } from "./_components/login-context";
import BackgroundLayer from "./_components/background-layer";
import RoleLabels from "./_components/role-labels";
import PoweredByText from "./_components/powered-by-text";
import AdminLoginForm from "./_components/admin-login-form";
import ForgotPasswordOverlay from "./_components/forgot-password";
import EmailVerificationOverlay from "./_components/email-verification";
import NewPasswordOverlay from "./_components/new-password";
import ManagerLoginForm from "./_components/manager-login-form";
import ManagerForgotPinOverlay from "./_components/manager-forgot-pin";

const LoginPageContent: React.FC = () => {

  const { phase, setHoverSide, showLoginContainer, showManagerContainer } = useLoginContext();

 const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: "#d1ab35" }}
      onMouseLeave={() => setHoverSide("none")}
      onMouseMove={(e) => {
        if (!containerRef.current || phase !== "idle") return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const threshold = 0.35 + 0.3 * y;
        setHoverSide(x >= threshold ? "right" : "left");
      }}
    >
      {/* Background layers with diagonal sections */}
      <BackgroundLayer containerRef={containerRef} />

      {/* Role selection labels */}
      <RoleLabels />

      {/* Powered by text animations */}
      <PoweredByText />

      {/* Admin login container with all overlays */}
      {phase === "adminLogin" && (
        <div className="absolute right-0 top-0 h-full z-50">
          <div
            className={`h-full bg-white rounded-tl-3xl rounded-tr-3xl flex flex-col justify-center px-16 py-20 shadow-lg mr-16 mt-16 transition-transform duration-1000 ease-out relative ${

              showLoginContainer ? "transform translate-y-0" : "transform translate-y-full"

            }`}
            style={{
              willChange: "transform",
              width: "450px",
              marginLeft: "-50px",
            }}
          >
            <AdminLoginForm />
            <ForgotPasswordOverlay />
            <EmailVerificationOverlay />
            <NewPasswordOverlay />
          </div>
        </div>
      )}

      {/* Manager PIN login container with overlays */}
      {phase === "managerLogin" && (
        <div className="absolute left-0 top-0 h-full z-50">
          <div
            className={`h-full bg-white rounded-tr-3xl rounded-tl-3xl flex flex-col justify-center px-16 py-20 shadow-lg ml-16 mt-16 transition-transform duration-1000 ease-out relative ${

              showManagerContainer ? "transform translate-y-0" : "transform translate-y-full"

            }`}
            style={{
              willChange: "transform",
              width: "450px",
              marginRight: "-50px",
            }}
          >
            <ManagerLoginForm />
            <ManagerForgotPinOverlay />
          </div>
        </div>
      )}
    </div>
  );
};

const LoginPage: React.FC = () => {
  return (
    <LoginProvider>
      <LoginPageContent />
    </LoginProvider>
  );
};

export default LoginPage;