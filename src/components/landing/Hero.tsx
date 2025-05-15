import React from 'react'
import { MapPin, Check, Bell, Menu } from 'lucide-react'
import { Link } from 'react-router-dom'

export const Hero = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Header Navigation */}
      <div className="absolute top-0 left-0 right-0 z-10">
        <header className="w-full">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold text-white">MidMod Radar</Link>
            <nav className="flex items-center gap-6">
              <Link to="/browse" className="text-sm text-white hover:text-white/80">
                Explore
              </Link>
              <Link to="/admin" className="text-sm text-white hover:text-white/80 bg-gray-700/50 px-3 py-1 rounded">
                Admin
              </Link>
              <button className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                <Menu className="w-5 h-5 text-white" />
              </button>
            </nav>
          </div>
        </header>
      </div>
    
      {/* Hero Image */}
      <div className="absolute inset-0 transition-opacity duration-1000 opacity-90">
        <img
          src="https://uploadthingy.s3.us-west-1.amazonaws.com/mthUBC9DTdJ5RWNyNnEifG/Screenshot_2025-05-13_at_11.08.48_AM.png"
          alt="Mid-century modern interior with dramatic wooden beams and floor-to-ceiling windows"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/40" />
      </div>
      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-5xl md:text-6xl font-reckless text-white leading-tight">
              Real-time radar
              <br />
              for mid century homes
            </h1>
            {/* Trust indicators */}
            <div className="flex items-center gap-6 border-l-4 border-[#D5B887] pl-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <MapPin className="w-4 h-4 text-[#D5B887]" />
                <span className="text-white/90 text-xs uppercase tracking-wider font-medium">
                  10,000+ homes indexed
                </span>
              </div>
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Check className="w-4 h-4 text-[#D5B887]" />
                <span className="text-white/90 text-xs uppercase tracking-wider font-medium">
                  Architect verified
                </span>
              </div>
            </div>
            <p className="text-xl text-white/90">
              Track architect-verified listings before they disappear.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/browse" className="bg-[#FF6B4A] hover:bg-[#FF8B6A] text-white px-8 py-4 rounded-full font-medium transition-colors inline-flex items-center justify-center">
                Explore Homes
              </Link>
              <button className="border-2 border-white/80 text-white px-8 py-4 rounded-full font-medium hover:bg-white/10 transition-colors inline-flex items-center justify-center gap-2">
                <Bell className="w-5 h-5" />
                Set an Alert
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 