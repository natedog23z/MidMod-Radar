import React from 'react';
import { Menu } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className="w-full border-b border-[#E9E8E3]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">MidMod Radar</Link>
        <nav className="flex items-center gap-6">
          <Link to="/home" className="text-sm hover:text-gray-600">
            Home
          </Link>
          <Link to="/browse" className="text-sm hover:text-gray-600">
            Explore
          </Link>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>
  );
};