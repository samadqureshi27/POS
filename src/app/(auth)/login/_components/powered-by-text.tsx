// components/login/PoweredByText.tsx
"use client";
import React from "react";
import { useLoginContext } from "./login-context";

const PoweredByText: React.FC = () => {
  const { phase, showLine, showManagerLine } = useLoginContext();

  return (
    <>
      {/* Mobile: Idle phase - show at bottom center */}
      {phase === "idle" && (
        <div
          className="sm:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-[35] flex items-center"
          style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
        >
          <img
            src="/Logos/Black.svg"
            alt="logo"
            className="w-3 h-3 object-contain mr-1.5"
          />
          <span className="text-[10px] font-medium text-black/60">
            Powered by Tri Tech Technology
          </span>
        </div>
      )}

      {/* Desktop: Admin powered by text - fixed to bottom left */}
      {phase === "adminLogin" && (
        <div
          className="hidden sm:flex fixed bottom-3 left-3 z-[60] items-center transition-all duration-700 ease-out"
          style={{
            transform: showLine ? "translateY(0)" : "translateY(20px)",
            opacity: showLine ? 1 : 0,
            fontFamily: "Manrope, system-ui, sans-serif",
          }}
        >
          <img
            src="/Logos/Black.svg"
            alt="logo"
            className="w-4 h-4 object-contain mr-1.5"
          />
          <span className="text-xs font-medium text-gray-400">
            Powered by Tri Tech Technology
          </span>
        </div>
      )}

      {/* Desktop: Manager powered by text - fixed to bottom right */}
      {phase === "managerLogin" && (
        <div
          className="hidden sm:flex fixed bottom-3 right-3 z-[60] items-center transition-all duration-700 ease-out"
          style={{
            transform: showManagerLine ? "translateY(0)" : "translateY(20px)",
            opacity: showManagerLine ? 1 : 0,
            fontFamily: "Manrope, system-ui, sans-serif",
          }}
        >
          <span className="text-xs font-medium text-gray-400 mr-1.5">
            Powered by Tri Tech Technology
          </span>
          <img
            src="/Logos/d1ab35.svg"
            alt="logo"
            className="w-4 h-4 object-contain"
          />
        </div>
      )}
    </>
  );
};

export default PoweredByText;