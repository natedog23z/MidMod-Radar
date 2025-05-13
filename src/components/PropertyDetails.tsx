import React from 'react';
import { Home, Calendar, Ruler, Bed, Bath, ArrowRight, Share2 } from 'lucide-react';
import { useHouse } from '../context/HouseContext';

export const PropertyDetails = () => {
  const { house, loading, error } = useHouse();

  if (loading) {
    return <div className="p-8 bg-[#F5F5F2] min-h-[400px] flex items-center justify-center">
      <p>Loading property details...</p>
    </div>;
  }

  if (error || !house) {
    return <div className="p-8 bg-[#F5F5F2] min-h-[400px] flex items-center justify-center">
      <p>Error loading property details. Please try again later.</p>
    </div>;
  }

  // Format the currency for estimated value
  const formattedValue = house.estimated_value 
    ? `$${house.estimated_value.toLocaleString()}` 
    : 'Not available';

  // Format address for display
  const formattedAddress = house.address_canonical || 
    `${house.street}, ${house.city}, ${house.state} ${house.zip}`;

  return <div className="p-8 bg-[#F5F5F2]">
      {/* Mobile price display */}
      <div className="flex justify-between items-start mb-8 lg:hidden">
        <div>
          <p className="text-sm text-gray-600 mb-1">Estimated value</p>
          <p className="text-3xl font-bold mb-2">{formattedValue}</p>
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
        {[
          {
            icon: Home,
            label: house.architect?.name || 'Unknown',
            value: 'Architect'
          },
          {
            icon: Home,
            label: house.styles && house.styles.length > 0 
              ? house.styles[0].style?.name || 'Modern' 
              : 'Modern',
            value: 'Style'
          },
          {
            icon: Calendar,
            label: house.year_built?.toString() || 'Unknown',
            value: 'Year Built'
          },
          {
            icon: Ruler,
            label: house.sqft?.toLocaleString() || 'Unknown',
            value: 'Square Feet'
          },
          {
            icon: Bed,
            label: house.beds?.toString() || 'Unknown',
            value: 'Bedrooms'
          },
          {
            icon: Bath,
            label: house.baths?.toString() || 'Unknown',
            value: 'Bathrooms'
          }
        ].map((item, i) => <div key={i} className="p-4 border rounded-[4px] bg-white shadow-sm">
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
            {house.description_text || 
              `Beautiful midcentury modern home in ${house.city}, ${house.state}. 
              Built in ${house.year_built || 'N/A'} and featuring ${house.beds || 'multiple'} 
              bedrooms and ${house.baths || 'multiple'} bathrooms.`}
          </p>
        </div>
        {house.architect && (
          <div className="prose max-w-none">
            <h2 className="text-xl font-bold mb-4">About the Architect</h2>
            <p className="text-gray-600 mb-4">
              {house.architect.bio || 
                `${house.architect.name} (${house.architect.birth_year || '?'}-${house.architect.death_year || 'Present'}) 
                was a notable architect known for their midcentury modern designs.`}
            </p>
            <a href="#" className="inline-flex items-center gap-2 text-black hover:text-gray-600 transition-colors font-medium">
              View Architect Profile
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        )}
      </div>
    </div>;
};