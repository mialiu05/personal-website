import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface HeaderProps {
  activeSection: string;
}

export const Header: React.FC<HeaderProps> = ({ activeSection }) => {
  const location = useLocation();

  const handleContactClick = () => {
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems: { label: string; path: string }[] = [
    { label: 'Work', path: '/' },
    { label: 'About', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-sm border-b border-black">
      <div className="grid grid-cols-12 h-16 items-center px-4 md:px-8">
        {/* Logo */}
        <div className="col-span-4 md:col-span-3">
          <Link to="/">
            <h1
              className="text-sm md:text-base font-bold tracking-tighter cursor-pointer hover:text-swiss-red transition-colors select-none"
            >
              MIAO LIU ©26
            </h1>
          </Link>
        </div>

        {/* Main Navigation */}
        <nav className="col-span-4 md:col-span-6 flex justify-center">
          <ul className="flex space-x-6 md:space-x-12 bg-white/50 px-6 py-2 rounded-full backdrop-blur-md border border-black/5 md:border-none">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`text-[10px] md:text-xs font-bold uppercase tracking-widest transition-all ${
                    location.pathname === item.path
                      ? 'text-swiss-red'
                      : 'text-black hover:text-neutral-500'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Contact Button */}
        <div className="col-span-4 md:col-span-3 flex justify-end">
          <button
            onClick={handleContactClick}
            className="bg-black text-white px-5 py-2 text-[10px] md:text-xs font-bold uppercase tracking-widest hover:bg-swiss-red transition-colors shadow-[2px_2px_0px_0px_rgba(255,51,51,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]"
          >
            Contact
          </button>
        </div>
      </div>
    </header>
  );
};
