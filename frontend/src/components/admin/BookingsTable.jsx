import React, { useEffect, useState } from 'react';
import { ChevronDown, MessageCircle, Check, X, Calendar, User } from 'lucide-react';
import api from '../../services/api';
import API_URL from '../../config';
import { ChatModal } from './ChatModal';

export const BookingsTable = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get('/bookings');
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
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

  const handleAccept = async (booking) => {
    try {
      const { data } = await api.put(`/bookings/${booking._id}/accept`);
      setBookings(bookings.map(b => b._id === booking._id ? data : b));
      alert('Booking accepted!');
      setSelectedBooking(data);
      setChatOpen(true);
    } catch (err) {
      console.error('Failed to accept booking:', err);
      alert('Failed to accept booking');
    }
  };

  const handleReject = async (booking) => {
    const reason = prompt('Enter reason for rejection:');
    if (!reason) return;

    try {
      const { data } = await api.put(`/bookings/${booking._id}/reject`, { reason });
      setBookings(bookings.map(b => b._id === booking._id ? data : b));
      alert('Booking rejected');
    } catch (err) {
      console.error('Failed to reject booking:', err);
      alert('Failed to reject booking');
    }
  };

  const openChat = (booking) => {
    setSelectedBooking(booking);
    setChatOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar size={48} className="mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 text-lg">No bookings yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <div
          key={booking._id}
          className="bg-white rounded-lg shadow-sm border border-slate-200 hover:shadow-md transition overflow-hidden"
        >
          <div className="p-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 flex items-center gap-4">
                <button
                  onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  <ChevronDown
                    size={24}
                    className={`transform transition ${expandedId === booking._id ? 'rotate-180' : ''}`}
                  />
                </button>

                <div className="w-14 h-14 rounded-lg overflow-hidden shadow-sm flex-shrink-0 border border-slate-200">
                  <img
                    src={getImageUrl(booking.designId?.image)}
                    alt={booking.designName}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{booking.customerName}</h3>
                  <p className="text-sm text-slate-600">{booking.designName}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      {new Date(booking.date).toLocaleDateString()}
                    </span>
                    <span>{booking.time}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {booking.status === 'Pending' ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(booking)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition text-sm shadow-sm"
                    >
                      <Check size={16} />
                      Accept
                    </button>
                    <button
                      onClick={() => handleReject(booking)}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition text-sm shadow-sm"
                    >
                      <X size={16} />
                      Reject
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <span
                      className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                        booking.status === 'Confirmed'
                          ? 'bg-green-100 text-green-800'
                          : booking.status === 'Rejected'
                          ? 'bg-red-100 text-red-800'
                          : booking.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-800'
                      }`}
                    >
                      {booking.status}
                    </span>
                    {booking.conversationId && (
                      <button
                        onClick={() => openChat(booking)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold flex items-center gap-2 transition text-sm shadow-sm"
                      >
                        <MessageCircle size={16} />
                        Chat
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {expandedId === booking._id && (
            <div className="p-6 bg-slate-50 border-t border-slate-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Design Preview</h4>
                  {booking.designId?.image && (
                    <img
                      src={getImageUrl(booking.designId.image)}
                      alt={booking.designName}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  )}
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Booking Details</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <User size={16} className="text-slate-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-600">Customer</p>
                        <p className="font-semibold text-slate-900">{booking.customerName}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar size={16} className="text-slate-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-slate-600">Date & Time</p>
                        <p className="font-semibold text-slate-900">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-4 shadow-sm border border-slate-200">
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">Design Information</h4>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-slate-600">Design Name</p>
                      <p className="font-semibold text-slate-900">{booking.designId?.title || 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {booking.notes && (
                <div className="mt-4 bg-white rounded-lg p-4 shadow-sm border-l-4 border-slate-900">
                  <p className="text-sm font-semibold text-slate-900 mb-2">Admin Notes</p>
                  <p className="text-sm text-slate-600">{booking.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {chatOpen && selectedBooking && (
        <ChatModal booking={selectedBooking} onClose={() => setChatOpen(false)} adminName="Admin" />
      )}
    </div>
  );
}
