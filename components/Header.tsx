import React from 'react';
import { ViewState } from '../types';

interface HeaderProps {
  activeSection: ViewState;
  onNavigate?: (section: ViewState) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeSection, onNavigate }) => {
  const handleNavigation = (id: ViewState) => {
    if (onNavigate) {
      onNavigate(id);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const navItems: { label: string; value: ViewState }[] = [
    { label: 'Home', value: 'home' },
    { label: 'Work', value: 'work' },
    { label: 'About', value: 'about' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-black">
      <div className="grid grid-cols-12 h-16 items-center px-4 md:px-8">
        {/* Logo */}
        <div className="col-span-4 md:col-span-3">
          <h1 
            className="text-sm md:text-base font-bold tracking-tighter cursor-pointer hover:text-swiss-red transition-colors select-none"
            onClick={() => handleNavigation('home')}
          >
            MIAO LIU ©25
          </h1>
        </div>
        
        {/* Main Navigation */}
        <nav className="col-span-4 md:col-span-6 flex justify-center">
          <ul className="flex space-x-6 md:space-x-12 bg-white/50 px-6 py-2 rounded-full backdrop-blur-md border border-black/5 md:border-none">
            {navItems.map((item) => (
              <li key={item.value}>
                <button
                  onClick={() => handleNavigation(item.value)}
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                    activeSection === item.value 
                      ? 'text-swiss-red' 
                      : 'text-black hover:text-neutral-500'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact Button */}
        <div className="col-span-4 md:col-span-3 flex justify-end">
          <button
            onClick={() => handleNavigation('contact')}
            className="bg-black text-white px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-swiss-red transition-colors shadow-[2px_2px_0px_0px_rgba(255,51,51,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Contact
          </button>
        </div>
      </div>
    </header>
  );
};