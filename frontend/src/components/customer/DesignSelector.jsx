import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import API_URL from '../../config';

export const DesignSelector = ({ onSelectDesign, selectedDesign }) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, []);

  const fetchDesigns = async () => {
    try {
      const { data } = await api.get('/designs');
      // Process designs to ensure proper image URLs
      const processedDesigns = data.map(d => ({
        ...d,
        image: getImageUrl(d.image)
      }));
      setDesigns(processedDesigns);
    } catch (err) {
      console.error('Failed to fetch designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (img) => {
    if (!img) return '/sanu/hand5.jpeg';
    if (img.startsWith('/uploads/')) return `${API_URL}${img}`;
    if (img.startsWith('http')) return img;
    return img;
  };

  if (loading) return <div className="text-center py-8">Loading designs...</div>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Select a Design</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <div
            key={design._id}
            onClick={() => onSelectDesign(design)}
            className={`cursor-pointer p-4 border-2 rounded-lg transition ${
              selectedDesign?._id === design._id
                ? 'border-pink-500 bg-pink-50'
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            {design.image && (
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-40 object-cover rounded mb-3"
              />
            )}
            <h3 className="font-semibold text-gray-800">{design.title}</h3>
            <p className="text-sm text-gray-600 mb-2">{design.category}</p>
          </div>
        ))}
      </div>
      {designs.length === 0 && (
        <div className="text-center py-8 text-gray-500">No designs available</div>
      )}
    </div>
  );
};
