import React, { useEffect, useState } from 'react';
import { ExternalLink, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

export const MyRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const { data } = await api.get('/custom-requests/my-requests');
      setRequests(data);
    } catch (err) {
      console.error('Failed to fetch requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-800">
            <Clock size={12} />
            Pending
          </span>
        );
      case 'Accepted':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800">
            <CheckCircle size={12} />
            Accepted
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-800">
            <XCircle size={12} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center py-8">Loading your requests...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Requests</h2>
        <p className="text-gray-600">Track the status of your custom design requests</p>
      </div>

      <div className="space-y-4">
        {requests.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
            No custom design requests yet. Submit one from the "Request Design" page!
          </div>
        ) : (
          requests.map((req) => (
            <div key={req._id} className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    {/* Reference Link */}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Reference</span>
                      <a
                        href={req.referenceLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-pink-600 hover:text-pink-700 font-medium mt-1 transition"
                      >
                        <ExternalLink size={14} />
                        <span className="truncate max-w-md">{req.referenceLink}</span>
                      </a>
                    </div>

                    {/* Description */}
                    <div>
                      <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">Description</span>
                      <p className="text-gray-700 mt-1">{req.description}</p>
                    </div>

                    {/* Date/Time if provided */}
                    {(req.date || req.time) && (
                      <div className="flex gap-4 text-sm text-gray-600">
                        {req.date && (
                          <span>📅 {new Date(req.date).toLocaleDateString()}</span>
                        )}
                        {req.time && (
                          <span>🕐 {req.time}</span>
                        )}
                      </div>
                    )}

                    {/* Submitted Date */}
                    <p className="text-xs text-gray-400">
                      Submitted on {new Date(req.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>

                  {/* Status Badge */}
                  <div className="flex-shrink-0">
                    {getStatusBadge(req.status)}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
