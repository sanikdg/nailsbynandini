import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';
  
  const { login, register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    if (errors.general) setErrors(prev => ({ ...prev, general: '' }));
  };

  // Validate phone number: exactly 10 digits, no consecutive same digits
  const isValidPhone = (phone) => {
    if (!/^\d{10}$/.test(phone)) return false;
    // Check for consecutive same digits (0000000000, 1111111111, etc.)
    if (/(\d)\1{9}/.test(phone)) return false;
    return true;
  };

  // Validate password: at least 6 characters
  const isValidPassword = (password) => {
    return password.length >= 6;
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.email.trim()) newErrors.email = 'Email is required.';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email format is invalid.';
    
    if (!formData.password) newErrors.password = 'Password is required.';
    else if (!isValidPassword(formData.password)) newErrors.password = 'Password must be at least 6 characters.';
    
    if (!isLogin) {
      if (!formData.name.trim()) newErrors.name = 'Full Name is required.';
      if (!formData.phone.trim()) newErrors.phone = 'Phone number is required.';
      else if (!isValidPhone(formData.phone)) newErrors.phone = 'Phone must be exactly 10 digits with no consecutive same digits.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setIsSubmitting(true);
      
      if (isLogin) {
        const result = await login(formData.email, formData.password);
        
        if (result.success) {
          // Automatically route admins to the admin portal if they logged in generally
          const target = location.state?.from?.pathname 
            ? location.state.from.pathname 
            : (result.user?.isAdmin ? '/admin' : '/dashboard');
            
          navigate(target, { replace: true });
        } else {
          setErrors({ general: result.message });
          setIsSubmitting(false);
        }
      } else {
        // Register flow
        const result = await register(formData.name, formData.email, formData.phone, formData.password);
        
        if (result.success) {
          // Show success message and switch to login mode
          setErrors({ general: '' });
          setFormData({ name: '', email: formData.email, phone: '', password: '' });
          setIsLogin(true);
          setIsSubmitting(false);
          // Show a success message
          setErrors({ success: 'Account created successfully! Please log in.' });
          setTimeout(() => {
            setErrors({ success: '' });
          }, 3000);
        } else {
          setErrors({ general: result.message });
          setIsSubmitting(false);
        }
      }
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ name: '', email: '', phone: '', password: '' });
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center -mt-8 py-12 px-4 sm:px-6 lg:px-8 w-full bg-pastel-white/50">
      <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-pastel-pink-light relative overflow-hidden"
      >
        {/* Decorative blur */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-pastel-pink opacity-30 rounded-full blur-3xl pointer-events-none" />
        
        <div className="text-center mb-8 relative z-10">
          <motion.h1 layout className="text-3xl font-bold text-gray-800 tracking-tight">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </motion.h1>
          <motion.p layout className="mt-2 text-gray-600 text-sm">
            {isLogin ? 'Log in to manage your appointments and saved designs.' : 'Sign up to book appointments and save your favorite nail art.'}
          </motion.p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          <AnimatePresence>
            {errors.general && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 text-center">
                {errors.general}
              </motion.div>
            )}
            {errors.success && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium border border-green-100 text-center">
                {errors.success}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                key="name"
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700 ml-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.name ? 'border-red-400' : 'border-gray-200'} focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white`}
                    placeholder="Jane Doe"
                  />
                </div>
                {errors.name && <p className="text-red-500 text-xs pl-2">{errors.name}</p>}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                key="phone"
                initial={{ opacity: 0, height: 0, scale: 0.95 }}
                animate={{ opacity: 1, height: 'auto', scale: 1 }}
                exit={{ opacity: 0, height: 0, scale: 0.95 }}
                className="space-y-1"
              >
                <label className="block text-sm font-medium text-gray-700 ml-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <span className="text-gray-400 font-medium">+91</span>
                  </div>
                  <input 
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    maxLength="10"
                    className={`w-full pl-14 pr-4 py-3 rounded-xl border ${errors.phone ? 'border-red-400' : 'border-gray-200'} focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white`}
                    placeholder="9876543210"
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-xs pl-2">{errors.phone}</p>}
                <p className="text-xs text-gray-500 pl-2">10 digits, no consecutive same digits</p>
              </motion.div>
            )}
          </AnimatePresence>

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
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.email ? 'border-red-400' : 'border-gray-200'} focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white`}
                placeholder="jane@example.com"
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
                className={`w-full pl-11 pr-4 py-3 rounded-xl border ${errors.password ? 'border-red-400' : 'border-gray-200'} focus:border-primary-dark focus:ring-1 focus:ring-primary-dark outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white`}
                placeholder="••••••••"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs pl-2">{errors.password}</p>}
          </motion.div>

          {isLogin && (
            <div className="flex justify-end">
              <button type="button" className="text-sm font-medium text-primary-dark hover:text-primary transition-colors">
                Forgot password?
              </button>
            </div>
          )}

          <motion.div layout className="pt-2">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-dark text-gray-800 hover:text-white py-3 rounded-xl font-bold transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                <>
                  {isLogin ? 'Log In' : 'Sign Up'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </motion.div>
        </form>

        <motion.div layout className="mt-8 text-center border-t border-gray-100 pt-6">
          <p className="text-sm text-gray-600">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              onClick={toggleMode} 
              className="text-primary-dark font-semibold hover:underline"
            >
              {isLogin ? 'Register now' : 'Log in here'}
            </button>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
