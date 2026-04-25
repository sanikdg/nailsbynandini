import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid.';
    
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        // Check if user is admin
        if (result.user?.isAdmin) {
          navigate('/admin', { replace: true });
        } else {
          setErrors({ general: 'Access denied. Admin privileges required.' });
        }
      } else {
        setErrors({ general: result.message });
      }
    } catch (error) {
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 w-full bg-gradient-to-br from-gray-900 to-gray-800">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2rem] shadow-2xl border border-gray-200 relative overflow-hidden"
      >
        {/* Decorative blur */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary opacity-10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-dark rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 tracking-tight">Admin Portal</h1>
          <p className="mt-2 text-gray-600 text-sm">Secure access for administrators only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {errors.general && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }} 
              className="p-4 bg-red-50 text-red-700 rounded-lg text-sm font-medium border border-red-200 flex items-center gap-2"
            >
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {errors.general}
            </motion.div>
          )}

          <motion.div layout className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white`}
                placeholder="admin@nailsalon.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs pl-2">{errors.email}</p>}
          </motion.div>

          <motion.div layout className="space-y-1">
            <label className="block text-sm font-medium text-gray-700 ml-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input 
                type="password" 
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password}</p>}
          </motion.div>

          <motion.div layout className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-primary to-primary-dark hover:shadow-lg text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md disabled:opacity-70 disabled:cursor-not-allowed transform hover:-translate-y-0.5"
            >
              {isSubmitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div layout className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            Not an admin? 
            <button 
              onClick={() => navigate('/')}
              className="text-primary-dark font-semibold hover:underline ml-1"
            >
              Go to home
            </button>
          </p>
        </motion.div>

        {/* Security badge */}
        <div className="mt-6 pt-6 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Secure Admin Access
          </p>
        </div>
      </motion.div>
    </div>
  );
};
