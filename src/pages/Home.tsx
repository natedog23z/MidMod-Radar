import React from 'react';
import { Header } from '../components/Header';
import { PropertyHero } from '../components/PropertyHero';
import { PropertyDetails } from '../components/PropertyDetails';
import { SimilarListings } from '../components/SimilarListings';
import { RightPanel } from '../components/RightPanel';
import { MobileFooterCTA } from '../components/MobileFooterCTA';
export const Home = () => {
  return <div className="min-h-screen bg-[#F5F5F2]">
      <Header />
      <PropertyHero />
      <div className="flex flex-col lg:flex-row">
        <div className="w-full lg:w-2/3">
          <PropertyDetails />
          <SimilarListings />
        </div>
        <div className="hidden lg:block w-1/3 sticky top-0 h-screen border-l border-[#E9E8E3] bg-[#F5F5F2]">
          <RightPanel />
        </div>
      </div>
      <div className="lg:hidden">
        <MobileFooterCTA />
      </div>
    </div>;
};