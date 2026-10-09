import React from 'react';
import { 
  LayoutDashboard, 
  HeartHandshake, 
  Truck, 
  MessageSquare, 
  FileText 
} from 'lucide-react';

export default function MobileNavBar({ currentTab, setCurrentTab, currentUser }) {
  // Navigation tabs configured for quick mobile bottom bar access
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'donations', label: 'Donations', icon: HeartHandshake },
    { id: 'dispatch', label: 'Dispatch', icon: Truck },
    { id: 'relay', label: 'Relay', icon: MessageSquare },
    { id: 'receipts', label: 'Receipts', icon: FileText },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#080d1d] border-t border-slate-800 px-2 py-1 flex items-center justify-around shadow-lg">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentTab === item.id;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentTab(item.id)}
            className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-xl transition-all cursor-pointer ${
              isActive 
                ? 'text-blue-400 font-bold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <div className={`p-1 rounded-lg ${isActive ? 'bg-[#162244]' : 'bg-transparent'}`}>
              <Icon size={18} />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}