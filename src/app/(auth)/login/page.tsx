"use client";
import React from 'react';

const AdminManagerPage: React.FC = () => {
  const [phase, setPhase] = React.useState<'idle' | 'toBlack' | 'toGold'>('idle');
  const [hoverSide, setHoverSide] = React.useState<'none' | 'left' | 'right'>('none');
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const transitionMs = 900;

  const handleAdminClick = () => {
    if (phase !== 'idle') return;
    // Left (gold) -> fill entire screen gold
    setPhase('toGold');
    window.setTimeout(() => {
      window.location.href = '/login/admin';
    }, transitionMs);
  };

  const handleManagerClick = () => {
    if (phase !== 'idle') return;
    // Right (black) -> fill entire screen black
    setPhase('toBlack');
    window.setTimeout(() => {
      window.location.href = '/login/manager';
    }, transitionMs);
  };

  // Accent stripe geometry centered on the divider to avoid double lines
  const topX = 35; // percent at top
  const bottomX = 65; // percent at bottom
  const stripeHalf = 0.6; // half width of the stripe in percent (total ~1.2%)
  const topLeft = topX - stripeHalf;
  const topRight = topX + stripeHalf;
  const bottomLeft = bottomX - stripeHalf;
  const bottomRight = bottomX + stripeHalf;
  const accentPolygon = `polygon(${topLeft}% 0, ${topRight}% 0, ${bottomRight}% 100%, ${bottomLeft}% 100%)`;
  const accentColor = hoverSide === 'right' ? '#000000' : hoverSide === 'left' ? '#d1ab35' : 'transparent';

  return (
    <div
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: '#d1ab35' }}
      onMouseLeave={() => setHoverSide('none')}
      onMouseMove={(e) => {
        if (!containerRef.current || phase !== 'idle') return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        const threshold = 0.35 + 0.30 * y; // diagonal split
        setHoverSide(x >= threshold ? 'right' : 'left');
      }}
    >
      {/* Left decorative pattern below overlay */}
      <img
        src="/images/login-left.png"
        alt=""
        aria-hidden="true"
        className="pointer-events-none select-none absolute left-0 top-0 h-full w-auto object-contain z-0"
        draggable={false}
      />

      {/* Black overlay that wipes up (admin) or down (manager) */}
      <div
        className="absolute inset-0 bg-black z-10"
        style={{
          clipPath:
            phase === 'toBlack'
              ? 'polygon(-35% 0, 100% 0, 100% 100%, -5% 100%)' // sweep diagonal left off-screen (fills black)
              : phase === 'toGold'
              ? 'polygon(135% 0, 100% 0, 100% 100%, 165% 100%)' // sweep diagonal right off-screen (reveals gold)
              : 'polygon(35% 0, 100% 0, 100% 100%, 65% 100%)', // initial right region
          transition: 'clip-path 900ms cubic-bezier(0.22, 1, 0.36, 1)',
          willChange: 'clip-path',
          pointerEvents: phase === 'idle' ? 'auto' : 'none'
        }}
        onClick={handleManagerClick}
      >
        {/* Right decorative pattern anchored to black side */}
        <img
          src="/images/login-right.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none select-none absolute right-0 top-0 h-full w-auto object-contain"
          draggable={false}
        />
      </div>

      {/* Left clickable zone for Admin (transparent over gold) */}
      <div
        className="absolute inset-0 z-20"
        style={{
          clipPath: 'polygon(0 0, 35% 0, 65% 100%, 0 100%)',
          pointerEvents: phase === 'idle' ? 'auto' : 'none'
        }}
        onClick={handleAdminClick}
      />
      

      {/* Diagonal accent stripe aligned to the divider; only one stripe centered on the split to avoid a double border look. */}
      <div
        className="absolute inset-0 z-30 pointer-events-none"
        style={{
          clipPath: hoverSide === 'none' ? 'polygon(0 0,0 0,0 0,0 0)' : accentPolygon,
          background: hoverSide === 'left' ? accentColor : hoverSide === 'right' ? accentColor : 'transparent',
          opacity: hoverSide === 'none' || phase !== 'idle' ? 0 : 1,
          transition: 'opacity 150ms ease',
          willChange: 'opacity, clip-path'
        }}
      />

      {/* Center labels (also clickable) */}
      <div className="absolute inset-0 z-40 flex items-center justify-center gap-16">
        <span
          className="pointer-events-auto cursor-pointer select-none text-black text-3xl md:text-4xl font-semibold tracking-wide"
          style={{ textShadow: '0 0 2px rgba(0,0,0,0.25)' }}
          onClick={handleAdminClick}
        >
          <span style={{ opacity: hoverSide === 'right' ? 0.6 : 1 }}>ADMIN</span>
        </span>
        <span
          className="pointer-events-auto cursor-pointer select-none pl-[50px] text-[#d1ab35] text-3xl md:text-4xl font-semibold tracking-wide"
          onClick={handleManagerClick}
        >
          <span style={{ opacity: hoverSide === 'left' ? 0.6 : 1 }}>MANAGER</span>
        </span>
      </div>
    </div>
  );
};

export default AdminManagerPage;