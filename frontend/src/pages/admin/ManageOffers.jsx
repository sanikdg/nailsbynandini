import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Loader2, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import api from '../../services/api';

export const ManageOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    discount: '',
    code: '',
    expiry: '',
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchOffers = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/offers');
      setOffers(data);
    } catch (err) {
      console.error('Failed to fetch offers:', err);
      showToast('Failed to load offers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.discount || !formData.expiry) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      if (editingId) {
        await api.put(`/offers/${editingId}`, formData);
        setOffers(prev =>
          prev.map(o => o._id === editingId ? { ...o, ...formData } : o)
        );
        showToast('Offer updated successfully');
      } else {
        const { data } = await api.post('/offers', formData);
        setOffers(prev => [...prev, data]);
        showToast('Offer created successfully');
      }
      resetForm();
    } catch (err) {
      console.error('Failed to save offer:', err);
      showToast(err.response?.data?.message || 'Failed to save offer', 'error');
    }
  };

  const handleEdit = (offer) => {
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      code: offer.code || '',
      expiry: offer.expiry.split('T')[0], // Format date for input
    });
    setEditingId(offer._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await api.delete(`/offers/${id}`);
        setOffers(prev => prev.filter(o => o._id !== id));
        showToast('Offer deleted successfully');
      } catch (err) {
        console.error('Failed to delete offer:', err);
        showToast('Failed to delete offer', 'error');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      discount: '',
      code: '',
      expiry: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const formatExpiry = (expiryDate) => {
    const expiry = new Date(expiryDate);
    return expiry.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-20 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 animate-slide-in ${
          toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'
        }`}>
          {toast.type === 'error' ? <AlertCircle size={18} /> : <CheckCircle size={18} />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Manage Offers</h2>
          <p className="text-slate-600">Create and manage special offers for customers</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition"
        >
          <Plus size={20} />
          {showForm ? 'Cancel' : 'Add Offer'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            {editingId ? 'Edit Offer' : 'Create New Offer'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Offer Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Summer Special - 20% Off"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Discount (%) *
                </label>
                <input
                  type="number"
                  name="discount"
                  value={formData.discount}
                  onChange={handleInputChange}
                  placeholder="e.g., 20"
                  min="0"
                  max="100"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Promo Code
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleInputChange}
                  placeholder="e.g., SUMMER20"
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  name="expiry"
                  value={formData.expiry}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Description *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the offer details..."
                rows="3"
                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                {editingId ? 'Update Offer' : 'Create Offer'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Offers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{offers.length}</p>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <Plus className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Active Offers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {offers.filter(o => !isExpired(o.expiry)).length}
              </p>
            </div>
            <div className="bg-green-50 p-2.5 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Expired Offers</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                {offers.filter(o => isExpired(o.expiry)).length}
              </p>
            </div>
            <div className="bg-red-50 p-2.5 rounded-lg">
              <Clock className="w-5 h-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Offers List */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading offers...</p>
        </div>
      ) : offers.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
          <AlertCircle className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No offers yet</p>
          <p className="text-slate-500 text-sm mt-1">Create your first offer to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{offer.title}</h3>
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      isExpired(offer.expiry)
                        ? 'bg-red-100 text-red-800'
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {isExpired(offer.expiry) ? 'Expired' : 'Active'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm">{offer.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-slate-900">{offer.discount}%</p>
                  <p className="text-xs text-slate-500">Discount</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex gap-4 text-sm">
                  {offer.code && (
                    <div>
                      <p className="text-slate-500">Code:</p>
                      <p className="font-mono font-semibold text-slate-900">{offer.code}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-slate-500">Expires:</p>
                    <p className="font-semibold text-slate-900">{formatExpiry(offer.expiry)}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(offer)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    <Edit2 size={14} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(offer._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Inline style for toast animation */}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(100px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};
