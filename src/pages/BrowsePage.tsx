import React, { useState, useEffect } from 'react';
import { HouseCard } from '../components/HouseCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { getFilteredHouses } from '../lib/houseService';
import { House } from '../lib/types';
import { useFilters } from '../context/FilterContext';
import { ChevronDown } from 'lucide-react';
import { Header } from '../components/Header';

export const BrowsePage: React.FC = () => {
  const { filters } = useFilters();
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortOption, setSortOption] = useState<'recent' | 'price_high' | 'price_low' | 'year_new' | 'year_old'>('recent');

  // Fetch houses when filters change
  useEffect(() => {
    const fetchHouses = async () => {
      setLoading(true);
      try {
        const housesData = await getFilteredHouses(filters);
        setHouses(housesData);
      } catch (error) {
        console.error('Error fetching houses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHouses();
  }, [filters]);

  // Sort houses based on selected option
  const sortedHouses = [...houses].sort((a, b) => {
    switch (sortOption) {
      case 'price_high':
        return (b.estimated_value || 0) - (a.estimated_value || 0);
      case 'price_low':
        return (a.estimated_value || 0) - (b.estimated_value || 0);
      case 'year_new':
        return (b.year_built || 0) - (a.year_built || 0);
      case 'year_old':
        return (a.year_built || 0) - (b.year_built || 0);
      case 'recent':
      default:
        // Assuming createdAt is newest to oldest by default
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-[#F5F5F2]">
      <Header />
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Browse Homes</h1>
        
        <div className="lg:flex gap-8">
          {/* Sidebar Filter */}
          <div className="lg:w-72 mb-6 lg:mb-0">
            <FilterSidebar />
          </div>
          
          {/* Main Content */}
          <div className="flex-1">
            {/* Results Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">{houses.length} homes</p>
              
              <div className="relative">
                <select
                  className="appearance-none bg-white border rounded-lg px-4 py-2 pr-8 cursor-pointer text-sm"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as any)}
                >
                  <option value="recent">Most Recent</option>
                  <option value="price_high">Price (High to Low)</option>
                  <option value="price_low">Price (Low to High)</option>
                  <option value="year_new">Year Built (New to Old)</option>
                  <option value="year_old">Year Built (Old to New)</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none w-5 h-5 text-gray-500" />
              </div>
            </div>
            
            {/* House Grid */}
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <p className="text-lg text-gray-500">Loading homes...</p>
              </div>
            ) : sortedHouses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedHouses.map((house) => (
                  <HouseCard key={house.id} house={house} />
                ))}
              </div>
            ) : (
              <div className="flex justify-center items-center h-64 bg-gray-100 rounded-lg">
                <div className="text-center">
                  <p className="text-lg font-medium mb-2">No homes found</p>
                  <p className="text-gray-500">Try adjusting your filters</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}; 