import React, { useEffect, useState, useMemo } from 'react';
import {
  MessageCircle, ChevronDown, ExternalLink, Clock, CheckCircle,
  XCircle, Calendar, Palette, Sparkles, Loader2, ArrowUpDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import API_URL from '../../config';
import { ChatModal } from '../../components/customer/ChatModal';

export const MyAppointments = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [bookingsRes, requestsRes] = await Promise.all([
        api.get(`/bookings?userId=${user._id}`),
        api.get('/custom-requests/my-requests'),
      ]);
      setBookings(bookingsRes.data);
      setRequests(requestsRes.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
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

  const openChat = (item) => {
    // Build a booking-like object ChatModal expects
    const chatData = {
      _id: item._id,
      customerName: item.customerName || user.name,
      designName: item.designName || 'Custom Design',
      conversationId: item.conversationId,
      userId: item.userId || user._id,
      status: item.status,
    };
    setSelectedBooking(chatData);
    setChatOpen(true);
  };

  // ── Unified Data ─────────────────────────────────────────
  const unifiedData = useMemo(() => {
    const bookingItems = bookings.map(b => ({
      _id: b._id,
      type: 'design',
      designName: b.designName,
      designImage: b.designId?.image,
      designPrice: b.designId?.price,
      referenceLink: null,
      description: null,
      date: b.date,
      time: b.time,
      status: b.status,
      displayStatus: b.status === 'Confirmed' ? 'Accepted' : b.status,
      createdAt: b.createdAt,
      conversationId: b.conversationId,
      notes: b.notes,
      raw: b,
    }));

    const requestItems = requests.map(r => ({
      _id: r._id,
      type: 'custom',
      designName: null,
      designImage: null,
      designPrice: null,
      referenceLink: r.referenceLink,
      description: r.description,
      date: r.date,
      time: r.time,
      status: r.status,
      displayStatus: r.status,
      createdAt: r.createdAt,
      conversationId: r.conversationId,
      notes: null,
      raw: r,
    }));

    let combined = [...bookingItems, ...requestItems];

    // Tab filter
    if (activeTab === 'bookings') combined = combined.filter(i => i.type === 'design');
    if (activeTab === 'requests') combined = combined.filter(i => i.type === 'custom');

    // Sort
    if (sortOrder === 'latest') {
      combined.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      combined.sort((a, b) => {
        const dateA = a.date ? new Date(a.date) : new Date('9999-12-31');
        const dateB = b.date ? new Date(b.date) : new Date('9999-12-31');
        return dateA - dateB;
      });
    }

    return combined;
  }, [bookings, requests, activeTab, sortOrder]);

  const getStatusBadge = (status) => {
    const map = {
      Pending: { bg: 'bg-yellow-100 text-yellow-800', icon: <Clock size={12} /> },
      Accepted: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} /> },
      Confirmed: { bg: 'bg-green-100 text-green-800', icon: <CheckCircle size={12} /> },
      Rejected: { bg: 'bg-red-100 text-red-800', icon: <XCircle size={12} /> },
      Completed: { bg: 'bg-blue-100 text-blue-800', icon: <CheckCircle size={12} /> },
      Cancelled: { bg: 'bg-gray-100 text-gray-800', icon: <XCircle size={12} /> },
    };
    const s = map[status] || map.Cancelled;
    const displayStatus = status === 'Confirmed' ? 'Accepted' : status;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${s.bg}`}>
        {s.icon}
        {displayStatus}
      </span>
    );
  };

  const getTypeBadge = (type) => {
    return type === 'design' ? (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">
        <Palette size={12} /> Design
      </span>
    ) : (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-pink-100 text-pink-800">
        <Sparkles size={12} /> Custom
      </span>
    );
  };

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'requests', label: 'Custom Requests' },
  ];

  // ── Render ───────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Loader2 className="w-8 h-8 text-pink-500 animate-spin mb-3" />
        <p className="text-gray-500 text-sm">Loading your appointments...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-1">My Appointments</h2>
        <p className="text-slate-600">View all your bookings and custom design requests</p>
      </div>

      {/* Tabs + Sort */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => setSortOrder(s => s === 'latest' ? 'upcoming' : 'latest')}
          className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowUpDown size={16} />
          {sortOrder === 'latest' ? 'Latest First' : 'Upcoming First'}
        </button>
      </div>

      {/* Appointments List */}
      <div className="space-y-4">
        {unifiedData.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-12 text-center">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-600 font-medium">No appointments yet</p>
            <p className="text-slate-500 text-sm mt-1">
              Book a design or submit a custom request to get started!
            </p>
          </div>
        ) : (
          unifiedData.map((item) => (
            <div key={`${item.type}-${item._id}`} className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
              {/* Main Row */}
              <div className="p-5 border-b border-slate-100">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      {item.type === 'design' && (
                        <button
                          onClick={() => setExpandedId(expandedId === `${item.type}-${item._id}` ? null : `${item.type}-${item._id}`)}
                          className="text-slate-400 hover:text-slate-600 transition"
                        >
                          <ChevronDown
                            size={20}
                            className={`transform transition ${expandedId === `${item.type}-${item._id}` ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          {getTypeBadge(item.type)}
                          <h3 className="font-semibold text-slate-900">
                            {item.type === 'design' ? item.designName : 'Custom Design Request'}
                          </h3>
                        </div>
                        <p className="text-sm text-slate-600">
                          {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                          }) : 'No date set'}
                          {item.time ? ` at ${item.time}` : ''}
                        </p>
                        {item.type === 'custom' && item.referenceLink && (
                          <a
                            href={item.referenceLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                          >
                            <ExternalLink size={13} />
                            View Reference
                          </a>
                        )}
                        {item.type === 'custom' && item.description && (
                          <p className="text-sm text-slate-600">{item.description}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right space-y-2 flex-shrink-0">
                    {getStatusBadge(item.status)}
                    {item.conversationId && (
                      <button
                        onClick={() => openChat(item.raw)}
                        className="flex items-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition w-full justify-center mt-2"
                      >
                        <MessageCircle size={14} />
                        Chat with Admin
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details (only for design bookings) */}
              {item.type === 'design' && expandedId === `${item.type}-${item._id}` && (
                <div className="p-5 bg-slate-50 border-t border-slate-100">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Design Image */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Design Preview</h4>
                      {item.designImage && (
                        <img
                          src={getImageUrl(item.designImage)}
                          alt={item.designName}
                          className="w-full h-48 object-cover rounded-lg border border-slate-200 shadow-sm"
                        />
                      )}
                    </div>

                    {/* Booking Details */}
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900 mb-3">Booking Details</h4>
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="text-slate-600">Design:</span>
                          <p className="font-medium text-slate-900">{item.designName}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Date:</span>
                          <p className="font-medium text-slate-900">
                            {item.date ? new Date(item.date).toLocaleDateString('en-US', {
                              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            }) : '—'}
                          </p>
                        </div>
                        <div>
                          <span className="text-slate-600">Time:</span>
                          <p className="font-medium text-slate-900">{item.time || '—'}</p>
                        </div>
                        <div>
                          <span className="text-slate-600">Status:</span>
                          <div className="mt-1">{getStatusBadge(item.status)}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Notes */}
                  {item.notes && (
                    <div className="mt-4 p-3 bg-white rounded-lg border border-slate-200">
                      <span className="text-sm font-semibold text-slate-900">Admin Notes:</span>
                      <p className="text-sm text-slate-600 mt-1">{item.notes}</p>
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
