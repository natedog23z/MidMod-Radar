import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Home } from './pages/Home';
import { HouseProvider } from './context/HouseContext';
import { PropertyDetailPage } from './pages/PropertyDetailPage';
import { BrowsePage } from './pages/BrowsePage';
import { FilterProvider } from './context/FilterContext';
import { LandingPage } from './pages/LandingPage';
import { AdminPage } from './pages/AdminPage';

export function App() {
  return (
    <HouseProvider>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/home" element={<Home />} />
        <Route 
          path="/browse" 
          element={
            <FilterProvider>
              <BrowsePage />
            </FilterProvider>
          } 
        />
        <Route path="/property/:slug" element={<PropertyDetailPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </HouseProvider>
  );
}