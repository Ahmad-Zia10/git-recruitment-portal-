import React from 'react';
import { NavLink } from 'react-router-dom';

export const TopNavBar: React.FC = () => {
  return (
    <header className="flex justify-between items-center w-full px-container-padding-desktop h-16 sticky top-0 z-40 bg-surface-container-lowest border-b border-outline-variant">
      <div className="flex items-center gap-8">
        <div className="font-headline-sm text-headline-sm font-black text-on-surface">GIT Software Technologies RMS</div>
        <div className="hidden lg:flex items-center gap-6">
          <NavLink to="/" className={({ isActive }) => 
            isActive 
              ? "text-primary font-bold border-b-2 border-primary pb-1 font-body-md text-body-md cursor-pointer active:opacity-80"
              : "text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80"
          }>
            Dashboard
          </NavLink>
          <a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Analytics</a>
          <a className="text-on-surface-variant font-body-md text-body-md hover:text-primary transition-colors cursor-pointer active:opacity-80" href="#">Reports</a>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative hidden sm:block">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
          <input className="pl-10 pr-4 py-2 bg-surface-container-low border-none rounded-brand text-sm focus:ring-2 focus:ring-primary/20 w-64 transition-all" placeholder="Search..." type="text" />
        </div>
        <button className="bg-primary-container text-on-primary-container px-4 py-2 rounded-brand font-semibold text-sm hover:opacity-90 transition-all flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add New
        </button>
        <div className="flex items-center gap-2 border-l pl-4 border-outline-variant">
          <button className="p-2 text-on-surface-variant hover:bg-surface-variant/10 rounded-full transition-colors relative">
            <span className="material-symbols-outlined">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full"></span>
          </button>
          <button className="p-2 text-on-surface-variant hover:bg-surface-variant/10 rounded-full transition-colors">
            <span className="material-symbols-outlined">help_outline</span>
          </button>
          <div className="w-8 h-8 rounded-full ml-2 bg-surface-variant flex items-center justify-center text-on-surface">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  );
};
