import { X } from 'lucide-react';

export default function Sidebar({ activeTab, onSelectTab, currentUser, onLogout, isOpen, onClose }) {
  return (
    <aside className={`
      fixed inset-y-0 left-0 z-50 w-72 bg-[#080d1d] text-white p-5 flex flex-col transition-transform duration-300 ease-in-out
      md:static md:translate-x-0 md:min-h-screen
      ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
    `}>
      {/* Header inside Sidebar */}
      <div className="flex items-center justify-between pb-5 border-b border-slate-800/80">
        <div>
          <h2 className="font-bold text-lg text-white">CommunityCare</h2>
          <p className="text-[11px] text-slate-400 uppercase tracking-wider">Relief & Dispatch</p>
        </div>
        
        {/* Mobile close button */}
        <button 
          onClick={onClose}
          className="md:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* ... your existing navigation buttons ... */}
    </aside>
  );
}