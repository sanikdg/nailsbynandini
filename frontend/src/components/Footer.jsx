import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock, Heart, Mail, ArrowRight, Sparkles, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const InstagramIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

export const Footer = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await api.get('/settings');
        setSettings(data);
      } catch (error) {
        // Use defaults on failure
      }
    };
    fetchSettings();
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 3000);
    }
  };

  const currentYear = new Date().getFullYear();

  // Dynamic or fallback values
  const salonEmail = settings?.email || 'hello@nailsbynandini.com';
  const salonPhone = settings?.phone || '(555) 123-4567';
  const whatsapp = settings?.whatsapp || '918862024064';
  const addressStreet = settings?.address?.street || '123 Beauty Boulevard, Suite 4A';
  const addressCity = settings?.address?.city || 'Los Angeles';
  const addressState = settings?.address?.state || 'CA';
  const addressZip = settings?.address?.zip || '90015';
  const hours = settings?.businessHours || 'Monday – Sunday, 11:00 AM – 9:00 PM';
  const instagram = settings?.socialLinks?.instagram || 'https://www.instagram.com/';
  const aboutText = settings?.aboutText || 'Premium nail artistry crafted with passion and precision. Every stroke tells a story, every design is a masterpiece tailored just for you.';

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Designs', path: '/designs' },
    { name: 'Custom Design', path: '/custom-design' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const serviceLinks = [
    'Gel Nails',
    'Nail Art',
    'Manicure & Pedicure',
    'Acrylic Extensions',
    'Custom Designs',
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: 'linear-gradient(180deg, #1a1a2e 0%, #16162a 50%, #0f0f1e 100%)' }}>
      {/* Decorative top border */}
      <div className="relative">
        <div className="h-[2px]" style={{ background: 'linear-gradient(90deg, transparent, #f0a8b9, #ffd6e0, #f0a8b9, transparent)' }} />
        <div className="h-[1px] opacity-50" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,214,224,0.3), transparent)' }} />
      </div>

      {/* Decorative background elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-[0.03]" style={{ background: 'radial-gradient(circle, #f0a8b9, transparent)' }} />
        <div className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-[0.02]" style={{ background: 'radial-gradient(circle, #ffd6e0, transparent)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-[0.01]" style={{ background: 'radial-gradient(circle, #f0a8b9, transparent)' }} />
      </div>

      {/* Newsletter Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="relative rounded-2xl p-8 md:p-10 mb-12 border border-white/[0.06]"
          style={{
            background: 'linear-gradient(135deg, rgba(240,168,185,0.08) 0%, rgba(255,214,224,0.04) 50%, rgba(240,168,185,0.08) 100%)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-2">
                <Sparkles className="w-4 h-4 text-[#f0a8b9]" />
                <span className="text-[#f0a8b9] text-xs font-semibold uppercase tracking-[0.2em]">Stay Updated</span>
              </div>
              <h3 className="text-white text-xl md:text-2xl font-semibold mb-1" style={{ fontFamily: "'Outfit', sans-serif" }}>
                Get Exclusive Nail Art Inspiration
              </h3>
              <p className="text-gray-400 text-sm max-w-md">
                Subscribe for the latest designs, seasonal offers, and beauty tips delivered to your inbox.
              </p>
            </div>
            <form onSubmit={handleSubscribe} className="flex w-full md:w-auto gap-0">
              <div className="relative flex-grow md:w-72">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-11 pr-4 py-3.5 bg-white/[0.06] border border-white/[0.1] rounded-l-xl text-white text-sm placeholder:text-gray-500 focus:outline-none focus:border-[#f0a8b9]/50 focus:bg-white/[0.08] transition-all duration-300"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-r-xl font-medium text-sm text-white flex items-center gap-2 transition-all duration-300 hover:shadow-lg shrink-0"
                style={{
                  background: subscribed
                    ? 'linear-gradient(135deg, #25D366, #20bd5a)'
                    : 'linear-gradient(135deg, #c2185b, #9b1b4a)',
                }}
              >
                {subscribed ? (
                  <>
                    <Heart className="w-4 h-4" /> Subscribed!
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" /> Subscribe
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>

        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">

          {/* Brand Column */}
          <div className="lg:col-span-4">
            <Link to="/" className="inline-block mb-5 group">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shadow-lg ring-1 ring-white/10 group-hover:ring-[#f0a8b9]/30 transition-all duration-300 flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #fdfbfb, #f5f0f0)' }}
                >
                  <img
                    src="/sanu/logo.PNG"
                    alt="Nails by Nandini"
                    className="w-full h-full object-contain p-0.5"
                  />
                </div>
                <div>
                  <span className="block text-white font-bold text-lg leading-tight tracking-wide" style={{ fontFamily: "'Outfit', sans-serif" }}>
                    NAILS
                  </span>
                  <span className="block text-[#f0a8b9] text-xs font-medium tracking-[0.15em]">
                    by Nandini
                  </span>
                </div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-xs">
              {aboutText}
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-3">
              <a
                href={instagram}
                target="_blank"
                rel="noreferrer"
                className="group w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] transition-all duration-300 hover:border-transparent hover:shadow-lg"
                style={{ background: 'rgba(255,255,255,0.04)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'linear-gradient(135deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
              >
                <InstagramIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="group w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] hover:border-transparent hover:bg-[#25D366] transition-all duration-300 hover:shadow-lg"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <MessageCircle className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
              <a
                href={`mailto:${salonEmail}`}
                className="group w-10 h-10 rounded-xl flex items-center justify-center border border-white/[0.08] hover:border-transparent hover:bg-[#c2185b] transition-all duration-300 hover:shadow-lg"
                style={{ background: 'rgba(255,255,255,0.04)' }}
              >
                <Mail className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-6 h-[2px] rounded-full bg-[#f0a8b9]" />
              Navigate
            </h4>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="group flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-all duration-300"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all duration-300 text-[#f0a8b9]" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="lg:col-span-2">
            <h4 className="text-white font-semibold text-sm uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-6 h-[2px] rounded-full bg-[#f0a8b9]" />
              Services
            </h4>
            <ul className="space-y-3">
              {serviceLinks.map(service => (
                <li key={service}>
                  <span className="text-gray-400 text-sm hover:text-gray-300 transition-colors cursor-default">
                    {service}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="lg:col-span-4">
            <h4 className="text-white font-semibold text-sm uppercase tracking-[0.15em] mb-5 flex items-center gap-2">
              <span className="w-6 h-[2px] rounded-full bg-[#f0a8b9]" />
              Get In Touch
            </h4>
            <div className="space-y-4">
              <div className="group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-white/[0.06] transition-all duration-300"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(240,168,185,0.1)' }}>
                  <MapPin className="w-4 h-4 text-[#f0a8b9]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Visit Our Studio</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {addressStreet}<br />
                    {addressCity}, {addressState} {addressZip}
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-white/[0.06] transition-all duration-300"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(240,168,185,0.1)' }}>
                  <Clock className="w-4 h-4 text-[#f0a8b9]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Working Hours</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {hours}
                  </p>
                </div>
              </div>

              <div className="group flex items-start gap-3 p-3 rounded-xl border border-transparent hover:border-white/[0.06] transition-all duration-300"
                style={{ background: 'transparent' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(240,168,185,0.1)' }}>
                  <Phone className="w-4 h-4 text-[#f0a8b9]" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-0.5">Contact Us</p>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {salonPhone}<br />
                    {salonEmail}
                  </p>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] mt-1"
                style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
              >
                <MessageCircle className="w-4 h-4" />
                Chat on WhatsApp
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative">
        <div className="h-[1px]" style={{ background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)' }} />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-xs flex items-center gap-1.5">
              © {currentYear} Nails by Nandini. Made with <Heart className="w-3 h-3 text-[#f0a8b9] fill-[#f0a8b9] inline" /> All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors duration-300">Privacy Policy</a>
              <span className="text-gray-700 text-xs">•</span>
              <a href="#" className="text-gray-500 hover:text-gray-300 text-xs transition-colors duration-300">Terms of Service</a>
              <span className="text-gray-700 text-xs">•</span>
              <Link
                to="/admin-login"
                className="inline-flex items-center gap-1.5 text-gray-400 hover:text-white text-xs font-medium transition-all duration-300 px-3 py-1.5 rounded-full border border-white/[0.08] hover:border-[#f0a8b9]/30 hover:bg-white/[0.04]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                Admin Portal
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
