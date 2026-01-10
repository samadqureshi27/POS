// pages/LoginPage.tsx (Main Component)
"use client";
import React, { useRef, useEffect } from "react";
import { LoginProvider, useLoginContext } from "./_components/login-context";

// Import debug utilities (only loads in development)
if (process.env.NODE_ENV !== 'production') {
  import('@/lib/util/clear-all-auth');
}
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
      style={{ 
        background: "#d1ab35",
        overflowX: "hidden",
      }}
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
        <div className="absolute right-0 top-0 h-full z-50 w-full sm:w-auto">
          {/* Mobile: Full screen with rounded top corners, slides from bottom */}
          <div
            className={`
              sm:hidden
              fixed inset-x-0 bottom-0 bg-white rounded-t-2xl flex flex-col px-6 pt-12 pb-8 shadow-2xl
              transition-transform duration-700 ease-out
              ${showLoginContainer ? "transform translate-y-0" : "transform translate-y-full"}
            `}
            style={{
              willChange: "transform",
              height: "85vh",
              maxHeight: "85vh",
            }}
          >
            <AdminLoginForm />
            <ForgotPasswordOverlay />
            <EmailVerificationOverlay />
            <NewPasswordOverlay />
          </div>

          {/* Desktop: Side panel with original styling */}
          <div
            className={`hidden sm:flex min-h-[120%] bg-white rounded-sm flex-col px-10 md:px-12 pt-20 pb-40 shadow-lg mr-6 md:mr-12 mt-[20%] transition-transform duration-1000 ease-out relative w-[340px] md:w-[400px] ${
              showLoginContainer ? "transform translate-y-0" : "transform translate-y-full"
            }`}
            style={{
              willChange: "transform",
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
        <div className="absolute left-0 top-0 h-full z-50 w-full sm:w-auto">
          {/* Mobile: Full screen with rounded top corners, slides from bottom */}
          <div
            className={`
              sm:hidden
              fixed inset-x-0 bottom-0 bg-white rounded-t-2xl flex flex-col px-6 pt-12 pb-8 shadow-2xl
              transition-transform duration-700 ease-out
              ${showManagerContainer ? "transform translate-y-0" : "transform translate-y-full"}
            `}
            style={{
              willChange: "transform",
              height: "85vh",
              maxHeight: "85vh",
            }}
          >
            <ManagerLoginForm />
            <ManagerForgotPinOverlay />
          </div>

          {/* Desktop: Side panel with original styling */}
          <div
            className={`hidden sm:flex min-h-[120%] bg-white rounded-sm flex-col px-10 md:px-12 pt-20 pb-40 shadow-lg ml-6 md:ml-12 mt-[20%] transition-transform duration-1000 ease-out relative w-[340px] md:w-[400px] ${
              showManagerContainer ? "transform translate-y-0" : "transform translate-y-full"
            }`}
            style={{
              willChange: "transform",
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