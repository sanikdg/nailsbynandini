import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CustomerNavbar } from '../../components/customer/CustomerNavbar';
import { CustomerSidebar } from '../../components/customer/CustomerSidebar';
import { BookDesign } from './BookDesign';
import { MyAppointments } from './MyAppointments';
import { RequestCustomDesign } from './RequestCustomDesign';
import { ReviewForm } from '../../components/home/ReviewForm';
import { Calendar, Heart, Palette, Star } from 'lucide-react';
import api from '../../services/api';

export const CustomerDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('book');
  const [stats, setStats] = useState({
    bookings: 0,
    favorites: 0,
    designs: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const [bookingsRes, requestsRes, favoritesRes, designsRes] = await Promise.all([
        api.get(`/bookings?userId=${user._id}`),
        api.get('/custom-requests/my-requests'),
        api.get('/saved-designs'),
        api.get('/designs'),
      ]);

      // Count only confirmed/accepted bookings
      const confirmedBookings = bookingsRes.data.filter(b => b.status === 'Confirmed').length;
      
      // Count only accepted custom requests
      const acceptedRequests = requestsRes.data.filter(r => r.status === 'Accepted').length;
      
      const totalAppointments = confirmedBookings + acceptedRequests;

      setStats({
        bookings: totalAppointments,
        favorites: favoritesRes.data.length,
        designs: designsRes.data.length,
      });
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats({ bookings: 0, favorites: 0, designs: 0 });
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    if (location.pathname.includes('my-appointments')) {
      setActiveTab('my-appointments');
    } else if (location.pathname.includes('custom-request')) {
      setActiveTab('custom-request');
    } else if (location.pathname.includes('reviews')) {
      setActiveTab('reviews');
    } else {
      setActiveTab('book');
    }
  }, [location.pathname]);

  const renderPage = () => {
    switch (activeTab) {
      case 'book':
        return <BookDesign />;
      case 'my-appointments':
        return <MyAppointments />;
      case 'custom-request':
        return <RequestCustomDesign />;
      case 'reviews':
        return <ReviewForm />;
      default:
        return <BookDesign />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <CustomerNavbar />
      <div className="flex">
        <CustomerSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          {/* Header Section */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Welcome back, {user?.name}!
                  </h1>
                  <p className="text-gray-500 text-sm mt-1">Explore beautiful nail designs and manage your appointments</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">Member since {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">My Bookings</p>
                    <p className="text-4xl font-bold text-blue-900 mt-3">{loadingStats ? '—' : stats.bookings}</p>
                    <p className="text-blue-600 text-xs mt-2">Total appointments</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Calendar size={28} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-rose-50 to-rose-100 rounded-xl p-6 border border-rose-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-rose-600 text-sm font-semibold uppercase tracking-wide">Favorite Designs</p>
                    <p className="text-4xl font-bold text-rose-900 mt-3">{loadingStats ? '—' : stats.favorites}</p>
                    <p className="text-rose-600 text-xs mt-2">Saved designs</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Heart size={28} className="text-rose-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-purple-600 text-sm font-semibold uppercase tracking-wide">Available Designs</p>
                    <p className="text-4xl font-bold text-purple-900 mt-3">{loadingStats ? '—' : stats.designs}</p>
                    <p className="text-purple-600 text-xs mt-2">To choose from</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Palette size={28} className="text-purple-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="p-8">
                {renderPage()}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
