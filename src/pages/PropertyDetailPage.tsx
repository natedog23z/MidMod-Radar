import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useHouse } from '../context/HouseContext';
import { Header } from '../components/Header';
import { PropertyHero } from '../components/PropertyHero';
import { PropertyDetails } from '../components/PropertyDetails';
import { SimilarListings } from '../components/SimilarListings';
import { RightPanel } from '../components/RightPanel';
import { MobileFooterCTA } from '../components/MobileFooterCTA';

export const PropertyDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const { house, loading, error, fetchHouseBySlug } = useHouse();

  useEffect(() => {
    if (slug) {
      fetchHouseBySlug(slug);
    }
    // Cleanup function can be added here if necessary for when the component unmounts or slug changes
    return () => {
      // e.g., clear specific states if not handled by fetchHouseBySlug already
    };
  }, [slug, fetchHouseBySlug]);

  // Separate useEffect for logging to ensure it runs only when 'house' object is updated and available
  useEffect(() => {
    if (house) {
      console.log('PropertyDetailPage - Loaded house data:', house);
    }
  }, [house]);

  if (!slug) {
    return <div>Error: Property slug not found in URL.</div>;
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading property details...</div>;
  }

  if (error) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error loading property: {error.message}</div>;
  }

  if (!house) {
    // This handles the case where slug is valid, but no house found (fetchHouseBySlug set house to null)
    return <div className="flex justify-center items-center h-screen">Property not found.</div>;
  }

  // If we have a house, render the full layout
  return (
    <div className="min-h-screen bg-[#F5F5F2]"> {/* Assuming same background as Home */}
      <Header />
      <PropertyHero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8"> {/* Added a container for better content alignment */} 
        <div className="flex flex-col lg:flex-row lg:gap-8 py-8"> {/* Added gap and padding */} 
          <div className="w-full lg:w-2/3">
            <PropertyDetails />
            <SimilarListings />
          </div>
          <div className="w-full lg:w-1/3 lg:sticky lg:top-8 h-auto lg:h-[calc(100vh-4rem)] lg:overflow-y-auto border-t lg:border-t-0 lg:border-l border-[#E9E8E3] bg-[#F5F5F2] p-4 lg:p-0 mt-8 lg:mt-0">
            {/* Adjusted sticky positioning, padding, and borders for better responsive behavior */}
            <RightPanel />
          </div>
        </div>
      </div>
      <div className="lg:hidden">
        <MobileFooterCTA />
      </div>
    </div>
  );
}; 