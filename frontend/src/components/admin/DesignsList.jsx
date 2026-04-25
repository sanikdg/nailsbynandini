import React, { useEffect, useState } from 'react';
import { Trash2, Edit2, Eye } from 'lucide-react';
import api from '../../services/api';
import API_URL from '../../config';

export const DesignsList = ({ refresh }) => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesigns();
  }, [refresh]);

  const fetchDesigns = async () => {
    try {
      const { data } = await api.get('/designs');
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

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this design?')) return;
    try {
      await api.delete(`/designs/${id}`);
      setDesigns(designs.filter((d) => d._id !== id));
    } catch (err) {
      console.error('Failed to delete design:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (designs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <p className="text-gray-500 text-lg">No designs yet. Create your first design!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Your Designs ({designs.length})</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {designs.map((design) => (
          <div
            key={design._id}
            className="bg-white rounded-lg overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition group"
          >
            {/* Image Container */}
            <div className="relative h-48 bg-slate-200 overflow-hidden">
              <img
                src={design.image}
                alt={design.title}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition flex items-center justify-center gap-3">
                <button className="bg-white text-slate-800 p-2 rounded-full hover:bg-slate-100 transition">
                  <Eye size={20} />
                </button>
              </div>
              
              {/* Category Badge */}
              <div className="absolute top-3 right-3">
                <span className="bg-slate-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                  {design.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-base font-semibold text-slate-900 mb-2 truncate">{design.title}</h4>
              
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">
                  {new Date(design.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button className="flex-1 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm">
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(design._id)}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold flex items-center justify-center gap-2 transition text-sm"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
