import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, Check, Sparkles, ArrowRight, Eye, Grid3X3, LayoutGrid, Send, Calendar, Loader2, CheckCircle2, CalendarPlus } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import API_URL from '../config';

// All images from the /sanu folder in public
const SANU_IMAGES = [
  { id: 1, src: '/sanu/hand1.jpeg', title: 'Elegant Rose', category: 'Bridal' },
  { id: 2, src: '/sanu/hand10.jpeg', title: 'Classic French', category: 'Minimal' },
  { id: 3, src: '/sanu/hand4.jpeg', title: 'Golden Hour', category: 'Trendy' },
  { id: 4, src: '/sanu/hand5.jpeg', title: 'Pastel Dreams', category: 'Minimal' },
  { id: 5, src: '/sanu/hand6.jpeg', title: 'Cherry Blossom', category: 'Abstract' },
  { id: 6, src: '/sanu/hand7.jpeg', title: 'Midnight Glam', category: 'Trendy' },
  { id: 7, src: '/sanu/hand8.jpeg', title: 'Pearl Essence', category: 'Bridal' },
  { id: 8, src: '/sanu/hand9.jpeg', title: 'Ocean Breeze', category: 'Abstract' },
  { id: 9, src: '/sanu/hand11.jpeg', title: 'Lavender Dawn', category: 'Minimal' },
  { id: 10, src: '/sanu/hand12.jpeg', title: 'Sunset Ombré', category: 'Trendy' },
  { id: 11, src: '/sanu/hand13.jpeg', title: 'Crystal Frost', category: 'Bridal' },
  { id: 12, src: '/sanu/hand14.jpeg', title: 'Velvet Touch', category: 'Abstract' },
  { id: 13, src: '/sanu/hand15.jpeg', title: 'Blush Romance', category: 'Bridal' },
  { id: 14, src: '/sanu/hand16.jpeg', title: 'Mocha Swirl', category: 'Trendy' },
  { id: 15, src: '/sanu/hnad17.jpeg', title: 'Fairy Dust', category: 'Abstract' },
  { id: 16, src: '/sanu/hand18.jpeg', title: 'Silver Lining', category: 'Minimal' },
  { id: 17, src: '/sanu/hand20.jpeg', title: 'Berry Bliss', category: 'Trendy' },
  { id: 18, src: '/sanu/hnad19.jpeg', title: 'Marble Queen', category: 'Abstract' },
  { id: 19, src: '/sanu/hand21.jpeg', title: 'Champagne Toast', category: 'Bridal' },
  { id: 20, src: '/sanu/hand22.jpeg', title: 'Nude Luxe', category: 'Minimal' },
  { id: 21, src: '/sanu/hand23.jpeg', title: 'Royal Plum', category: 'Trendy' },
  { id: 22, src: '/sanu/hand24.jpeg', title: 'Coral Reef', category: 'Abstract' },
  { id: 23, src: '/sanu/hand25.jpeg', title: 'Mauve Magic', category: 'Minimal' },
  { id: 24, src: '/sanu/hand26.jpeg', title: 'Starlight Kiss', category: 'Bridal' },
  { id: 25, src: '/sanu/hand27.jpeg', title: 'Autumn Glow', category: 'Trendy' },
  { id: 26, src: '/sanu/hand28.jpeg', title: 'Cotton Candy', category: 'Abstract' },
  { id: 27, src: '/sanu/hand29.jpeg', title: 'Honey Drip', category: 'Minimal' },
  { id: 28, src: '/sanu/hand31.jpeg', title: 'Diamond Dust', category: 'Bridal' },
];

const CATEGORIES = ['All', 'Bridal', 'Minimal', 'Trendy', 'Abstract'];

/* ── Reusable fade-up animation wrapper ── */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

/* ── Stagger heights for masonry-like effect ── */
const getCardHeight = (index) => {
  const heights = ['h-72', 'h-80', 'h-96', 'h-72', 'h-96', 'h-80', 'h-80', 'h-72', 'h-96'];
  return heights[index % heights.length];
};

