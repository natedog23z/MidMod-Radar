import React, { useState } from 'react';
import { Heart, Lock, Bell, Share2 } from 'lucide-react';
import { useHouse } from '../context/HouseContext';

export const RightPanel = () => {
  const [isFavorited, setIsFavorited] = useState(false);
  const { house, loading, error } = useHouse();
  
  if (loading) {
    return <div className="p-6 space-y-8">
      <p>Loading property data...</p>
    </div>;
  }
  
  if (error || !house) {
    return <div className="p-6 space-y-8">
      <p>Error loading property data. Please try again later.</p>
    </div>;
  }
  
  // Format the currency
  const formattedValue = house.estimated_value 
    ? `$${house.estimated_value.toLocaleString()}` 
    : 'Not available';
  
  return <div className="p-6 space-y-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm text-gray-600 mb-1">Estimated value</p>
            <div className="bg-white/80 backdrop-blur px-4 py-2 rounded-full inline-flex items-center mb-2">
              <p className="text-3xl font-bold">{formattedValue}</p>
            </div>
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-[#E9E8E3] text-gray-800">
              Off-market
            </div>
          </div>
          <button className="p-2 hover:bg-[#E9E8E3] rounded-full transition-colors" aria-label="Share property">
            <Share2 className="w-6 h-6" />
          </button>
        </div>
        {/* Primary CTA */}
        <div className="space-y-4">
          <div className="relative">
            <button className="w-full bg-black text-white px-6 py-4 rounded-full flex items-center justify-center gap-3 hover:bg-gray-800 transition-colors group relative text-lg border border-[#D5B887] animate-pulse" style={{
            boxShadow: '0 0 10px rgba(213,184,135,0.3)'
          }}>
              <Lock className="w-6 h-6" />
              <span>Claim the 1-of-1 Lock</span>
              <div className="absolute -top-3 -right-2 bg-[#D5B887] text-black text-xs px-3 py-1 rounded-full font-medium">
                Only 1 exists
              </div>
            </button>
          </div>
          {/* Desktop inline explanation */}
          <div className="space-y-3">
            <p className="text-[14px] font-medium text-[#101010]">Why Lock?</p>
            <div className="space-y-2 pl-4">
              <p className="text-sm text-[#4C4C4C] flex items-center gap-2 before:content-['•'] before:text-[#FF6B4A]">
                Instant SMS the moment the home lists
              </p>
              <p className="text-sm text-[#4C4C4C] flex items-center gap-2 before:content-['•'] before:text-[#FF6B4A]">
                Everyone else waits 48 h
              </p>
              <p className="text-sm text-[#4C4C4C] flex items-center gap-2 before:content-['•'] before:text-[#FF6B4A]">
                Only 1 lock per house
              </p>
            </div>
          </div>
        </div>
        {/* Secondary CTAs */}
        <div className="flex gap-3">
          <button className="flex-1 border border-[#E9E8E3] bg-white hover:bg-gray-50 px-6 py-4 rounded-full flex items-center justify-center gap-3 transition-colors" aria-label="Follow property">
            <Bell className="w-6 h-6" />
            <span className="text-lg">Follow</span>
          </button>
          <button className={`flex-1 border border-[#E9E8E3] bg-white hover:bg-gray-50 px-6 py-4 rounded-full flex items-center justify-center gap-3 transition-colors ${isFavorited ? 'text-[#FF6B4A]' : ''}`} onClick={() => setIsFavorited(!isFavorited)} aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}>
            <Heart className={`w-6 h-6 ${isFavorited ? 'fill-current' : ''}`} />
            <span className="text-lg">Favorite</span>
          </button>
        </div>
        <div className="space-y-3">
          <p className="text-gray-600 flex items-start gap-3">
            <Bell className="w-5 h-5 mt-1 flex-shrink-0" />
            <span>
              Following gets you notified within 48 hours of the house hitting
              the market
            </span>
          </p>
          <p className="text-gray-600 flex items-start gap-3">
            <Heart className="w-5 h-5 mt-1 flex-shrink-0" />
            <span>Add to your unlimited favorites collection</span>
          </p>
        </div>
      </div>
      <div className="border-t border-[#E9E8E3] pt-6">
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-600">Current Following</p>
            <p className="font-bold">237 collectors</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last sold</p>
            <p className="font-bold">
              {house.year_built ? `${house.year_built} (${formattedValue})` : 'Not available'}
            </p>
          </div>
        </div>
      </div>
    </div>;
};