// components/login/BackgroundLayer.tsx
"use client";
import React from "react";
import { useLoginContext } from "./login-context";

interface BackgroundLayerProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

const BackgroundLayer: React.FC<BackgroundLayerProps> = ({ containerRef }) => {
  const { 
    phase, 
    hoverSide, 
    setHoverSide, 
    handleAdminClick, 
    handleManagerClick 
  } = useLoginContext();

  // Diagonal geometry calculations
  const topX = 35;
  const bottomX = 65;
  const stripeHalf = 0.6;
  const topLeft = topX - stripeHalf;
  const topRight = topX + stripeHalf;
  const bottomLeft = bottomX - stripeHalf;
  const bottomRight = bottomX + stripeHalf;
  const accentPolygon = `polygon(${topLeft}% 0, ${topRight}% 0, ${bottomRight}% 100%, ${bottomLeft}% 100%)`;
  const accentColor =
    hoverSide === "right"
      ? "#000000"
      : hoverSide === "left"
      ? "#d1ab35"
      : "transparent";

  return (
    <>
      {/* Base golden background */}
      <img
        src="/logos/Blacka.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 h-full w-auto object-contain z-0"
        draggable={false}
      />

      {/* Black section (Manager side) */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{
          clipPath:
            phase === "toBlack" || phase === "managerLogin"
              ? "polygon(-35% 0, 100% 0, 100% 100%, -5% 100%)"
              : phase === "toGold" || phase === "adminLogin"
              ? "polygon(135% 0, 100% 0, 100% 100%, 165% 100%)"
              : "polygon(35% 0, 100% 0, 100% 100%, 65% 100%)",
          transition: "clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)",
          willChange: "clip-path",
          pointerEvents: phase === "idle" ? "auto" : "none",
        }}
        onClick={phase === "idle" ? handleManagerClick : undefined}
      >
        <img
          src="/logos/d1ab35a.svg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-0 top-0 h-full w-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Admin section clickable area */}
      <div
        className="absolute inset-0 z-20"
        style={{
          clipPath: "polygon(0 0, 35% 0, 65% 100%, 0 100%)",
          pointerEvents: phase === "idle" ? "auto" : "none",
        }}
        onClick={phase === "idle" ? handleAdminClick : undefined}
      />

      {/* Hover accent overlay */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          clipPath:
            hoverSide === "none" ? "polygon(0 0,0 0,0 0,0 0)" : accentPolygon,
          background:
            hoverSide === "left"
              ? accentColor
              : hoverSide === "right"
              ? accentColor
              : "transparent",
          opacity: hoverSide === "none" || phase !== "idle" ? 0 : 1,
          transition: "opacity 150ms ease",
          willChange: "opacity, clip-path",
        }}
      />
    </>
  );
};

export default BackgroundLayer;