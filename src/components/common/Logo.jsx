import React from 'react';
import logoImg from '../../assets/logo.png';

export default function Logo({ size = 'md', inverted = false, showText = true }) {
  const sizeMap = {
    sm: { box: 'w-9 h-9', img: 'w-7 h-7', text: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-12 h-12', img: 'w-9 h-9', text: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-14 h-14', img: 'w-11 h-11', text: 'text-xl', sub: 'text-[11px]' },
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-3 select-none">
      {/* நீங்கள் வைக்கும் லோகோ படம் */}
      <div 
        className={`${current.box} rounded-2xl flex items-center justify-center shrink-0 p-1.5 shadow-sm transition-transform ${
          inverted ? 'bg-white' : 'bg-[#0b1329] border border-slate-700'
        }`}
      >
        <img 
          src={logoImg} 
          alt="Community Care Logo" 
          className={`${current.img} object-contain`} 
        />
      </div>

      {showText && (
        <div className="flex flex-col justify-center">
          <h1 
            className={`font-black tracking-tight leading-none ${current.text} ${
              inverted ? 'text-white' : 'text-slate-900'
            }`}
          >
            COMMUNITY CARE
          </h1>
          <div className="h-0.5 w-10 bg-blue-500 my-1 rounded-full"></div>
          <p 
            className={`font-semibold uppercase tracking-wider ${current.sub} ${
              inverted ? 'text-slate-400' : 'text-slate-500'
            }`}
          >
            Transparent Aid Platform
          </p>
        </div>
      )}
    </div>
  );
}