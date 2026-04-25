import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'Designs', path: '/designs' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-pastel-white/80 backdrop-blur-md shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/sanu/logo.PNG"
              alt="Nails by Nandini"
              className="h-12 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8">
            {links.map((link) => (
              <NavLink
                key={link.name}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-primary-dark border-b-2 border-primary-dark'
                      : 'text-gray-600 hover:text-primary-dark'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Right side actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <Link
                to="/dashboard"
                title="Client Dashboard"
                className="text-gray-600 hover:text-primary-dark p-2 hover:bg-primary/20 rounded-full transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </Link>
            )}
            {user ? (
              <button
                onClick={() => logout()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Logout
              </button>
            ) : (
              <Link
                to="/auth"
                className="bg-primary hover:bg-primary-dark text-gray-800 hover:text-white px-6 py-2.5 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-600 hover:text-primary-dark focus:outline-none transition-colors"
            >
              {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-t border-gray-100 overflow-hidden"
          >
            <div className="flex flex-col px-4 pt-2 pb-6 space-y-4 shadow-lg">
              {links.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary-dark'
                        : 'text-gray-600 hover:bg-pastel-pink-light hover:text-primary-dark'
                    }`
                  }
                >
                  {link.name}
                </NavLink>
              ))}
              {user && (
                <NavLink
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-primary/20 text-primary-dark'
                        : 'text-gray-600 hover:bg-pastel-pink-light hover:text-primary-dark'
                    }`
                  }
                >
                  Dashboard
                </NavLink>
              )}
              <div className="pt-4 border-t border-gray-100">
                {user ? (
                  <button
                    onClick={() => {
                      logout();
                      setIsOpen(false);
                    }}
                    className="block text-center w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-3 rounded-full font-medium transition-all duration-300"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    to="/auth"
                    onClick={() => setIsOpen(false)}
                    className="block text-center w-full bg-primary hover:bg-primary-dark text-gray-800 hover:text-white px-6 py-3 rounded-full font-medium transition-all duration-300"
                  >
                    Login / Register
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
