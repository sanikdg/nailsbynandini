import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AdminNavbar } from '../../components/admin/AdminNavbar';
import { AdminSidebar } from '../../components/admin/AdminSidebar';
import { ManageDesigns } from './ManageDesigns';
import { Appointments } from './Appointments';
import { Testimonials } from './Testimonials';
import { ManageOffers } from './ManageOffers';
import { CustomRequests } from './CustomRequests';
import { TrendingUp, Palette, Calendar, Users } from 'lucide-react';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('designs');

  useEffect(() => {
    if (!user?.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  const renderPage = () => {
    switch (activeTab) {
      case 'designs':
        return <ManageDesigns />;
      case 'appointments':
        return <Appointments />;
      case 'custom-requests':
        return <CustomRequests />;
      case 'testimonials':
        return <Testimonials />;
      case 'offers':
        return <ManageOffers />;
      default:
        return <ManageDesigns />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <AdminNavbar />
      <div className="flex">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 ml-64 transition-all duration-300" style={{ marginLeft: 'var(--sidebar-width, 16rem)' }}>
          {/* Header Section */}
          <div className="border-b border-gray-200 bg-white sticky top-0 z-10">
            <div className="px-8 py-6">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                  <p className="text-gray-500 text-sm mt-1">Welcome back to your salon management</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-500 text-sm">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
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
                    <p className="text-blue-600 text-sm font-semibold uppercase tracking-wide">Total Designs</p>
                    <p className="text-4xl font-bold text-blue-900 mt-3">24</p>
                    <p className="text-blue-600 text-xs mt-2">Active designs in system</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Palette size={28} className="text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl p-6 border border-amber-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-amber-600 text-sm font-semibold uppercase tracking-wide">Pending Bookings</p>
                    <p className="text-4xl font-bold text-amber-900 mt-3">8</p>
                    <p className="text-amber-600 text-xs mt-2">Awaiting your confirmation</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Calendar size={28} className="text-amber-600" />
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-6 border border-emerald-200">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-emerald-600 text-sm font-semibold uppercase tracking-wide">Confirmed Bookings</p>
                    <p className="text-4xl font-bold text-emerald-900 mt-3">15</p>
                    <p className="text-emerald-600 text-xs mt-2">This month</p>
                  </div>
                  <div className="bg-white rounded-lg p-3 shadow-sm">
                    <Users size={28} className="text-emerald-600" />
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
