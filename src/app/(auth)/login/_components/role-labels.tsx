// components/login/RoleLabels.tsx
"use client";
import React from "react";
import { useLoginContext } from "./login-context";

const RoleLabels: React.FC = () => {
  const { 
    phase, 
    hoverSide, 
    handleAdminClick, 
    handleManagerClick, 
    handleBackToRoleSelection 
  } = useLoginContext();

  return (
    <div className="absolute inset-0 z-40 flex items-center justify-center gap-8 sm:gap-16 px-4">
      <span
        className={`pointer-events-auto cursor-pointer select-none text-black text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide transition-opacity duration-300 ${
          phase === "managerLogin"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
        style={{ textShadow: "0 0 2px rgba(0,0,0,0.25)" }}
        onClick={
          phase === "adminLogin"
            ? handleBackToRoleSelection
            : phase === "idle"
            ? handleAdminClick
            : undefined
        }
      >
        <span style={{ opacity: hoverSide === "right" ? 0.6 : 1 }}>
          ADMIN
        </span>
      </span>
      <span
        className={`pointer-events-auto cursor-pointer select-none pl-4 sm:pl-8 lg:pl-[50px] text-[#d1ab35] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold tracking-wide transition-opacity duration-300 ${
          phase === "adminLogin"
            ? "opacity-0 pointer-events-none"
            : "opacity-100"
        }`}
        onClick={
          phase === "managerLogin"
            ? handleBackToRoleSelection
            : phase === "idle"
            ? handleManagerClick
            : undefined
        }
      >
        <span style={{ opacity: hoverSide === "left" ? 0.6 : 1 }}>
          MANAGER
        </span>
      </span>
    </div>
  );
};

export default RoleLabels;