import React, { useState } from 'react';
import { Image, X, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { useHouse } from '../context/HouseContext';
import { Link } from 'react-router-dom';

export const PropertyHero = () => {
  const { house, loading, error } = useHouse();
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  if (loading) {
    return <div className="relative h-[100vh] w-full bg-gray-200 flex items-center justify-center">
      <p>Loading property images...</p>
    </div>;
  }

  if (error || !house) {
    return <div className="relative h-[100vh] w-full bg-gray-200 flex items-center justify-center">
      <p>Error loading property. Please try again later.</p>
    </div>;
  }

  // Get featured photo URL
  const featuredPhotoUrl = house.featured_photo_url || '';
  
  // Get house photos, filtering out the featured photo to avoid duplication
  const allPhotos = house.photos && house.photos.length > 0 ? house.photos : [];
  const photos = featuredPhotoUrl 
    ? allPhotos.filter(photo => photo.photo_url !== featuredPhotoUrl)
    : allPhotos;

  // Use featured photo as main image if available, otherwise use the first photo
  const mainPhotoUrl = featuredPhotoUrl || 
    (photos.length > 0 ? photos[0].photo_url : 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80');

  // Format location for display - only city and zip
  const locationText = `${house.city}, ${house.state} ${house.zip}`;
  
  // Check if we need to show the "See all photos" button - include featured photo in count
  const totalPhotoCount = featuredPhotoUrl ? photos.length + 1 : photos.length;
  const hasMorePhotos = totalPhotoCount > 3;

  // Create a combined array for the gallery view that includes the featured photo first
  const galleryPhotos = featuredPhotoUrl 
    ? [{ id: 'featured', house_id: house.id, photo_url: featuredPhotoUrl, is_featured: true }, ...photos]
    : photos;

  // Handle the "See all photos" button click
  const handleSeeAllPhotos = () => {
    setShowAllPhotos(true);
    // Start the gallery with the first photo
    setCurrentPhotoIndex(0);
  };

  // Close the photo gallery
  const handleCloseGallery = () => {
    setShowAllPhotos(false);
  };

  // Navigate to the next photo
  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === galleryPhotos.length - 1 ? 0 : prev + 1
    );
  };

  // Navigate to the previous photo
  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => 
      prev === 0 ? galleryPhotos.length - 1 : prev - 1
    );
  };

  // Generate photo URL for the current index
  const getCurrentPhotoUrl = () => {
    if (galleryPhotos.length === 0) {
      return 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80';
    }
    return galleryPhotos[currentPhotoIndex].photo_url;
  };

  // If showing all photos in gallery mode, render the gallery
  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Gallery header */}
        <div className="flex justify-between items-center p-4 bg-black text-white">
          <div>
            <h2 className="text-xl font-reckless">{house.street}</h2>
            <p className="text-sm text-gray-300">{totalPhotoCount} photos</p>
          </div>
          <button onClick={handleCloseGallery} className="p-2 hover:bg-gray-800 rounded-full">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Main gallery view */}
        <div className="flex-grow flex flex-col items-center justify-center relative">
          {/* Main photo */}
          <div className="h-full w-full flex items-center justify-center">
            <img 
              src={getCurrentPhotoUrl()} 
              alt={`Property photo ${currentPhotoIndex + 1}`} 
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          {/* Navigation buttons */}
          <button 
            onClick={handlePrevPhoto} 
            className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
          <button 
            onClick={handleNextPhoto} 
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 rounded-full"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        </div>

        {/* Thumbnail strip */}
        <div className="h-24 bg-black p-2 overflow-x-auto">
          <div className="flex gap-2">
            {galleryPhotos.map((photo, index) => (
              <div 
                key={photo.id || index} 
                onClick={() => setCurrentPhotoIndex(index)}
                className={`h-20 w-32 shrink-0 cursor-pointer rounded overflow-hidden ${
                  index === currentPhotoIndex ? 'ring-2 ring-white' : ''
                }`}
              >
                <img 
                  src={photo.photo_url} 
                  alt={`Thumbnail ${index + 1}`} 
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-[100vh] w-full">
      {/* Back button */}
      <Link 
        to="/browse" 
        className="absolute top-6 left-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white/100 transition-colors text-black px-4 py-2.5 rounded-full shadow-sm"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back to Browse</span>
      </Link>
      
      {/* See all photos button - only show if there are more than 3 photos */}
      {hasMorePhotos && (
        <button 
          onClick={handleSeeAllPhotos}
          className="absolute top-6 right-6 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-sm hover:bg-white/100 transition-colors text-black px-4 py-2.5 rounded-full"
        >
          <Image className="w-5 h-5" />
          <span className="font-medium">See all photos</span>
          <span className="text-gray-600 ml-1">({totalPhotoCount || 0})</span>
        </button>
      )}
      
      {/* Mobile: Single photo */}
      <div className="block lg:hidden h-full">
        <div className="h-full relative rounded-lg overflow-hidden">
          <img src={mainPhotoUrl} alt={`${house.street}`} className="w-full h-full object-cover" />
        </div>
      </div>
      
      {/* Desktop: Grid layout - now limited to 3 photos with 2/3 - 1/3 split */}
      <div className="hidden lg:grid grid-cols-3 h-full gap-2 p-2">
        {/* Main featured photo - takes up 2/3 of the width */}
        <div className="col-span-2 relative rounded-lg overflow-hidden">
          <img 
            src={mainPhotoUrl} 
            alt={`${house.street}`} 
            className="w-full h-full object-cover cursor-pointer"
            onClick={handleSeeAllPhotos}
          />
        </div>
        
        {/* Two smaller photos stacked on right side - takes up 1/3 of the width */}
        <div className="grid grid-rows-2 gap-2">
          {/* First small photo */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={photos.length > 0 ? photos[0].photo_url : 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80'} 
              alt={`Property view 2`} 
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleSeeAllPhotos}
            />
          </div>
          
          {/* Second small photo */}
          <div className="relative rounded-lg overflow-hidden">
            <img 
              src={photos.length > 1 ? photos[1].photo_url : 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?auto=format&fit=crop&q=80'} 
              alt={`Property view 3`} 
              className="w-full h-full object-cover cursor-pointer"
              onClick={handleSeeAllPhotos}
            />
          </div>
        </div>
      </div>
      
      {/* Title overlay at bottom */}
      <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/50 to-transparent p-8">
        <div>
          <h1 className="text-4xl font-reckless text-white mb-2">
            {house.street}
          </h1>
          <p className="text-white/90">{locationText}</p>
        </div>
      </div>
    </div>
  );
};