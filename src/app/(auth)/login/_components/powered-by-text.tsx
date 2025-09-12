// components/login/PoweredByText.tsx
"use client";
import React from "react";
import { useLoginContext } from "./login-context";

const PoweredByText: React.FC = () => {
  const { phase, showLine, showManagerLine } = useLoginContext();

  return (
    <>
      {/* Admin powered by text - comes from left */}
      {phase === "adminLogin" && (
        <div
          className="absolute bottom-12 left-4 z-45 flex items-center transition-all duration-1000 ease-out"
          style={{
            transform: showLine ? "translateX(0)" : "translateX(-100%)",
            opacity: showLine ? 1 : 0,
            willChange: "transform, opacity",
          }}
        >
          <div className="w-6 h-6 mr-2 flex items-center justify-center">
            <img
              src="/logos/Black.svg"
              alt="logo"
              className="w-6 h-6 object-contain"
            />
          </div>

          <span className="text-base font-medium" style={{ color: "#2e2e2e" }}>
            Powered by Tri Tech Technology
          </span>
        </div>
      )}

      {/* Manager powered by text - comes from right */}
      {phase === "managerLogin" && (
        <div
          className="absolute bottom-12 right-4 z-45 flex items-center transition-all duration-1000 ease-out"
          style={{
            transform: showManagerLine ? "translateX(0)" : "translateX(100%)",
            opacity: showManagerLine ? 1 : 0,
            willChange: "transform, opacity",
          }}
        >
          <span className="text-base font-medium text-gray-500 mr-2">
            Powered by Tri Tech Technology
          </span>
          <div className="w-6 h-6 mr-2 flex items-center justify-center">
            <img
              src="/logos/d1ab35.svg"
              alt="logo"
              className="w-6 h-6 object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default PoweredByText;