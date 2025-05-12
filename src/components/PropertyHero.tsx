import React from 'react';
import { Image } from 'lucide-react';
export const PropertyHero = () => {
  return <div className="relative h-[100vh] w-full">
      {/* See all photos button - now at top */}
      <button className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white/100 transition-colors text-black px-4 py-2.5 rounded-full">
        <Image className="w-5 h-5" />
        <span className="font-medium">See all photos</span>
        <span className="text-gray-600 ml-1">(24)</span>
      </button>
      {/* Mobile: Single photo */}
      <div className="block lg:hidden h-full">
        <div className="h-full relative rounded-lg overflow-hidden">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80" alt="Main property view" className="w-full h-full object-cover" />
        </div>
      </div>
      {/* Desktop: Grid layout */}
      <div className="hidden lg:grid grid-cols-3 grid-rows-2 h-full gap-2 p-2">
        <div className="col-span-2 row-span-2 relative rounded-lg overflow-hidden">
          <img src="https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80" alt="Main property view" className="w-full h-full object-cover" />
        </div>
        {[1, 2, 3, 4].map(i => i <= 2 && <div key={i} className="relative rounded-lg overflow-hidden">
                <img src={`https://images.unsplash.com/photo-152321758256${i}-09d0def993a6?auto=format&fit=crop&q=80`} alt={`Property view ${i}`} className="w-full h-full object-cover" />
              </div>)}
      </div>
      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-8">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">
            The Kaufmann Desert House
          </h1>
          <p className="text-white/90">Palm Springs, CA 92262</p>
        </div>
      </div>
    </div>;
};