import React, { useState } from 'react';
import { Lock, Bell, Heart, Info } from 'lucide-react';
import { WhyLockSheet } from './WhyLockSheet';
export const MobileFooterCTA = () => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  return <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E9E8E3] p-4 space-y-3">
        <div className="space-y-2">
          <div className="relative">
            <button className="w-full bg-black text-white px-6 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors text-lg border border-[#D5B887] animate-pulse" style={{
            boxShadow: '0 0 10px rgba(213,184,135,0.3)'
          }}>
              <Lock className="w-6 h-6" />
              <span>Claim the 1-of-1 Lock</span>
              <div className="absolute -top-3 -right-2 bg-[#D5B887] text-black text-xs px-3 py-1 rounded-full font-medium">
                Only 1 exists
              </div>
            </button>
          </div>
          <button onClick={() => setIsSheetOpen(true)} className="text-[14px] text-[#FF6B4A] hover:underline flex items-center gap-1 mx-auto">
            <Info className="w-4 h-4" />
            Why Lock?
          </button>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 border border-[#E9E8E3] bg-white hover:bg-gray-50 px-4 py-3 rounded-full flex items-center justify-center gap-2 transition-colors" aria-label="Follow property">
            <Bell className="w-5 h-5 text-[#101010]" />
            <span className="text-[#101010]">Follow</span>
          </button>
          <button className="flex-1 border border-[#E9E8E3] bg-white hover:bg-gray-50 px-4 py-3 rounded-full flex items-center justify-center gap-2 transition-colors" aria-label="Add to favorites">
            <Heart className="w-5 h-5 text-[#101010]" strokeWidth={1.5} />
            <span className="text-[#101010]">Favorite</span>
          </button>
        </div>
      </div>
      <WhyLockSheet isOpen={isSheetOpen} onClose={() => setIsSheetOpen(false)} />
    </>;
};