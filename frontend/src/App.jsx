import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';

import MainLayout from './layouts/MainLayout';
import { Home } from './pages/Home';
import { Designs } from './pages/Designs';
import { About } from './pages/About';
import { Contact } from './pages/Contact';
import { Auth } from './pages/Auth';
import { AdminLogin } from './pages/AdminLogin';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { CustomerDashboard } from './pages/customer/CustomerDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Admin Routes */}
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin" element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          } />

          {/* Customer Dashboard */}
          <Route path="/dashboard/*" element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          {/* Public Routes (MainLayout: Navbar + Footer) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Home />} />
            <Route path="designs" element={<Designs />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
            <Route path="auth" element={<Auth />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
