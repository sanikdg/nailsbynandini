import React, { useState, useEffect } from 'react';
import { Send, Link2, FileText, Calendar, Clock, CheckCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { ChatModal } from '../../components/customer/ChatModal';

export const RequestCustomDesign = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    referenceLink: '',
    description: '',
    date: '',
    time: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [fetchingRequests, setFetchingRequests] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);

  useEffect(() => {
    fetchMyRequests();
  }, []);

  useEffect(() => {
    if (formData.date) {
      fetchBookedSlots(formData.date);
    }
  }, [formData.date]);

  const fetchMyRequests = async () => {
    setFetchingRequests(true);
    try {
      const { data } = await api.get('/custom-requests/my-requests');
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setFetchingRequests(false);
    }
  };

  const fetchBookedSlots = async (date) => {
    try {
      const { data } = await api.get(`/bookings/booked-slots?date=${date}`);
      setBookedSlots(data.bookedTimes || []);
    } catch (err) {
      console.error('Failed to fetch booked slots:', err);
      setBookedSlots([]);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      await api.post('/custom-requests', {
        customerName: user.name,
        referenceLink: formData.referenceLink,
        description: formData.description,
        date: formData.date,
        time: formData.time,
      });
      setSuccess(true);
      setFormData({ referenceLink: '', description: '', date: '', time: '' });
      // Refresh requests list
      fetchMyRequests();
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  const openChat = (request) => {
    const chatData = {
      _id: request._id,
      customerName: request.customerName || user.name,
      designName: 'Custom Design',
      conversationId: request.conversationId,
      userId: request.userId || user._id,
      status: request.status,
    };
    setSelectedRequest(chatData);
    setChatOpen(true);
  };

  const getStatusBadge = (status) => {
    const map = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} /> },
      Accepted: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} /> },
      Rejected: { bg: 'bg-red-100 text-red-800', icon: <CheckCircle size={12} /> },
      Completed: { bg: 'bg-blue-100 text-blue-800', icon: <CheckCircle size={12} /> },
      Cancelled: { bg: 'bg-gray-100 text-gray-800', icon: <CheckCircle size={12} /> },
    };
    const s = map[status] || map.Pending;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg}`}>
        {s.icon}
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Request Custom Design</h2>
        <p className="text-slate-600">Share a reference link and we'll create your dream nail design</p>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="text-green-600 flex-shrink-0" size={24} />
          <div>
            <p className="font-semibold text-green-900">Request Sent Successfully!</p>
            <p className="text-green-700 text-sm">Your custom design request has been sent to admin. You can track it below.</p>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 space-y-5">
        {/* Customer Name (read-only) */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">Customer Name</label>
          <input
            type="text"
            value={user?.name || ''}
            readOnly
            className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
          />
        </div>

        {/* Reference Link */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-2">
              <Link2 size={16} />
              Reference Link *
            </span>
          </label>
          <input
            type="url"
            name="referenceLink"
            value={formData.referenceLink}
            onChange={handleChange}
            placeholder="https://pinterest.com/pin/... or Instagram link"
            required
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
          />
          <p className="text-xs text-slate-500 mt-1">Paste a Pinterest, Instagram, or any image URL for reference</p>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            <span className="flex items-center gap-2">
              <FileText size={16} />
              Description *
            </span>
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your dream nail design — colors, patterns, style preferences..."
            required
            rows={4}
            className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
          />
        </div>

        {/* Date and Time Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <Calendar size={16} />
                Preferred Date (Optional)
              </span>
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              <span className="flex items-center gap-2">
                <Clock size={16} />
                Preferred Time (Optional)
              </span>
            </label>
            <select
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
            >
              <option value="">Select a time slot</option>
              {['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'].map((time) => {
                const isBooked = bookedSlots.includes(time);
                return (
                  <option key={time} value={time} disabled={isBooked}>
                    {time} {isBooked ? '(Booked)' : ''}
                  </option>
                );
              })}
            </select>
            {formData.date && bookedSlots.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                {bookedSlots.length} slot(s) booked on this date
              </p>
            )}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-semibold rounded-lg transition shadow-sm"
        >
          <Send size={18} />
          {loading ? 'Sending Request...' : 'Send Request'}
        </button>
      </form>

      {/* My Requests Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-slate-900">My Custom Requests</h3>
        
        {fetchingRequests ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-slate-600">Loading requests...</p>
          </div>
        ) : requests.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 text-center">
            <p className="text-slate-600">No custom requests yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request._id} className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold text-slate-900">Custom Design Request</h4>
                      {getStatusBadge(request.status)}
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{request.description}</p>
                    <p className="text-xs text-slate-500">
                      Requested: {new Date(request.createdAt).toLocaleDateString('en-US', {
                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                      })}
                      {request.date && ` • Preferred: ${request.date}`}
                    </p>
                  </div>
                  {request.conversationId && (
                    <button
                      onClick={() => openChat(request)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition flex-shrink-0"
                    >
                      <MessageCircle size={16} />
                      Chat
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedRequest && (
        <ChatModal
          booking={selectedRequest}
          onClose={() => setChatOpen(false)}
          isCustomer={true}
        />
      )}
    </div>
  );
};
