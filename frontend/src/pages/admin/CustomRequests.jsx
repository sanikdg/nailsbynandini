import React, { useState, useEffect } from 'react';
import { ExternalLink, Clock, CheckCircle, XCircle, Sparkles, MessageCircle } from 'lucide-react';
import api from '../../services/api';
import { ChatModal } from '../../components/admin/ChatModal';

export const CustomRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, accepted: 0, rejected: 0 });
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/custom-requests');
      setRequests(data);
      setStats({
        total: data.length,
        pending: data.filter((r) => r.status === 'Pending').length,
        accepted: data.filter((r) => r.status === 'Accepted').length,
        rejected: data.filter((r) => r.status === 'Rejected').length,
      });
    } catch (err) {
      console.error('Failed to fetch custom requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/custom-requests/${id}`, { status });
      fetchRequests(); // Refresh the list
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const openChat = (request) => {
    const chatData = {
      _id: request._id,
      customerName: request.customerName,
      designName: 'Custom Design',
      conversationId: request.conversationId,
      userId: request.userId?._id || request.userId,
      status: request.status,
    };
    setSelectedRequest(chatData);
    setChatOpen(true);
  };

  const statCards = [
    { label: 'Total Requests', value: stats.total, icon: Sparkles, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500', bgLight: 'bg-yellow-50' },
    { label: 'Accepted', value: stats.accepted, icon: CheckCircle, color: 'bg-green-500', bgLight: 'bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500', bgLight: 'bg-red-50' },
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">Pending</span>;
      case 'Accepted':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">Accepted</span>;
      case 'Rejected':
        return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">Rejected</span>;
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-8">Loading custom requests...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Custom Requests</h2>
        <p className="text-gray-600">View and manage customer custom design requests</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className={`${card.bgLight} rounded-lg p-4 border border-gray-100 shadow-sm`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{card.label}</p>
                  <p className="text-2xl font-bold text-gray-800 mt-1">{card.value}</p>
                </div>
                <div className={`${card.color} p-2.5 rounded-lg`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {requests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No custom requests yet</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reference Link</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date/Time</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {requests.map((req) => (
                  <tr key={req._id} className="hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-800">{req.customerName}</p>
                        <p className="text-xs text-gray-500">{req.userId?.email || ''}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a
                        href={req.referenceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-pink-600 hover:text-pink-700 text-sm font-medium transition"
                      >
                        <ExternalLink size={14} />
                        <span className="truncate max-w-[200px]">View Reference</span>
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700 max-w-xs truncate" title={req.description}>
                        {req.description}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {req.date ? new Date(req.date).toLocaleDateString() : '—'}
                      {req.time ? ` at ${req.time}` : ''}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(req.status)}
                    </td>
                    <td className="px-6 py-4">
                      {req.status === 'Pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'Accepted')}
                            className="px-3 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-semibold rounded-lg transition"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(req._id, 'Rejected')}
                            className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg transition"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          {req.conversationId && (
                            <button
                              onClick={() => openChat(req)}
                              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
                            >
                              <MessageCircle size={14} />
                              Chat
                            </button>
                          )}
                          <span className="text-xs text-gray-400">No action needed</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Chat Modal */}
      {chatOpen && selectedRequest && (
        <ChatModal
          booking={selectedRequest}
          onClose={() => setChatOpen(false)}
          adminName="Admin"
        />
      )}
    </div>
  );
};
