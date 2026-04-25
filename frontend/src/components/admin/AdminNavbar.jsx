import React from 'react';
import { useAuth } from '../../context/AuthContext';

export const AdminNavbar = () => {
  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
    </nav>
  );
};
