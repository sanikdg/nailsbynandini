import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, CheckCircle, XCircle, Search, Filter,
  ExternalLink, ArrowUpDown, Sparkles, Palette, Loader2,
  CalendarCheck, AlertCircle, ArrowRightCircle, ClipboardCheck,
  MessageCircle
} from 'lucide-react';
import api from '../../services/api';
import { ChatModal } from '../../components/admin/ChatModal';

export const Appointments = () => {
  const [bookings, setBookings] = useState([]);
  const [customRequests, setCustomRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');
  const [toast, setToast] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatTarget, setChatTarget] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-dismiss toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, requestsRes] = await Promise.all([
        api.get('/bookings'),
        api.get('/custom-requests'),
      ]);
      setBookings(bookingsRes.data);
      setCustomRequests(requestsRes.data);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      showToast('Failed to load appointments', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
  };

  // ── Chat ─────────────────────────────────────────────────
  const openChat = (item) => {
    // Build a booking-like object the ChatModal expects
    const chatData = {
      _id: item._id,
      customerName: item.customerName,
      designName: item.type === 'design' ? item.designName : 'Custom Design',
      conversationId: item.raw.conversationId,
      userId: item.raw.userId,
    };
    setChatTarget(chatData);
    setChatOpen(true);
  };

  // ── Actions ──────────────────────────────────────────────
  const handleAcceptBooking = async (id) => {
    try {
      const { data } = await api.put(`/bookings/${id}/accept`);
      setBookings(prev => prev.map(b => b._id === id ? data : b));
      showToast('Booking accepted successfully!');
    } catch (err) {
      console.error('Failed to accept booking:', err);
      showToast('Failed to accept booking', 'error');
    }
  };

  const handleRejectBooking = async (id) => {
    try {
      await api.put(`/bookings/${id}/reject`, { reason: 'Rejected by admin' });
      setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'Rejected' } : b));
      showToast('Booking rejected');
    } catch (err) {
      console.error('Failed to reject booking:', err);
      showToast('Failed to reject booking', 'error');
    }
  };

  const handleCompleteBooking = async (id) => {
    try {
      const { data } = await api.put(`/bookings/${id}/complete`);
      setBookings(prev => prev.map(b => b._id === id ? data : b));
      showToast('Appointment marked as completed!');
    } catch (err) {
      console.error('Failed to complete booking:', err);
      showToast('Failed to mark as completed', 'error');
    }
  };

  const handleAcceptRequest = async (id) => {
    try {
      const { data } = await api.put(`/custom-requests/${id}`, { status: 'Accepted' });
      setCustomRequests(prev => prev.map(r => r._id === id ? data : r));
      showToast('Request accepted!');
    } catch (err) {
      console.error('Failed to accept request:', err);
      showToast('Failed to accept request', 'error');
    }
  };

  const handleRejectRequest = async (id) => {
    try {
      const { data } = await api.put(`/custom-requests/${id}`, { status: 'Rejected' });
      setCustomRequests(prev => prev.map(r => r._id === id ? data : r));
      showToast('Request rejected');
    } catch (err) {
      console.error('Failed to reject request:', err);
      showToast('Failed to reject request', 'error');
    }
  };

  const handleCompleteRequest = async (id) => {
    try {
      const { data } = await api.put(`/custom-requests/${id}`, { status: 'Completed' });
      setCustomRequests(prev => prev.map(r => r._id === id ? data : r));
      showToast('Request marked as completed!');
    } catch (err) {
      console.error('Failed to complete request:', err);
      showToast('Failed to mark as completed', 'error');
    }
  };

  const handleConvertToAppointment = async (id) => {
    try {
      const { data } = await api.post(`/custom-requests/${id}/convert`);
      setBookings(prev => [data.booking, ...prev]);
      setCustomRequests(prev => prev.map(r => r._id === id ? data.request : r));
      showToast('Custom request converted to appointment!');
    } catch (err) {
      console.error('Failed to convert request:', err);
      showToast(err.response?.data?.message || 'Failed to convert request', 'error');
    }
  };

  // ── Unified Data ─────────────────────────────────────────
  const unifiedData = useMemo(() => {
    const bookingItems = bookings.map(b => ({
      _id: b._id,
      type: 'design',
      customerName: b.customerName,
      designName: b.designName,
      referenceLink: null,
      description: null,
      date: b.date,
      time: b.time,
      status: b.status === 'Confirmed' ? 'Accepted' : b.status,
      rawStatus: b.status,
      createdAt: b.createdAt,
      hasChat: !!b.conversationId,
      raw: b,
    }));

    const requestItems = customRequests.map(r => ({
      _id: r._id,
      type: 'custom',
      customerName: r.customerName,
      designName: null,
      referenceLink: r.referenceLink,
      description: r.description,
      date: r.date,
      time: r.time,
      status: r.status,
      rawStatus: r.status,
      createdAt: r.createdAt,
      hasChat: !!r.conversationId,
      raw: r,
    }));

    let combined = [...bookingItems, ...requestItems];

    // Tab filter
    if (activeTab === 'bookings') combined = combined.filter(i => i.type === 'design');
    if (activeTab === 'requests') combined = combined.filter(i => i.type === 'custom');

    // Status filter
    if (statusFilter !== 'all') {
      combined = combined.filter(i => {
        if (statusFilter === 'Accepted') {
          return i.status === 'Accepted' || i.rawStatus === 'Confirmed';
        }
        return i.status === statusFilter;
      });
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      combined = combined.filter(i =>
        i.customerName?.toLowerCase().includes(q) ||
        i.designName?.toLowerCase().includes(q) ||
        i.description?.toLowerCase().includes(q)
      );
    }

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
  }, [bookings, customRequests, activeTab, statusFilter, searchQuery, sortOrder]);

  // ── Stats ────────────────────────────────────────────────
  const stats = useMemo(() => {
    const all = [...bookings, ...customRequests];
    return {
      total: all.length,
      pending: all.filter(i => i.status === 'Pending').length,
      accepted: all.filter(i => ['Accepted', 'Confirmed'].includes(i.status)).length,
      completed: all.filter(i => i.status === 'Completed').length,
    };
  }, [bookings, customRequests]);

  // ── Helpers ──────────────────────────────────────────────
  const getStatusBadge = (status) => {
    const map = {
      Pending: 'bg-yellow-100 text-yellow-800',
      Accepted: 'bg-green-100 text-green-800',
      Confirmed: 'bg-green-100 text-green-800',
      Rejected: 'bg-red-100 text-red-800',
      Completed: 'bg-blue-100 text-blue-800',
      Cancelled: 'bg-gray-100 text-gray-800',
    };
    const displayStatus = status === 'Confirmed' ? 'Accepted' : status;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${map[status] || 'bg-gray-100 text-gray-800'}`}>
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

  const statCards = [
    { label: 'Total Appointments', value: stats.total, icon: Calendar, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { label: 'Pending Requests', value: stats.pending, icon: Clock, color: 'bg-yellow-500', bgLight: 'bg-yellow-50' },
    { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'bg-green-500', bgLight: 'bg-green-50' },
    { label: 'Completed', value: stats.completed, icon: CalendarCheck, color: 'bg-indigo-500', bgLight: 'bg-indigo-50' },
  ];

  const tabs = [
    { id: 'all', label: 'All' },
    { id: 'bookings', label: 'Standard Bookings' },
    { id: 'requests', label: 'Custom Requests' },
  ];

  // ── Render ───────────────────────────────────────────────
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
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Appointments</h2>
        <p className="text-slate-600">Manage all bookings and custom design requests in one place</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bgLight} rounded-lg p-4 border border-slate-200 shadow-sm hover:shadow-md transition-shadow`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-600 uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-900 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-2.5 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1 w-fit">
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

      {/* Filters Row */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by customer name or design..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          />
        </div>

        {/* Status Filter */}
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-lg border border-slate-200 bg-white text-sm appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          >
            <option value="all">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        {/* Sort */}
        <button
          onClick={() => setSortOrder(s => s === 'latest' ? 'upcoming' : 'latest')}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition"
        >
          <ArrowUpDown size={16} />
          {sortOrder === 'latest' ? 'Latest First' : 'Upcoming First'}
        </button>
      </div>

      {/* Table */}
      {loading ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-16 text-center">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-3" />
          <p className="text-slate-600 text-sm">Loading appointments...</p>
        </div>
      ) : unifiedData.length === 0 ? (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-16 text-center">
          <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">No appointments found</p>
          <p className="text-slate-500 text-sm mt-1">
            {searchQuery || statusFilter !== 'all' || activeTab !== 'all'
              ? 'Try adjusting your filters or search query'
              : 'Appointments will appear here once customers make bookings'}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Type</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Details</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Date / Time</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3.5 text-xs font-semibold text-slate-600 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {unifiedData.map((item) => (
                  <tr key={`${item.type}-${item._id}`} className="hover:bg-slate-50 transition">
                    {/* Customer */}
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900">{item.customerName}</p>
                    </td>

                    {/* Type */}
                    <td className="px-6 py-4">
                      {getTypeBadge(item.type)}
                    </td>

                    {/* Details */}
                    <td className="px-6 py-4">
                      {item.type === 'design' ? (
                        <p className="text-sm text-slate-700">{item.designName}</p>
                      ) : (
                        <div className="space-y-1">
                          {item.referenceLink && (
                            <a
                              href={item.referenceLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 text-sm font-medium transition"
                            >
                              <ExternalLink size={13} />
                              View Reference
                            </a>
                          )}
                          {item.description && (
                            <p className="text-sm text-slate-600 truncate max-w-[200px]" title={item.description}>
                              {item.description}
                            </p>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Date/Time */}
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {item.date ? new Date(item.date).toLocaleDateString() : '—'}
                      {item.time ? ` at ${item.time}` : ''}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      {getStatusBadge(item.rawStatus)}
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1.5">
                        {/* Pending actions */}
                        {item.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => item.type === 'design' ? handleAcceptBooking(item._id) : handleAcceptRequest(item._id)}
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg transition"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => item.type === 'design' ? handleRejectBooking(item._id) : handleRejectRequest(item._id)}
                              className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg transition"
                            >
                              Reject
                            </button>
                          </>
                        )}

                        {/* Chat button — for both bookings and custom requests with a conversation */}
                        {item.hasChat && (
                          <button
                            onClick={() => openChat(item)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            <MessageCircle size={13} />
                            Chat
                          </button>
                        )}

                        {/* Accepted/Confirmed → Mark Complete */}
                        {(item.status === 'Accepted' || item.rawStatus === 'Confirmed') && (
                          <button
                            onClick={() => item.type === 'design' ? handleCompleteBooking(item._id) : handleCompleteRequest(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            <ClipboardCheck size={13} />
                            Complete
                          </button>
                        )}

                        {/* Convert custom request to appointment */}
                        {item.type === 'custom' && item.status === 'Accepted' && (
                          <button
                            onClick={() => handleConvertToAppointment(item._id)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold rounded-lg transition"
                          >
                            <ArrowRightCircle size={13} />
                            Convert
                          </button>
                        )}

                        {/* No action for Rejected/Completed (and no chat) */}
                        {['Rejected', 'Completed', 'Cancelled'].includes(item.status) && !item.hasChat && (
                          <span className="text-xs text-slate-400 py-1.5">No action</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Chat Modal */}
      {chatOpen && chatTarget && (
        <ChatModal
          booking={chatTarget}
          onClose={() => setChatOpen(false)}
          adminName="Admin"
        />
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