export const Designs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const galleryRef = useRef(null);

  const [allDesigns, setAllDesigns] = useState(SANU_IMAGES);
  const [activeFilter, setActiveFilter] = useState('All');
  const [visibleCount, setVisibleCount] = useState(9);
  const [savedDesignIds, setSavedDesignIds] = useState(new Set());
  const [saveMessage, setSaveMessage] = useState('');
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'masonry'

  // "Get This Design" inquiry modal state
  const [inquiryDesign, setInquiryDesign] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({ description: '', date: '' });
  const [inquirySubmitting, setInquirySubmitting] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);
  const [inquiryError, setInquiryError] = useState('');

  // Fetch designs from API and merge with hardcoded
  useEffect(() => {
    const fetchDesigns = async () => {
      try {
        const { data } = await api.get('/designs');
        if (data.length > 0) {
          const getImgSrc = (img) => {
            if (!img) return '/sanu/hand5.jpeg';
            if (img.startsWith('/uploads/')) return `${API_URL}${img}`;
            return img;
          };
          const apiDesigns = data.map((d) => ({
            id: `api-${d._id}`,
            _id: d._id,
            src: getImgSrc(d.image),
            title: d.title,
            category: d.category || 'Misc',
            price: d.price,
            fromApi: true,
          }));
          // API designs first, then hardcoded ones
          setAllDesigns([...apiDesigns, ...SANU_IMAGES]);
        }
      } catch (error) {
        // Keep hardcoded fallback on error
      }
    };
    fetchDesigns();
  }, []);

  // Load user's saved designs on mount
  useEffect(() => {
    if (!user) return;
    const fetchSavedDesigns = async () => {
      try {
        const { data } = await api.get('/saved-designs');
        const ids = new Set(data.map(s => s.designId?._id || s.designId).filter(Boolean));
        setSavedDesignIds(ids);
      } catch (err) {
        console.error('Failed to load saved designs:', err);
      }
    };
    fetchSavedDesigns();
  }, [user]);

  const filteredDesigns = allDesigns.filter(design =>
    activeFilter === 'All' ? true : design.category === activeFilter
  );

  const displayedDesigns = filteredDesigns.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDesigns.length;

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 6);
  };

  const closeModal = () => {
    setSelectedDesign(null);
  };

  const handleDiscuss = (e, design) => {
    if (e) e.stopPropagation();
    if (!user) {
      navigate('/auth', { state: { from: '/designs' } });
      return;
    }
    // Open the inquiry modal with the selected design
    const targetDesign = design || selectedDesign;
    if (targetDesign) {
      setInquiryDesign(targetDesign);
      setInquiryForm({ description: '', date: '' });
      setInquirySubmitted(false);
      setInquiryError('');
      setSelectedDesign(null); // close lightbox if open
    }
  };

  const closeInquiryModal = () => {
    setInquiryDesign(null);
    setInquiryForm({ description: '', date: '' });
    setInquirySubmitted(false);
    setInquiryError('');
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.description.trim()) {
      setInquiryError('Please describe what you would like.');
      return;
    }
    try {
      setInquirySubmitting(true);
      setInquiryError('');
      const payload = {
        description: `Design Request: "${inquiryDesign.title}" (${inquiryDesign.category})\n\n${inquiryForm.description}`,
        image: inquiryDesign.src,
      };
      if (inquiryForm.date) {
        payload.preferredDate = inquiryForm.date;
      }
      const { data: inquiryData } = await api.post('/inquiries', payload);
      const { data: conversationData } = await api.post('/conversations', { inquiryId: inquiryData._id });
      setInquirySubmitted(true);
      setTimeout(() => {
        closeInquiryModal();
        navigate(`/consultation/${conversationData._id}`);
      }, 1800);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      setInquiryError('Something went wrong. Please try again.');
    } finally {
      setInquirySubmitting(false);
    }
  };

  const handleSave = async (e, design) => {
    if (e) e.stopPropagation();
    if (!user) {
      navigate('/auth', { state: { from: '/designs' } });
      return;
    }

    try {
      // Use the ensure endpoint — finds by title or creates (works for regular users)
      const { data: dbDesign } = await api.post('/designs/ensure', {
        title: design.title,
        image: design.src,
        category: design.category,
        price: 0
      });

      if (savedDesignIds.has(dbDesign._id)) {
        await api.delete(`/saved-designs/${dbDesign._id}`);
        setSavedDesignIds(prev => {
          const next = new Set(prev);
          next.delete(dbDesign._id);
          return next;
        });
        setSaveMessage('Removed from wishlist');
      } else {
        await api.post('/saved-designs', { designId: dbDesign._id });
        setSavedDesignIds(prev => new Set(prev).add(dbDesign._id));
        setSaveMessage('Saved to wishlist!');
      }

      setTimeout(() => setSaveMessage(''), 2000);
    } catch (err) {
      console.error('Failed to save design:', err);
      if (err.response?.data?.message === 'Design already saved') {
        setSaveMessage('Already in your wishlist!');
        setTimeout(() => setSaveMessage(''), 2000);
      }
    }
  };

  // Book This Design: ensures design exists in DB, then redirects to booking page
  const handleBookDesign = async (e, design) => {
    if (e) e.stopPropagation();
    if (!user) {
      navigate('/auth', { state: { from: '/designs' } });
      return;
    }
    try {
      // Ensure design exists in the database (creates if it doesn't)
      const { data: dbDesign } = await api.post('/designs/ensure', {
        title: design.title,
        image: design.src || design.image,
        category: design.category,
        price: design.price || 0,
      });
      closeModal();
      navigate('/dashboard/book', { state: { selectedDesign: dbDesign } });
    } catch (err) {
      console.error('Failed to ensure design:', err);
      // Fallback: navigate with whatever data we have
      closeModal();
      navigate('/dashboard/book', { state: { selectedDesign: design } });
    }
  };

  const navigateLightbox = useCallback((direction) => {
    if (!selectedDesign) return;
    const currentIndex = filteredDesigns.findIndex(d => d.id === selectedDesign.id);
    let nextIndex = currentIndex + direction;
    if (nextIndex < 0) nextIndex = filteredDesigns.length - 1;
    if (nextIndex >= filteredDesigns.length) nextIndex = 0;
    setSelectedDesign(filteredDesigns[nextIndex]);
  }, [selectedDesign, filteredDesigns]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!selectedDesign) return;
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDesign, navigateLightbox]);

  const scrollToGallery = () => {
    galleryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const categoryCount = (cat) =>
    cat === 'All' ? allDesigns.length : allDesigns.filter(d => d.category === cat).length;

  return (
    <div className="w-full flex flex-col bg-white overflow-x-hidden">

      {/* ═══════════ 1. HERO BANNER ═══════════ */}
      <section className="relative bg-pastel-pink-light overflow-hidden">
        {/* Decorative blurs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-pastel-pink/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-pastel-pink/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pastel-pink-dark/5 rounded-full blur-3xl pointer-events-none" />

        {/* Floating particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-pastel-pink-dark/10"
              style={{
                width: 4 + Math.random() * 10,
                height: 4 + Math.random() * 10,
                left: `${10 + Math.random() * 80}%`,
                top: `${10 + Math.random() * 80}%`,
              }}
              animate={{
                y: [0, -25, 0],
                opacity: [0.2, 0.6, 0.2],
              }}
              transition={{
                duration: 4 + Math.random() * 3,
                repeat: Infinity,
                delay: i * 0.7,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">

            {/* Left: Text */}
            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <motion.span
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="inline-block text-pastel-pink-dark text-sm font-semibold tracking-[0.2em] uppercase mb-5"
              >
                ✦ Design Gallery
              </motion.span>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]"
              >
                Explore Our{' '}
                <span className="relative inline-block">
                  Collection
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-2.5 bg-pastel-pink/50 rounded-full -z-10"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg mx-auto lg:mx-0 leading-relaxed font-light"
              >
                Browse through our curated portfolio of handcrafted nail artistry.
                Every design tells a story — find yours.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-10 flex flex-row gap-4 justify-center lg:justify-start"
              >
                <button
                  onClick={scrollToGallery}
                  className="px-8 py-3.5 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Browse Gallery
                </button>
                <Link
                  to="/dashboard/custom-design"
                  className="px-8 py-3.5 bg-transparent border-2 border-[#9b1b4a] text-[#9b1b4a] hover:bg-[#9b1b4a] hover:text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Custom Design
                </Link>
              </motion.div>

              {/* Quick stats */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.65 }}
                className="mt-12 flex gap-8 md:gap-12 justify-center lg:justify-start"
              >
                {[
                  { number: `${SANU_IMAGES.length}+`, label: 'Designs' },
                  { number: `${CATEGORIES.length - 1}`, label: 'Categories' },
                  { number: '100%', label: 'Handcrafted' },
                ].map((stat, i) => (
                  <div key={i} className="text-center lg:text-left">
                    <motion.p
                      className="text-2xl md:text-3xl font-bold text-gray-900"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.75 + i * 0.12 }}
                    >
                      {stat.number}
                    </motion.p>
                    <p className="text-xs text-gray-500 mt-1 tracking-wide uppercase">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Featured image collage */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="w-full lg:w-1/2 relative"
            >
              <div className="grid grid-cols-12 gap-3 max-w-lg mx-auto lg:ml-auto">
                {/* Main large image */}
                <motion.div
                  className="col-span-7 rounded-2xl overflow-hidden shadow-xl cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedDesign(SANU_IMAGES[0])}
                >
                  <img
                    src="/sanu/hand1.jpeg"
                    alt="Featured nail art"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </motion.div>

                {/* Top-right stacked */}
                <motion.div
                  className="col-span-5 rounded-2xl overflow-hidden shadow-xl mt-8 cursor-pointer"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedDesign(SANU_IMAGES[6])}
                >
                  <img
                    src="/sanu/hand8.jpeg"
                    alt="Featured nail art"
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </motion.div>

                {/* Wide bottom */}
                <motion.div
                  className="col-span-12 rounded-2xl overflow-hidden shadow-xl -mt-4 cursor-pointer"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedDesign(SANU_IMAGES[12])}
                >
                  <img
                    src="/sanu/hand15.jpeg"
                    alt="Featured nail art"
                    className="w-full h-40 md:h-48 object-cover"
                  />
                </motion.div>
              </div>

              {/* Floating accent badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.1, duration: 0.5 }}
                className="absolute -bottom-3 -left-2 md:left-4 bg-white rounded-2xl shadow-xl p-4 z-20 border border-pastel-pink-light"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-pastel-pink flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-[#9b1b4a]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Handcrafted Art</p>
                    <p className="text-xs text-gray-500">Unique creations</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ 2. CATEGORY STATS BAR ═══════════ */}
      <section className="bg-[#2d2d3a] py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-8">
            {CATEGORIES.map((cat, i) => (
              <FadeUp key={cat} delay={i * 0.08} className="text-center">
                <button
                  onClick={() => {
                    setActiveFilter(cat);
                    setVisibleCount(9);
                    setTimeout(scrollToGallery, 100);
                  }}
                  className="w-full group"
                >
                  <p className="text-2xl md:text-3xl font-bold text-white mb-1 group-hover:text-pastel-pink transition-colors duration-300">
                    {categoryCount(cat)}
                  </p>
                  <p className="text-sm text-gray-400 uppercase tracking-wider group-hover:text-gray-300 transition-colors duration-300">
                    {cat === 'All' ? 'Total Designs' : cat}
                  </p>
                </button>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 3. GALLERY SECTION ═══════════ */}
      <section ref={galleryRef} className="py-16 md:py-24 bg-pastel-pink-light/20 scroll-mt-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header + Filter Controls */}
          <FadeUp className="mb-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <span className="inline-block text-pastel-pink-dark text-xs font-semibold tracking-[0.2em] uppercase mb-3">
                  Our Portfolio
                </span>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                  Browse{' '}
                  <span className="relative inline-block">
                    Designs
                    <motion.span
                      className="absolute -bottom-1 left-0 w-full h-2 bg-pastel-pink/40 rounded-full -z-10"
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.3 }}
                      style={{ originX: 0 }}
                    />
                  </span>
                </h2>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'grid'
                      ? 'bg-[#9b1b4a] text-white shadow-md'
                      : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }`}
                  title="Grid View"
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('masonry')}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === 'masonry'
                      ? 'bg-[#9b1b4a] text-white shadow-md'
                      : 'bg-white text-gray-500 hover:bg-gray-100 border border-gray-200'
                  }`}
                  title="Masonry View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </FadeUp>

          {/* Filter Chips */}
          <FadeUp className="mb-10">
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(category => (
                <button
                  key={category}
                  onClick={() => {
                    setActiveFilter(category);
                    setVisibleCount(9);
                  }}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeFilter === category
                      ? 'bg-[#9b1b4a] text-white shadow-lg shadow-[#9b1b4a]/25'
                      : 'bg-white text-gray-600 hover:bg-pastel-pink-light border border-gray-200 hover:border-pastel-pink hover:text-gray-800 shadow-sm'
                  }`}
                >
                  {category}
                  <span className={`ml-2 text-xs ${
                    activeFilter === category ? 'text-white/70' : 'text-gray-400'
                  }`}>
                    {categoryCount(category)}
                  </span>
                </button>
              ))}
            </div>
          </FadeUp>

          {/* Design Grid */}
          <motion.div
            layout
            className={`${
              viewMode === 'masonry'
                ? 'columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5'
                : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6'
            }`}
          >
            <AnimatePresence mode="popLayout">
              {displayedDesigns.map((design, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4, delay: index * 0.04 }}
                  key={design.id}
                  onClick={() => setSelectedDesign(design)}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer bg-white shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-500 ${
                    viewMode === 'masonry'
                      ? 'break-inside-avoid'
                      : 'aspect-[4/5]'
                  }`}
                  style={viewMode === 'masonry' ? {} : {}}
                >
                  <div className={`w-full overflow-hidden ${
                    viewMode === 'masonry' ? getCardHeight(index) : 'h-full'
                  }`}>
                    <img
                      src={design.src}
                      alt={design.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />
                  </div>

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />

                  {/* Category badge — always visible */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-wider text-gray-700 shadow-sm">
                      {design.category}
                    </span>
                  </div>

                  {/* Bottom info on hover */}
                  <div className="absolute inset-x-0 bottom-0 p-5 flex items-end justify-between opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-3 group-hover:translate-y-0 text-white z-10">
                    <div>
                      <h3 className="text-lg font-semibold drop-shadow-lg">{design.title}</h3>
                      <p className="text-xs text-white/70 mt-0.5">Click to view details</p>
                    </div>
                  </div>

                  {/* Action Buttons on hover */}
                  <div className="absolute top-3 right-3 z-10 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
                    <button
                      onClick={(e) => handleBookDesign(e, design)}
                      className="bg-green-500/90 hover:bg-green-600 text-white p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                      title="Book This Design"
                    >
                      <CalendarPlus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleSave(e, design)}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                      title="Save Design"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDesign(design);
                      }}
                      className="bg-white/90 hover:bg-white text-gray-800 p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                      title="Quick View"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleDiscuss(e, design)}
                      className="bg-[#9b1b4a]/90 hover:bg-[#9b1b4a] text-white p-2.5 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                      title="Get This Design"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {displayedDesigns.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24"
            >
              <div className="w-20 h-20 rounded-full bg-pastel-pink-light flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-[#9b1b4a]" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No designs found</h3>
              <p className="text-gray-500">Try selecting a different category to explore more designs.</p>
            </motion.div>
          )}

          {/* Load More */}
          {hasMore && (
            <FadeUp className="pt-12 text-center">
              <button
                onClick={handleLoadMore}
                className="group inline-flex items-center gap-3 bg-white border-2 border-[#9b1b4a] hover:bg-[#9b1b4a] text-[#9b1b4a] hover:text-white px-10 py-4 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Load More Designs
                <span className="text-sm opacity-70">({filteredDesigns.length - visibleCount} remaining)</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </button>
            </FadeUp>
          )}
        </div>
      </section>

      {/* ═══════════ 4. CUSTOM DESIGN CTA ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/sanu/hand31.jpeg"
            alt="Beautiful nails"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/55 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 py-24 md:py-32 text-center px-4">
          <FadeUp>
            <span className="inline-block text-pastel-pink text-sm font-semibold tracking-[0.2em] uppercase mb-6">
              ✦ Your Vision, Our Craft
            </span>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight mb-6"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif", fontStyle: 'italic' }}
            >
              Didn't Find What You Love?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Let's create something uniquely yours. Share your inspiration and we'll craft your dream nails.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard/custom-design"
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Custom Design <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
              >
                Contact Us
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>

      {/* ═══════════ LIGHTBOX MODAL ═══════════ */}
      <AnimatePresence>
        {selectedDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-gray-900/75 backdrop-blur-lg"
            />

            {/* Navigation arrows */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-3 md:left-8 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all border border-white/10"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-3 md:right-8 z-20 p-3 rounded-full bg-white/15 hover:bg-white/30 text-white backdrop-blur-md transition-all border border-white/10"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Image counter */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md text-white text-sm font-medium border border-white/10">
              {filteredDesigns.findIndex(d => d.id === selectedDesign.id) + 1} / {filteredDesigns.length}
            </div>

            {/* Modal content */}
            <motion.div
              key={selectedDesign.id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
            >
              {/* Modal Image */}
              <div className="w-full md:w-3/5 h-72 md:h-[600px] relative overflow-hidden">
                <img
                  src={selectedDesign.src}
                  alt={selectedDesign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/5" />
              </div>

              {/* Modal Content */}
              <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center relative bg-gradient-to-b from-white to-pastel-pink-light/20">
                <button
                  onClick={closeModal}
                  className="absolute top-5 right-5 p-2.5 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <span className="inline-block px-3.5 py-1.5 rounded-full bg-pastel-pink-light text-[#9b1b4a] text-xs font-semibold uppercase tracking-wider mb-5 w-fit">
                  {selectedDesign.category}
                </span>

                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
                  {selectedDesign.title}
                </h2>

                <p className="text-gray-500 text-base leading-relaxed mb-4">
                  A stunning handcrafted nail design from our exclusive collection. Each set is meticulously created to match your unique style.
                </p>

                {/* Detail badges */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {['Gel Polish', 'Long Lasting', 'Nail Safe'].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 text-xs font-medium text-gray-600">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={(e) => handleBookDesign(e, selectedDesign)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <Calendar className="w-5 h-5" />
                    Book This Design
                  </button>
                  <button
                    onClick={(e) => handleDiscuss(e, selectedDesign)}
                    className="bg-[#9b1b4a] hover:bg-[#7d1640] text-white px-6 py-4 rounded-xl font-medium transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get This Design
                  </button>
                  <button
                    onClick={(e) => handleSave(e, selectedDesign)}
                    className="border-2 border-gray-200 hover:border-[#9b1b4a] text-gray-700 hover:text-[#9b1b4a] px-6 py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                  >
                    <Heart className="w-5 h-5" />
                    Save to Wishlist
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ═══════════ TOAST NOTIFICATION ═══════════ */}
      <AnimatePresence>
        {saveMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[60] bg-gray-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-2 text-sm font-medium border border-white/10"
          >
            <Check className="w-4 h-4 text-green-400" />
            {saveMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══════════ GET THIS DESIGN INQUIRY MODAL ═══════════ */}
      <AnimatePresence>
        {inquiryDesign && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeInquiryModal}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-lg"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh]"
            >
              {/* Left: Design Image */}
              <div className="w-full md:w-1/2 h-56 md:h-auto relative overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={inquiryDesign.src}
                  alt={inquiryDesign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-white/10" />
                <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[11px] font-semibold uppercase tracking-wider text-gray-700 mb-2">
                    {inquiryDesign.category}
                  </span>
                  <h3 className="text-xl font-bold text-white drop-shadow-lg">{inquiryDesign.title}</h3>
                </div>
              </div>

              {/* Right: Form */}
              <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col overflow-y-auto">
                <button
                  onClick={closeInquiryModal}
                  className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors z-20"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <AnimatePresence mode="wait">
                  {!inquirySubmitted ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Get This Design</h2>
                        <p className="text-sm text-gray-500">Tell us about your preferences and we'll get back to you.</p>
                      </div>

                      <form onSubmit={handleInquirySubmit} className="space-y-5 flex-1">
                        {/* Description */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Your Preferences / Notes <span className="text-red-400">*</span>
                          </label>
                          <textarea
                            value={inquiryForm.description}
                            onChange={(e) => {
                              setInquiryForm(prev => ({ ...prev, description: e.target.value }));
                              if (inquiryError) setInquiryError('');
                            }}
                            rows={4}
                            className="w-full rounded-xl border border-gray-200 p-4 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all placeholder:text-gray-400 text-gray-700 bg-gray-50 focus:bg-white resize-none text-sm"
                            placeholder="E.g. I'd like this design with matte finish, shorter length, rose gold accents..."
                          />
                        </div>

                        {/* Preferred Date */}
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#9b1b4a]" />
                              Preferred Date <span className="text-gray-400 font-normal">(Optional)</span>
                            </div>
                          </label>
                          <input
                            type="date"
                            value={inquiryForm.date}
                            onChange={(e) => setInquiryForm(prev => ({ ...prev, date: e.target.value }))}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full p-3 rounded-xl border border-gray-200 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all text-gray-700 bg-gray-50 focus:bg-white text-sm"
                          />
                        </div>

                        {/* Error */}
                        {inquiryError && (
                          <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{inquiryError}</p>
                        )}

                        {/* Submit */}
                        <button
                          type="submit"
                          disabled={inquirySubmitting}
                          className="w-full bg-[#9b1b4a] hover:bg-[#7d1640] text-white py-3.5 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                        >
                          {inquirySubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                          ) : (
                            <>
                              <Send className="w-4 h-4" />
                              Send Request
                            </>
                          )}
                        </button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex-1 flex flex-col items-center justify-center text-center py-8"
                    >
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-5">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">Request Sent!</h3>
                      <p className="text-gray-500 text-sm mb-4">Redirecting you to chat with our artist...</p>
                      <Loader2 className="w-6 h-6 animate-spin text-[#9b1b4a]" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
