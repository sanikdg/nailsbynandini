import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect unauthenticated users to login page, remember origin history
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Prevent admin users from accessing user dashboard
  if (user.isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

export const AdminRoute = ({ children }) => {
  const { user } = useAuth();
  const location = useLocation();
  
  if (!user) {
    // Redirect unauthenticated users to admin login page
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  if (user.isAdmin !== true) {
    // Force non-admin users back to home
    return <Navigate to="/" replace />;
  }

  return children;
};
