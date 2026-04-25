import React, { useState } from 'react';
import { Palette, Calendar, ChevronLeft, ChevronRight, Home, LogOut, Star, Tag, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const AdminSidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'designs', label: 'Manage Designs', icon: Palette },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'custom-requests', label: 'Custom Requests', icon: Sparkles },
    { id: 'testimonials', label: 'Reviews', icon: Star },
    { id: 'offers', label: 'Offers', icon: Tag },
  ];

  const handleBackToWebsite = () => {
    navigate('/');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className={`bg-slate-900 text-white h-screen fixed left-0 top-0 pt-20 shadow-lg transition-all duration-300 ${
      isCollapsed ? 'w-20' : 'w-64'
    }`}>
      {/* Collapse Button */}
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute top-24 -right-3 bg-slate-800 hover:bg-slate-700 text-white rounded-full p-1.5 shadow-md transition"
      >
        {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>

      <div className="p-4 space-y-3 h-full flex flex-col">
        {/* Navigation Tabs */}
        <div className="space-y-2 flex-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-300 hover:bg-slate-800'
                }`}
                title={isCollapsed ? tab.label : ''}
              >
                <Icon size={20} className="flex-shrink-0" />
                {!isCollapsed && <span className="font-medium text-sm">{tab.label}</span>}
              </button>
            );
          })}
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 border-t border-slate-700 pt-3">
          <button
            onClick={handleBackToWebsite}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-slate-800 transition"
            title={isCollapsed ? 'Back to Website' : ''}
          >
            <Home size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Back to Website</span>}
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-slate-300 hover:bg-red-900 transition"
            title={isCollapsed ? 'Logout' : ''}
          >
            <LogOut size={20} className="flex-shrink-0" />
            {!isCollapsed && <span className="font-medium text-sm">Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};
