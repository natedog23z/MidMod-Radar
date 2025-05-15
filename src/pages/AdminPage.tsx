import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { HouseEditor } from '../components/admin/HouseEditor';

type House = {
  id: string;
  street: string;
  city: string;
  state: string;
  year_built: number | null;
  architect_id: string | null;
  description_text: string | null;
  estimated_value: number | null;
  featured_photo_url: string | null;
  slug: string | null;
};

export function AdminPage() {
  const [houses, setHouses] = useState<House[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHouseId, setSelectedHouseId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchHouses() {
      try {
        const { data, error } = await supabase
          .from('houses')
          .select('id, street, city, state, year_built, architect_id, description_text, estimated_value, featured_photo_url, slug')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setHouses(data || []);
      } catch (err) {
        console.error('Error fetching houses:', err);
        setError('Failed to load houses. Please try again.');
      } finally {
        setLoading(false);
      }
    }

    fetchHouses();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Portal</h1>
        <Link to="/" className="text-blue-500 hover:underline">
          Back to Home
        </Link>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="grid md:grid-cols-[300px_1fr] gap-6">
        {/* House List Sidebar */}
        <div className="bg-gray-50 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Houses</h2>
          
          {loading ? (
            <p>Loading houses...</p>
          ) : houses.length === 0 ? (
            <p>No houses found.</p>
          ) : (
            <div className="max-h-[70vh] overflow-y-auto">
              {houses.map((house) => (
                <div 
                  key={house.id}
                  className={`p-3 mb-2 rounded cursor-pointer hover:bg-gray-200 ${
                    selectedHouseId === house.id ? 'bg-blue-100' : ''
                  }`}
                  onClick={() => setSelectedHouseId(house.id)}
                >
                  <p className="font-medium">{house.street}</p>
                  <p className="text-sm text-gray-600">
                    {house.city}, {house.state}
                    {house.year_built && ` (${house.year_built})`}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* House Editor */}
        <div className="bg-white p-6 rounded-lg shadow">
          {selectedHouseId ? (
            <HouseEditor houseId={selectedHouseId} />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">Select a house from the list to edit details.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 