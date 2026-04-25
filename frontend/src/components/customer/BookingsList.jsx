import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const BookingsList = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get(`/bookings?userId=${user._id}`);
      setBookings(data);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Loading bookings...</div>;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Design Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Time</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-4 text-gray-800">{booking.designName}</td>
                <td className="px-6 py-4 text-gray-800">
                  {new Date(booking.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 text-gray-800">{booking.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {bookings.length === 0 && (
        <div className="text-center py-8 text-gray-500">No bookings yet</div>
      )}
    </div>
  );
};
