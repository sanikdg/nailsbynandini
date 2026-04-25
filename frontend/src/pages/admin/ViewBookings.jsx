import React, { useState, useEffect } from 'react';
import { BookingsTable } from '../../components/admin/BookingsTable';
import { Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

export const ViewBookings = () => {
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, rejected: 0 });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/bookings');
        setStats({
          total: data.length,
          pending: data.filter((b) => b.status === 'Pending').length,
          confirmed: data.filter((b) => b.status === 'Confirmed').length,
          rejected: data.filter((b) => b.status === 'Rejected').length,
        });
      } catch (err) {
        console.error('Failed to fetch booking stats:', err);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Total Bookings', value: stats.total, icon: Calendar, color: 'bg-blue-500', bgLight: 'bg-blue-50' },
    { label: 'Pending', value: stats.pending, icon: Clock, color: 'bg-yellow-500', bgLight: 'bg-yellow-50' },
    { label: 'Confirmed', value: stats.confirmed, icon: CheckCircle, color: 'bg-green-500', bgLight: 'bg-green-50' },
    { label: 'Rejected', value: stats.rejected, icon: XCircle, color: 'bg-red-500', bgLight: 'bg-red-50' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">View Bookings</h2>
        <p className="text-gray-600">Manage all customer bookings and appointments</p>
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

      <BookingsTable />
    </div>
  );
};

