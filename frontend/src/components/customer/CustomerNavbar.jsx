import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const CustomerNavbar = () => {
  const { user } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Customer Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user?.name?.split(' ')[0]}</span>
        </div>
      </div>
    </nav>
  );
};
