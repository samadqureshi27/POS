// components/login/BackgroundLayer.tsx
"use client";
import React from "react";
import { useLoginContext } from "./login-context";

interface BackgroundLayerProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const BackgroundLayer: React.FC<BackgroundLayerProps> = () => {
  const {
    phase,
    hoverSide,
    handleAdminClick,
    handleManagerClick
  } = useLoginContext();

  // Base diagonal position (center of partition)
  const baseTopX = 35;
  const baseBottomX = 65;

  // Hover offset - smoothly moves partition when hovering
  const hoverOffset = hoverSide === "left" ? 5 : hoverSide === "right" ? -5 : 0;

  // Calculate current partition position based on phase and hover
  const getClipPath = () => {
    if (phase === "toBlack" || phase === "managerLogin") {
      // Full black - partition moved completely to left
      return "polygon(-35% 0, 100% 0, 100% 100%, -5% 100%)";
    }
    if (phase === "toGold" || phase === "adminLogin") {
      // Full gold - partition moved completely to right
      return "polygon(135% 0, 100% 0, 100% 100%, 165% 100%)";
    }
    // Idle state - apply hover offset for smooth movement
    const topX = baseTopX + hoverOffset;
    const bottomX = baseBottomX + hoverOffset;
    return `polygon(${topX}% 0, 100% 0, 100% 100%, ${bottomX}% 100%)`;
  };

  // Mobile clip paths for slightly diagonal split (right side higher, left side lower)
  const getMobileClipPath = () => {
    if (phase === "toBlack" || phase === "managerLogin") {
      return "polygon(0 0, 100% 0, 100% 100%, 0 100%)";
    }
    if (phase === "toGold" || phase === "adminLogin") {
      return "polygon(0 -100%, 100% -100%, 100% -5%, 0 5%)";
    }
    // Idle: slight diagonal - 45% on right, 55% on left
    return "polygon(0 0, 100% 0, 100% 8%, 0 88%)";
  };

  return (
    <>
      {/* Golden background base */}
      <div className="absolute inset-0 bg-[#d1ab35] z-0" />

      {/* Admin side logo - Black, inverted, bottom-left, half-cut - Desktop only */}
      <div
        className="absolute bottom-0 left-0 z-[5] overflow-hidden pointer-events-none hidden sm:block"
        style={{
          width: "60%",
          height: "100%",
          opacity: phase === "managerLogin" || phase === "toBlack" ? 0 : 1,
          clipPath: phase === "adminLogin" || phase === "toGold" 
            ? `polygon(0 0, ${baseTopX}% 0, ${baseBottomX}% 100%, 0 100%)` 
            : "none",
          transition: "opacity 600ms ease, clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <img
          src="/Logos/Black.svg"
          alt=""
          aria-hidden="true"
          className="absolute select-none object-contain"
          style={{
            height: "200%",
            width: "auto",
            bottom: "-48%",
            left: "-50%",
            transform: "rotate(180deg)",
            opacity: 0.5,
          }}
        />
      </div>

      {/* Mobile: Gold logo - top-left, 50-50 split (in manager/black section) */}
      <div
        className="absolute top-0 left-0 z-[12] overflow-hidden pointer-events-none sm:hidden"
        style={{
          width: "200%",
          height: "100%",
          opacity: phase === "adminLogin" || phase === "toGold" ? 0 : 1,
          transition: "opacity 600ms ease",
        }}
      >
        <img
          src="/Logos/d1ab35.svg"
          alt=""
          aria-hidden="true"
          className="absolute select-none object-contain"
          style={{
            height: "250%",
            width: "auto",
            top: "-81%",
            left: "-50%",
            opacity: 0.25,
          }}
        />
      </div>

      {/* Mobile: Black logo - bottom-right, inverted, 50-50 split (in admin/gold section) */}
      <div
        className="absolute bottom-0 right-0 z-[5] overflow-hidden pointer-events-none sm:hidden"
        style={{
          width: "200%",
          height: "100%",
          opacity: phase === "managerLogin" || phase === "toBlack" ? 0 : 1,
          transition: "opacity 600ms ease",
        }}
      >
        <img
          src="/Logos/Black.svg"
          alt=""
          aria-hidden="true"
          className="absolute select-none object-contain"
          style={{
            height: "200%",
            width: "auto",
            bottom: "-56%",
            right: "-50%",
            transform: "rotate(180deg)",
            opacity: 0.25,
          }}
          draggable={false}
        />
      </div>

      {/* Desktop: Black section (Manager side) with smooth diagonal partition */}
      <div
        className="absolute inset-0 bg-black z-10 hidden sm:block"
        style={{
          clipPath: getClipPath(),
          opacity: phase === "adminLogin" || phase === "toGold" ? 0 : 1,
          transition: phase === "idle"
            ? "clip-path 400ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 400ms ease"
            : "clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease",
          willChange: "clip-path",
          pointerEvents: phase === "idle" ? "auto" : "none",
        }}
        onClick={phase === "idle" ? handleManagerClick : undefined}
      >
        {/* Manager side logo - Golden, normal, top-right, half-cut */}
        <div
          className="absolute top-0 right-0 overflow-hidden pointer-events-none"
          style={{
            width: "60%",
            height: "100%",
          }}
        >
          <img
            src="/Logos/d1ab35.svg"
            alt=""
            aria-hidden="true"
            className="absolute select-none object-contain"
            style={{
              height: "200%",
              width: "auto",
              top: "-48%",
              right: "-50%",
              opacity: 0.5,
            }}
          />
        </div>
      </div>

      {/* Mobile: Black section (Manager side) with horizontal split */}
      <div
        className="absolute bg-black z-10 sm:hidden"
        style={{
          top: 0,
          left: 0,
          right: "-20px",
          bottom: 0,
          width: "calc(100% + 20px)",
          clipPath: getMobileClipPath(),
          opacity: phase === "adminLogin" || phase === "toGold" ? 0 : 1,
          transition: phase === "idle"
            ? "clip-path 400ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity 400ms ease"
            : "clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1), opacity 900ms ease",
          willChange: "clip-path",
          pointerEvents: phase === "idle" ? "auto" : "none",
        }}
        onClick={phase === "idle" ? handleManagerClick : undefined}
      />

      {/* Desktop: Admin section clickable area - invisible but clickable */}
      <div
        className="absolute inset-0 z-20 hidden sm:block"
        style={{
          clipPath: `polygon(0 0, ${baseTopX + hoverOffset}% 0, ${baseBottomX + hoverOffset}% 100%, 0 100%)`,
          transition: phase === "idle"
            ? "clip-path 400ms cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: phase === "idle" ? "auto" : "none",
        }}
        onClick={phase === "idle" ? handleAdminClick : undefined}
      />

      {/* Mobile: Admin section clickable area - bottom diagonal half */}
      <div
        className="absolute inset-0 z-20 sm:hidden"
        style={{
          clipPath: phase === "toGold" || phase === "adminLogin"
            ? "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
            : phase === "toBlack" || phase === "managerLogin"
            ? "polygon(0 105%, 100% 95%, 100% 200%, 0 200%)"
            : "polygon(0 55%, 100% 45%, 100% 100%, 0 100%)",
          transition: phase === "idle"
            ? "clip-path 400ms cubic-bezier(0.25, 0.1, 0.25, 1)"
            : "clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          pointerEvents: phase === "idle" ? "auto" : "none",
        }}
        onClick={phase === "idle" ? handleAdminClick : undefined}
      />
    </>
  );
};

export default BackgroundLayer;