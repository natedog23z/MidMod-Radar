import React from 'react';
import { Heart, ArrowRight } from 'lucide-react';
export const SimilarListings = () => {
  const listings = [{
    title: '1901 Carla Ridge',
    location: 'Beverly Hills, CA',
    price: '$9,800,000',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80',
    year: '1963'
  }, {
    title: '2342 Silver Lake Blvd',
    location: 'Los Angeles, CA',
    price: '$4,250,000',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80',
    year: '1948'
  }, {
    title: '897 Panorama Drive',
    location: 'Palm Springs, CA',
    price: '$3,495,000',
    image: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80',
    year: '1964'
  }];
  return <div className="bg-[#E9E8E3] p-8 rounded-[4px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Similar Collectible Homes</h2>
        <button className="text-sm hover:underline">View all</button>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {listings.map((listing, i) => <div key={i} className={`group relative bg-white rounded-[4px] shadow-sm p-4 ${i === 2 ? 'hidden lg:block' : ''}`}>
            <div className="aspect-[4/3] bg-gray-100 rounded-[4px] overflow-hidden">
              <img src={listing.image} alt={listing.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            </div>
            <button className="absolute top-4 right-4 p-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
              <Heart className="w-5 h-5" />
            </button>
            <div className="mt-4">
              <h3 className="font-bold">{listing.title}</h3>
              <p className="text-gray-600 text-sm">{listing.location}</p>
              <div className="flex justify-between items-center mt-2">
                <p className="font-bold">{listing.price}</p>
                <p className="text-sm text-gray-600">{listing.year}</p>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};