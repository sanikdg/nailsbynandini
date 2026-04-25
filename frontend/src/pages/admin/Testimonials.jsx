import React, { useState, useEffect } from 'react';
import { Star, CheckCircle, Trash2, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';
import api from '../../services/api';

export const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending'); // pending, active, all
  const [toast, setToast] = useState(null);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/testimonials/all');
      setTestimonials(data);
    } catch (err) {
      console.error('Failed to fetch testimonials:', err);
      showToast('Failed to load testimonials', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  const handleApprove = async (id) => {
    try {
      await api.put(`/testimonials/${id}`, { isActive: true });
      setTestimonials(prev =>
        prev.map(t => t._id === id ? { ...t, isActive: true } : t)
      );
      showToast('Review approved and will be displayed on website');
    } catch (err) {
      console.error('Failed to approve testimonial:', err);
      showToast('Failed to approve review', 'error');
    }
  };

  const handleReject = async (id) => {
    try {
      await api.put(`/testimonials/${id}`, { isActive: false });
      setTestimonials(prev =>
        prev.map(t => t._id === id ? { ...t, isActive: false } : t)
      );
      showToast('Review hidden from website');
    } catch (err) {
      console.error('Failed to reject testimonial:', err);
      showToast('Failed to hide review', 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await api.delete(`/testimonials/${id}`);
        setTestimonials(prev => prev.filter(t => t._id !== id));
        showToast('Review deleted successfully');
      } catch (err) {
        console.error('Failed to delete testimonial:', err);
        showToast('Failed to delete review', 'error');
      }
    }
  };

  const filteredTestimonials = testimonials.filter(t => {
    if (filter === 'pending') return !t.isActive;
    if (filter === 'active') return t.isActive;
    return true;
  });

  const pendingCount = testimonials.filter(t => !t.isActive).length;
  const activeCount = testimonials.filter(t => t.isActive).length;

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
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Customer Reviews</h2>
        <p className="text-slate-600">Manage and approve customer reviews for the website</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Reviews</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{testimonials.length}</p>
            </div>
            <div className="bg-blue-50 p-2.5 rounded-lg">
              <Star className="w-5 h-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Pending Approval</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{pendingCount}</p>
            </div>
            <div className="bg-yellow-50 p-2.5 rounded-lg">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-slate-600 text-sm font-medium">Published</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{activeCount}</p>
            </div>
            <div className="bg-green-50 p-2.5 rounded-lg">
              <CheckCircle className="w-5 h-5 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
        {[
          { id: 'pending', label: `Pending (${pendingCount})` },
          { id: 'active', label: `Published (${activeCount})` },
          { id: 'all', label: 'All Reviews' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setFilter(tab.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              filter === tab.id
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading reviews...</p>
        </div>
      ) : filteredTestimonials.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
          <Star className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No reviews found</p>
          <p className="text-slate-500 text-sm mt-1">
            {filter === 'pending' && 'No pending reviews to approve'}
            {filter === 'active' && 'No published reviews yet'}
            {filter === 'all' && 'No reviews yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredTestimonials.map((review) => (
            <div
              key={review._id}
              className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-semibold text-slate-900">{review.name}</h3>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      review.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {review.isActive ? 'Published' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500">{review.role || 'Customer'}</p>
                </div>

                {/* Rating */}
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      className={`${
                        i < review.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Review Text */}
              <p className="text-slate-700 mb-4 leading-relaxed">{review.text}</p>

              {/* Meta */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  {new Date(review.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </p>

                {/* Actions */}
                <div className="flex gap-2">
                  {!review.isActive ? (
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition"
                      title="Approve and publish"
                    >
                      <Eye size={14} />
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleReject(review._id)}
                      className="flex items-center gap-1 px-3 py-1.5 bg-slate-600 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg transition"
                      title="Hide from website"
                    >
                      <EyeOff size={14} />
                      Hide
                    </button>
                  )}

                  <button
                    onClick={() => handleDelete(review._id)}
                    className="flex items-center gap-1 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                    title="Delete review"
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
