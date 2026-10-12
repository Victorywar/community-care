import React from 'react';

export default function Logo({ size = 'md', inverted = false, showText = true }) {
  const dimensionMap = {
    sm: { width: 28, height: 28, stroke: 2.2 },
    md: { width: 38, height: 38, stroke: 2.5 },
    lg: { width: 50, height: 50, stroke: 2.8 },
    xl: { width: 72, height: 72, stroke: 3.2 },
  };

  const { width, height, stroke } = dimensionMap[size] || dimensionMap.md;
  // White outline when inverted (on dark screens/headers), dark navy when on light cards
  const strokeColor = inverted ? '#ffffff' : '#0f172a';

  return (
    <div className="flex items-center gap-3 select-none">
      {/* Pure Outline Heart Icon */}
      <svg
        width={width}
        height={height}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-200"
      >
        <path
          d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>

      {/* Brand Typography */}
      {showText && (
        <div className="flex flex-col">
          <div className="flex items-center text-lg sm:text-xl font-black tracking-tight leading-none">
            <span className={inverted ? 'text-white' : 'text-slate-900'}>Community</span>
            <span className={inverted ? 'text-blue-400' : 'text-blue-600'}>Care</span>
          </div>
          <span className="text-[9px] font-bold tracking-widest text-slate-400 uppercase mt-1 leading-none">
            Relief & Dispatch
          </span>
        </div>
      )}
    </div>
  );
}