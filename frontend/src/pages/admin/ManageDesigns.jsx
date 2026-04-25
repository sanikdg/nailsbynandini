import React, { useState, useEffect } from 'react';
import { DesignForm } from '../../components/admin/DesignForm';
import { DesignsList } from '../../components/admin/DesignsList';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import api from '../../services/api';
import API_URL from '../../config';

export const ManageDesigns = () => {
  const [refresh, setRefresh] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDesigns();
  }, [refresh]);

  const fetchDesigns = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/designs');
      setDesigns(data);
    } catch (err) {
      console.error('Failed to fetch designs:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    setRefresh((prev) => prev + 1);
    setShowForm(false);
  };

  const getImageUrl = (img) => {
    if (!img) return '/sanu/hand5.jpeg';
    if (img.startsWith('/uploads/')) return `${API_URL}${img}`;
    if (img.startsWith('http')) return img;
    return img;
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this design?')) {
      try {
        await api.delete(`/designs/${id}`);
        setRefresh((prev) => prev + 1);
      } catch (err) {
        console.error('Failed to delete design:', err);
        alert('Failed to delete design');
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Design Management</h2>
          <p className="text-slate-600 mt-1">Create and manage your nail design collection</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-lg font-semibold flex items-center gap-2 shadow-sm transition"
        >
          <Plus size={20} />
          Add New Design
        </button>
      </div>

      {/* Form Section */}
      {showForm && (
        <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
          <DesignForm onSuccess={handleSuccess} />
        </div>
      )}

      {/* All Designs Grid */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">All Designs</h3>
        
        {loading ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-slate-600">Loading designs...</p>
          </div>
        ) : designs.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <p className="text-slate-600">No designs yet. Create your first design!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {designs.map((design) => (
              <div
                key={design._id}
                className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="relative w-full h-48 bg-slate-100 overflow-hidden">
                  <img
                    src={getImageUrl(design.image)}
                    alt={design.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* Overlay with actions */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => handleDelete(design._id)}
                      className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-lg transition"
                      title="Delete Design"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-slate-900 text-sm line-clamp-2">{design.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{design.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-end pt-3 border-t border-slate-100">
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                      {design.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Designs List (for reference) */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Design Details</h3>
          <DesignsList refresh={refresh} />
        </div>
      </div>
    </div>
  );
};
