import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

type House = {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  beds: number | null;
  baths: number | null;
  sqft: number | null;
  lot_acres: number | null;
  year_built: number | null;
  estimated_value: number | null;
  description_text: string | null;
  featured_photo_url: string | null;
};

type Photo = {
  id: string;
  house_id: string;
  photo_url: string;
  is_featured: boolean;
};

type HouseEditorProps = {
  houseId: string;
};

export function HouseEditor({ houseId }: HouseEditorProps) {
  // State for house data
  const [house, setHouse] = useState<House | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // State for photo upload
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Fetch house data and photos
  useEffect(() => {
    async function fetchHouseData() {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch house details
        const { data: houseData, error: houseError } = await supabase
          .from('houses')
          .select('*')
          .eq('id', houseId)
          .single();
        
        if (houseError) throw houseError;
        setHouse(houseData);
        
        // Fetch house photos
        const { data: photoData, error: photoError } = await supabase
          .from('house_photos')
          .select('*')
          .eq('house_id', houseId);
        
        if (photoError) throw photoError;
        setPhotos(photoData || []);
      } catch (err) {
        console.error('Error fetching house data:', err);
        setError('Failed to load house data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    
    if (houseId) {
      fetchHouseData();
    }
  }, [houseId]);
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (house) {
      setHouse({
        ...house,
        [name]: value === '' ? null : value,
      });
    }
  };
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!house) return;
    
    setSaving(true);
    setError(null);
    setSuccessMessage(null);
    
    try {
      const { error } = await supabase
        .from('houses')
        .update({
          description_text: house.description_text,
          estimated_value: house.estimated_value,
          beds: house.beds,
          baths: house.baths,
          sqft: house.sqft,
          lot_acres: house.lot_acres,
          updated_at: new Date(),
        })
        .eq('id', house.id);
      
      if (error) throw error;
      setSuccessMessage('House details updated successfully.');
    } catch (err) {
      console.error('Error updating house:', err);
      setError('Failed to update house details. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  // Handle file selection for upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFileUpload(e.target.files[0]);
    }
  };
  
  // Upload photo to Supabase storage
  const handlePhotoUpload = async () => {
    if (!fileUpload || !house) return;
    
    setUploading(true);
    setError(null);
    
    try {
      // Generate a unique file name
      const fileExt = fileUpload.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${house.id}/${fileName}`;
      
      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('house-photos')
        .upload(filePath, fileUpload);
      
      if (uploadError) throw uploadError;
      
      // Get public URL for the uploaded file
      const { data: publicURL } = supabase.storage
        .from('house-photos')
        .getPublicUrl(filePath);
      
      if (!publicURL) throw new Error('Failed to get public URL for uploaded file');
      
      // Add photo to house_photos table
      const { error: insertError } = await supabase
        .from('house_photos')
        .insert({
          house_id: house.id,
          photo_url: publicURL.publicUrl,
          storage_key: filePath,
          is_featured: photos.length === 0 // Make it featured if it's the first photo
        });
      
      if (insertError) throw insertError;
      
      // Update featured photo URL if it's the first photo
      if (photos.length === 0) {
        const { error: updateError } = await supabase
          .from('houses')
          .update({ featured_photo_url: publicURL.publicUrl })
          .eq('id', house.id);
        
        if (updateError) throw updateError;
      }
      
      // Refresh photos
      const { data: newPhotos, error: fetchError } = await supabase
        .from('house_photos')
        .select('*')
        .eq('house_id', house.id);
      
      if (fetchError) throw fetchError;
      setPhotos(newPhotos || []);
      
      setFileUpload(null);
      setSuccessMessage('Photo uploaded successfully.');
    } catch (err) {
      console.error('Error uploading photo:', err);
      setError('Failed to upload photo. Please try again.');
    } finally {
      setUploading(false);
    }
  };
  
  // Set a photo as featured
  const handleSetFeatured = async (photoId: string, photoUrl: string) => {
    if (!house) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Update the is_featured status in house_photos
      const { error: photoError } = await supabase
        .from('house_photos')
        .update({ is_featured: true })
        .eq('id', photoId);
      
      if (photoError) throw photoError;
      
      // Reset other photos to not featured
      const { error: resetError } = await supabase
        .from('house_photos')
        .update({ is_featured: false })
        .eq('house_id', house.id)
        .neq('id', photoId);
      
      if (resetError) throw resetError;
      
      // Update the featured_photo_url in houses table
      const { error: houseError } = await supabase
        .from('houses')
        .update({ featured_photo_url: photoUrl })
        .eq('id', house.id);
      
      if (houseError) throw houseError;
      
      // Refresh photos
      const { data: newPhotos, error: fetchError } = await supabase
        .from('house_photos')
        .select('*')
        .eq('house_id', house.id);
      
      if (fetchError) throw fetchError;
      setPhotos(newPhotos || []);
      
      setSuccessMessage('Featured photo updated successfully.');
    } catch (err) {
      console.error('Error setting featured photo:', err);
      setError('Failed to set featured photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a photo
  const handleDeletePhoto = async (photoId: string, storageKey: string | null) => {
    if (!house) return;
    
    if (!confirm('Are you sure you want to delete this photo? This cannot be undone.')) {
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      // Delete from house_photos table
      const { error: deleteError } = await supabase
        .from('house_photos')
        .delete()
        .eq('id', photoId);
      
      if (deleteError) throw deleteError;
      
      // Delete from storage if we have the storage key
      if (storageKey) {
        const { error: storageError } = await supabase.storage
          .from('house-photos')
          .remove([storageKey]);
        
        if (storageError) {
          console.error('Error deleting from storage:', storageError);
          // Continue anyway as the database record is already deleted
        }
      }
      
      // Refresh photos
      const { data: newPhotos, error: fetchError } = await supabase
        .from('house_photos')
        .select('*')
        .eq('house_id', house.id);
      
      if (fetchError) throw fetchError;
      setPhotos(newPhotos || []);
      
      setSuccessMessage('Photo deleted successfully.');
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return <div className="text-center py-8">Loading house data...</div>;
  }
  
  if (!house) {
    return <div className="text-center py-8 text-red-500">House not found.</div>;
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit House: {house.street}</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">House Details</h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Street</label>
              <input
                type="text"
                name="street"
                value={house.street || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">City, State</label>
              <input
                type="text"
                value={`${house.city}, ${house.state} ${house.zip}`}
                className="w-full px-3 py-2 border rounded-md bg-gray-50"
                disabled
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Beds</label>
              <input
                type="number"
                name="beds"
                value={house.beds || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Baths</label>
              <input
                type="number"
                name="baths"
                value={house.baths || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                step="0.5"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Square Feet</label>
              <input
                type="number"
                name="sqft"
                value={house.sqft || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Lot Size (acres)</label>
              <input
                type="number"
                name="lot_acres"
                value={house.lot_acres || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
                step="0.01"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Year Built</label>
              <input
                type="number"
                name="year_built"
                value={house.year_built || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            
            <div className="form-group">
              <label className="block text-gray-700 mb-1">Estimated Value ($)</label>
              <input
                type="number"
                name="estimated_value"
                value={house.estimated_value || ''}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>
          
          <div className="form-group">
            <label className="block text-gray-700 mb-1">Description</label>
            <textarea
              name="description_text"
              value={house.description_text || ''}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
              rows={6}
            />
          </div>
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
      
      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Photos</h3>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h4 className="font-medium mb-2">Upload New Photo</h4>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="flex-1"
              disabled={uploading}
            />
            <button
              onClick={handlePhotoUpload}
              disabled={!fileUpload || uploading}
              className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload Photo'}
            </button>
          </div>
        </div>
        
        {photos.length === 0 ? (
          <p className="text-gray-500">No photos available for this house.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="border rounded-lg overflow-hidden">
                <div className="relative aspect-video">
                  <img 
                    src={photo.photo_url} 
                    alt="House" 
                    className="w-full h-full object-cover"
                  />
                  {photo.is_featured && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-2 flex justify-between">
                  <button
                    onClick={() => handleSetFeatured(photo.id, photo.photo_url)}
                    disabled={photo.is_featured}
                    className={`text-sm px-2 py-1 rounded ${
                      photo.is_featured 
                        ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                        : 'bg-yellow-500 text-white hover:bg-yellow-600'
                    }`}
                  >
                    {photo.is_featured ? 'Featured' : 'Set as Featured'}
                  </button>
                  <button
                    onClick={() => handleDeletePhoto(photo.id, null)}
                    className="text-sm px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 