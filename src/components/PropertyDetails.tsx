import React from 'react';
import { Home, Calendar, Ruler, Bed, Bath, ArrowRight, Share2 } from 'lucide-react';
export const PropertyDetails = () => {
  return <div className="p-8 bg-[#F5F5F2]">
      {/* Mobile price display */}
      <div className="flex justify-between items-start mb-8 lg:hidden">
        <div>
          <p className="text-sm text-gray-600 mb-1">Estimated value</p>
          <p className="text-3xl font-bold mb-2">$7,711,490</p>
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            Off-market
          </div>
        </div>
        <button className="p-2 hover:bg-gray-100 rounded-full">
          <Share2 className="w-6 h-6" />
        </button>
      </div>
      {/* Feature cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-8">
        {[{
        icon: Home,
        label: 'Richard Neutra',
        value: 'Architect'
      }, {
        icon: Home,
        label: 'International Style',
        value: 'Style'
      }, {
        icon: Calendar,
        label: '1946',
        value: 'Year Built'
      }, {
        icon: Ruler,
        label: '3,162',
        value: 'Square Feet'
      }, {
        icon: Bed,
        label: '5',
        value: 'Bedrooms'
      }, {
        icon: Bath,
        label: '6',
        value: 'Bathrooms'
      }].map((item, i) => <div key={i} className="p-4 border rounded-[4px] bg-white shadow-sm" style={{
        backgroundImage: 'linear-gradient(45deg, #f9f9f7 25%, #ffffff 25%, #ffffff 50%, #f9f9f7 50%, #f9f9f7 75%, #ffffff 75%, #ffffff 100%)',
        backgroundSize: '10px 10px'
      }}>
            <item.icon className="w-5 h-5 mb-2" />
            <p className="font-bold">{item.label}</p>
            <p className="text-sm text-gray-600">{item.value}</p>
          </div>)}
      </div>
      {/* Mobile stats - followers and last sold */}
      <div className="block lg:hidden border-t border-b border-[#E9E8E3] py-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-sm text-gray-600">Current Following</p>
            <p className="font-bold">237 collectors</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Last sold</p>
            <p className="font-bold">2015 ($13.2M)</p>
          </div>
        </div>
      </div>
      <div className="space-y-8">
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold mb-4">About This Home</h2>
          <p className="text-gray-600">
            The Kaufmann Desert House, designed by architect Richard Neutra in
            1946, is one of the most important examples of International Style
            architecture in the United States and the most iconic home in Palm
            Springs. This architectural masterpiece was commissioned by Edgar J.
            Kaufmann Sr., a Pittsburgh department store tycoon, and has been
            meticulously preserved and restored to its original vision.
          </p>
        </div>
        <div className="prose max-w-none">
          <h2 className="text-xl font-bold mb-4">About the Architect</h2>
          <p className="text-gray-600 mb-4">
            Richard Neutra (1892-1970) was one of the most influential modernist
            architects of the 20th century. Born in Vienna, he emigrated to the
            United States in 1923 and went on to create the California modernist
            style that defined mid-century residential architecture. His work
            emphasized the integration of interior and exterior spaces,
            extensive use of glass, and sensitivity to the natural environment.
            The Kaufmann Desert House is considered one of his masterpieces,
            exemplifying his philosophy of "biorealism" – architecture that
            connects humans with nature.
          </p>
          <a href="#" className="inline-flex items-center gap-2 text-black hover:text-gray-600 transition-colors font-medium">
            View Architect Profile
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>;
};