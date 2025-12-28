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

  // Labels move slightly with the partition on hover (desktop only)
  const hoverTranslate = hoverSide === "left" ? 8 : hoverSide === "right" ? -8 : 0;

  return (
    <>
      {/* Desktop: Horizontal layout with diagonal partition */}
      <div className="absolute inset-0 z-40 hidden sm:flex items-center justify-center px-4">
        {/* Admin label */}
        <span
          className="pointer-events-auto cursor-pointer select-none text-black font-semibold tracking-wider"
          style={{
            fontFamily: "Allerta Stencil, system-ui, sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 2.5rem)",
            opacity: phase === "managerLogin" || phase === "toBlack" ? 0 : 1,
            transform: phase === "idle"
              ? `translateX(${hoverTranslate}px) scale(${hoverSide === "left" ? 1.05 : hoverSide === "right" ? 0.95 : 1})`
              : phase === "adminLogin" || phase === "toGold"
              ? "translateX(0) scale(1)"
              : "translateX(-50px) scale(0.9)",
            transition: "transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)",
            pointerEvents: phase === "managerLogin" || phase === "toBlack" ? "none" : "auto",
            marginRight: "2rem",
          }}
          onClick={
            phase === "adminLogin"
              ? handleBackToRoleSelection
              : phase === "idle"
              ? handleAdminClick
              : undefined
          }
        >
          ADMIN
        </span>

        {/* Manager label */}
        <span
          className="pointer-events-auto cursor-pointer select-none text-[#d1ab35] font-semibold tracking-wider"
          style={{
            fontFamily: "Allerta Stencil, system-ui, sans-serif",
            fontSize: "clamp(1.25rem, 3vw, 2.5rem)",
            opacity: phase === "adminLogin" || phase === "toGold" ? 0 : 1,
            transform: phase === "idle"
              ? `translateX(${hoverTranslate}px) scale(${hoverSide === "right" ? 1.05 : hoverSide === "left" ? 0.95 : 1})`
              : phase === "managerLogin" || phase === "toBlack"
              ? "translateX(0) scale(1)"
              : "translateX(50px) scale(0.9)",
            transition: "transform 400ms cubic-bezier(0.25, 0.1, 0.25, 1)",
            pointerEvents: phase === "adminLogin" || phase === "toGold" ? "none" : "auto",
            marginLeft: "2rem",
          }}
          onClick={
            phase === "managerLogin"
              ? handleBackToRoleSelection
              : phase === "idle"
              ? handleManagerClick
              : undefined
          }
        >
          MANAGER
        </span>
      </div>

      {/* Mobile: Stacked vertical layout */}
      <div className="absolute inset-0 z-40 sm:hidden flex flex-col">
        {/* Manager label - top half (black section) */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            opacity: phase === "adminLogin" || phase === "toGold" ? 0 : 1,
            transform: phase === "idle"
              ? "translateY(0) scale(1)"
              : phase === "managerLogin" || phase === "toBlack"
              ? "translateY(-17.5vh) scale(0.85)" // Move from center of top half (25vh) to center of top space (7.5vh)
              : "translateY(-30px) scale(0.9)",
            transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: phase === "adminLogin" || phase === "toGold" ? "none" : "auto",
          }}
        >
          <span
            className="pointer-events-auto cursor-pointer select-none text-[#d1ab35] font-semibold tracking-wider text-xl"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
            onClick={
              phase === "managerLogin"
                ? handleBackToRoleSelection
                : phase === "idle"
                ? handleManagerClick
                : undefined
            }
          >
            MANAGER
          </span>
        </div>

        {/* Admin label - bottom half (gold section) */}
        <div
          className="flex-1 flex items-center justify-center"
          style={{
            opacity: phase === "managerLogin" || phase === "toBlack" ? 0 : 1,
            transform: phase === "idle"
              ? "translateY(0) scale(1)"
              : phase === "adminLogin" || phase === "toGold"
              ? "translateY(-67.5vh) scale(0.85)" // Move from center of bottom half (75vh) to center of top space (7.5vh)
              : "translateY(30px) scale(0.9)",
            transition: "all 700ms cubic-bezier(0.22, 1, 0.36, 1)",
            pointerEvents: phase === "managerLogin" || phase === "toBlack" ? "none" : "auto",
          }}
        >
          <span
            className="pointer-events-auto cursor-pointer select-none text-black font-semibold tracking-wider text-xl"
            style={{ fontFamily: "Manrope, system-ui, sans-serif" }}
            onClick={
              phase === "adminLogin"
                ? handleBackToRoleSelection
                : phase === "idle"
                ? handleAdminClick
                : undefined
            }
          >
            ADMIN
          </span>
        </div>
      </div>
    </>
  );
};

export default RoleLabels;