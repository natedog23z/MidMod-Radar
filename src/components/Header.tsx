import React from 'react';
import { Menu } from 'lucide-react';
export const Header = () => {
  return <header className="w-full border-b border-[#E9E8E3]">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">MidMod Radar</h1>
        <nav className="flex items-center gap-6">
          <a href="#" className="text-sm hover:text-gray-600">
            Explore
          </a>
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        </nav>
      </div>
    </header>;
};