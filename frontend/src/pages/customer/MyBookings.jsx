import React, { useEffect, useState } from 'react';
import { MessageCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import API_URL from '../../config';
import { ChatModal } from '../../components/customer/ChatModal';

export const MyBookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState({});

  useEffect(() => {
    fetchBookings();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get(`/bookings?userId=${user._id}`);
      setBookings(data);
      
      // Check for unread messages in each conversation
      data.forEach(async (booking) => {
        if (booking.conversationId) {
          try {
            const { data: messages } = await api.get(`/messages/${booking.conversationId}`);
            const unread = messages.filter(m => !m.readBy?.includes(user._id)).length;
            setUnreadCount(prev => ({ ...prev, [booking._id]: unread }));
          } catch (err) {
            console.error('Failed to fetch messages:', err);
          }
        }
      });
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

  const openChat = async (booking) => {
    try {
      // Refresh the booking data to ensure conversationId is populated
      const { data } = await api.get(`/bookings?userId=${user._id}`);
      const refreshedBooking = data.find(b => b._id === booking._id);
      
      if (refreshedBooking) {
        setSelectedBooking(refreshedBooking);
        setChatOpen(true);
        // Clear unread count
        setUnreadCount(prev => ({ ...prev, [booking._id]: 0 }));
      }
    } catch (err) {
      console.error('Failed to refresh booking:', err);
      // Fallback to original booking if refresh fails
      setSelectedBooking(booking);
      setChatOpen(true);
    }
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Bookings</h2>
        <p className="text-gray-600">View all your scheduled appointments</p>
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No bookings yet
          </div>
        ) : (
          bookings.map((booking) => (
            <div key={booking._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              {/* Main Row */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setExpandedId(expandedId === booking._id ? null : booking._id)}
                        className="text-gray-400 hover:text-gray-600 transition"
                      >
                        <ChevronDown 
                          size={20} 
                          className={`transform transition ${expandedId === booking._id ? 'rotate-180' : ''}`}
                        />
                      </button>
                      <div>
                        <h3 className="font-semibold text-gray-800">{booking.designName}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(booking.date).toLocaleDateString()} at {booking.time}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                      booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                      booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                    {booking.conversationId && (
                      <button
                        onClick={() => openChat(booking)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-semibold transition w-full justify-center relative"
                      >
                        <MessageCircle size={16} />
                        Chat
                        {unreadCount[booking._id] > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                            {unreadCount[booking._id]}
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === booking._id && (
                <div className="p-6 bg-gray-50 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Design Image */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Design Preview</h4>
                      {booking.designId?.image && (
                        <img
                          src={getImageUrl(booking.designId.image)}
                          alt={booking.designName}
                          className="w-full h-48 object-cover rounded-lg shadow-md"
                        />
                      )}
                    </div>

                    {/* Booking Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-gray-700 mb-3">Booking Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-gray-600">Design:</span>
                          <p className="font-medium text-gray-800">{booking.designName}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Date:</span>
                          <p className="font-medium text-gray-800">
                            {new Date(booking.date).toLocaleDateString('en-US', {
                              weekday: 'long',
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                        <div>
                          <span className="text-gray-600">Time:</span>
                          <p className="font-medium text-gray-800">{booking.time}</p>
                        </div>
                        <div>
                          <span className="text-gray-600">Status:</span>
                          <p className={`font-medium mt-1 px-2 py-1 rounded text-xs w-fit ${
                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-800' :
                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            booking.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            booking.status === 'Completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {booking.status}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes Section */}
                  {booking.notes && (
                    <div className="mt-4 p-3 bg-white rounded border border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">Admin Notes:</span>
                      <p className="text-sm text-gray-600 mt-1">{booking.notes}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedBooking && (
        <ChatModal
          booking={selectedBooking}
          onClose={() => setChatOpen(false)}
          isCustomer={true}
        />
      )}
    </div>
  );
};
