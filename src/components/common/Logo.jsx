import React from 'react';
import { HeartHandshake } from 'lucide-react';

export default function Logo({ size = 'md', inverted = false, showText = true }) {
  const sizeMap = {
    sm: { box: 'w-7 h-7', icon: 16, title: 'text-sm', sub: 'text-[9px]' },
    md: { box: 'w-9 h-9', icon: 20, title: 'text-base', sub: 'text-[10px]' },
    lg: { box: 'w-12 h-12', icon: 26, title: 'text-xl', sub: 'text-xs' }
  };

  const current = sizeMap[size] || sizeMap.md;

  return (
    <div className="flex items-center gap-2.5 select-none">
      <div 
        className={`${current.box} rounded-xl flex items-center justify-center shadow-xs shrink-0 ${
          inverted 
            ? 'bg-blue-600 text-white shadow-blue-500/20' 
            : 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
        }`}
      >
        <HeartHandshake size={current.icon} strokeWidth={2.2} />
      </div>

      {showText && (
        <div className="leading-tight">
          <span className={`font-black tracking-tight block ${
            inverted ? 'text-white' : 'text-slate-900'
          } ${current.title}`}>
            Community<span className="text-blue-500">Care</span>
          </span>
          <span className={`font-medium block uppercase tracking-wider ${
            inverted ? 'text-slate-400' : 'text-slate-500'
          } ${current.sub}`}>
            Relief & Dispatch
          </span>
        </div>
      )}
    </div>
  );
}