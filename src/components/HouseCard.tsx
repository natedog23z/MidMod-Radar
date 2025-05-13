import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { House } from '../lib/types';

interface HouseCardProps {
  house: House;
}

export const HouseCard: React.FC<HouseCardProps> = ({ house }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  
  // Format valuation to display as currency
  const formatValuation = (value: number | null): string => {
    if (!value) return 'N/A';
    
    // Format to million if value is >= 1 million
    if (value >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } 
    // Format to K if value is >= 1 thousand
    else if (value >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    } 
    // Otherwise just format as regular currency
    else {
      return new Intl.NumberFormat('en-US', { 
        style: 'currency', 
        currency: 'USD',
        maximumFractionDigits: 0 
      }).format(value);
    }
  };
  
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation
    setIsFavorited(!isFavorited);
    // Additional logic to save favorite status could go here
  };

  return (
    <Link to={`/property/${house.slug || house.id}`} className="group block">
      <div className="relative bg-white rounded-lg overflow-hidden">
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={house.featured_photo_url || "https://placehold.co/600x400?text=No+Image"}
            alt={`${house.street}, ${house.city} - exterior`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <button 
          className={`absolute top-4 right-4 p-2 bg-white rounded-full ${isFavorited ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} transition-opacity shadow-sm`}
          onClick={handleFavoriteClick}
        >
          <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
        </button>
        <div className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-bold mb-1">{house.street}</h3>
              <p className="text-gray-600 text-sm">{house.city}, {house.state}</p>
            </div>
            <p className="font-bold whitespace-nowrap">
              {formatValuation(house.estimated_value)}
            </p>
          </div>
          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <p className="text-sm text-gray-600">
              {house.architect?.name || 'Unknown Architect'}
            </p>
            <p className="text-sm text-gray-600">
              {house.year_built || 'Year Unknown'}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}; 