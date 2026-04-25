import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, X, ChevronLeft, ChevronRight, Send, Calendar, Loader2, CheckCircle2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState, useCallback, useEffect } from 'react';
import api from '../../services/api';
import API_URL from '../../config';

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
  { id: 9, src: '/sanu/hand10.jpeg', title: 'Lavender Dawn', category: 'Minimal' },
  { id: 10, src: '/sanu/hand11.jpeg', title: 'Sunset Ombré', category: 'Trendy' },
  { id: 11, src: '/sanu/hand12.jpeg', title: 'Crystal Frost', category: 'Bridal' },
  { id: 12, src: '/sanu/hand13.jpeg', title: 'Velvet Touch', category: 'Abstract' },
  { id: 13, src: '/sanu/hand14.jpeg', title: 'Blush Romance', category: 'Bridal' },
  { id: 14, src: '/sanu/hand15.jpeg', title: 'Mocha Swirl', category: 'Trendy' },
  { id: 15, src: '/sanu/hand16.jpeg', title: 'Fairy Dust', category: 'Abstract' },
  { id: 16, src: '/sanu/hnad17.jpeg', title: 'Silver Lining', category: 'Minimal' },
  { id: 17, src: '/sanu/hand18.jpeg', title: 'Berry Bliss', category: 'Trendy' },
  { id: 18, src: '/sanu/hnad19.jpeg', title: 'Marble Queen', category: 'Abstract' },
  { id: 19, src: '/sanu/hand20.jpeg', title: 'Champagne Toast', category: 'Bridal' },
  { id: 20, src: '/sanu/hand21.jpeg', title: 'Nude Luxe', category: 'Minimal' },
  { id: 21, src: '/sanu/hand22.jpeg', title: 'Royal Plum', category: 'Trendy' },
  { id: 22, src: '/sanu/hand23.jpeg', title: 'Coral Reef', category: 'Abstract' },
  { id: 23, src: '/sanu/hand24.jpeg', title: 'Mauve Magic', category: 'Minimal' },
  { id: 24, src: '/sanu/hand25.jpeg', title: 'Starlight Kiss', category: 'Bridal' },
  { id: 25, src: '/sanu/hand26.jpeg', title: 'Autumn Glow', category: 'Trendy' },
  { id: 26, src: '/sanu/hand27.jpeg', title: 'Cotton Candy', category: 'Abstract' },
  { id: 27, src: '/sanu/hand28.jpeg', title: 'Honey Drip', category: 'Minimal' },
  { id: 28, src: '/sanu/hand29.jpeg', title: 'Jade Garden', category: 'Trendy' },
  { id: 29, src: '/sanu/hand31.jpeg', title: 'Diamond Dust', category: 'Bridal' },
];

const CATEGORIES = ['All', 'Bridal', 'Minimal', 'Trendy', 'Abstract'];

export const FeaturedDesigns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [allDesigns, setAllDesigns] = useState(SANU_IMAGES);
  const [visibleCount, setVisibleCount] = useState(6);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedDesign, setSelectedDesign] = useState(null);

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
            // If it's a local upload path, prepend the API URL
            if (img.startsWith('/uploads/')) return `${API_URL}${img}`;
            // If it's already a full URL, use as-is
            if (img.startsWith('http')) return img;
            // Otherwise treat as relative path
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
        console.error('Failed to fetch designs:', error);
        // Keep hardcoded fallback on error
      }
    };
    fetchDesigns();
  }, []);

  const filteredDesigns = allDesigns.filter(d =>
    activeFilter === 'All' ? true : d.category === activeFilter
  );

  const displayedDesigns = filteredDesigns.slice(0, visibleCount);
  const hasMore = visibleCount < filteredDesigns.length;

  const handleAction = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth', { state: { from: location } });
    } else {
      alert('Design saved!');
    }
  };

  const handleDiscuss = (e, design) => {
    e.stopPropagation();
    if (!user) {
      navigate('/auth', { state: { from: location } });
      return;
    }
    // Open the inquiry modal with the selected design
    const targetDesign = design || selectedDesign;
    if (targetDesign) {
      setInquiryDesign(targetDesign);
      setInquiryForm({ description: '', date: '' });
      setInquirySubmitted(false);
      setInquiryError('');
      setSelectedDesign(null);
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

  const openLightbox = (design) => setSelectedDesign(design);
  const closeLightbox = () => setSelectedDesign(null);

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
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
      if (e.key === 'ArrowRight') navigateLightbox(1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDesign, navigateLightbox]);

  return (
    <section id="designs-section" className="py-20 bg-gray-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pastel-pink-light text-pastel-pink-dark text-xs font-semibold uppercase tracking-widest mb-4">
            Portfolio
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-800 tracking-tight">
            Our Nail Art Collection
          </h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
            Handcrafted with love — browse our signature designs and find your next inspiration.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-14"
        >
          {CATEGORIES.map(category => (
            <button
              key={category}
              onClick={() => {
                setActiveFilter(category);
                setVisibleCount(6);
              }}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
                activeFilter === category
                  ? 'bg-pastel-pink-dark text-white shadow-lg shadow-pastel-pink-dark/30'
                  : 'bg-white text-gray-600 hover:bg-pastel-pink-light border border-gray-200 hover:border-pastel-pink hover:text-gray-800 shadow-sm'
              }`}
            >
              {category}
            </button>
          ))}
        </motion.div>

        {/* Designs Grid */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {displayedDesigns.map((design, index) => (
              <motion.div
                layout
                key={design.id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => openLightbox(design)}
                className="group relative overflow-hidden rounded-3xl cursor-pointer shadow-sm hover:shadow-xl border border-pastel-pink-light/60 bg-white aspect-[4/5] transition-shadow duration-300"
              >
                <img
                  src={design.src}
                  alt={design.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                />

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Bottom info */}
                <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0 text-white">
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-pastel-pink mb-1.5">
                    {design.category}
                  </span>
                  <h3 className="text-xl font-semibold">{design.title}</h3>
                </div>

                {/* Action buttons */}
                <div className="absolute inset-0 bg-black/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <button
                    onClick={handleAction}
                    className="bg-white/90 hover:bg-white text-gray-900 p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                    title="Save Design"
                  >
                    <Heart className="w-5 h-5" />
                  </button>
                  <button
                    onClick={(e) => handleDiscuss(e, design)}
                    className="bg-pastel-pink/90 hover:bg-pastel-pink text-gray-900 p-3 rounded-full backdrop-blur-sm transition-all hover:scale-110 shadow-lg"
                    title="Discuss Design"
                  >
                    <MessageCircle className="w-5 h-5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More / View All */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center flex flex-wrap gap-4 justify-center"
        >
          {hasMore && (
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              className="px-8 py-3.5 bg-white border-2 border-pastel-pink-dark hover:bg-pastel-pink hover:border-pastel-pink text-gray-800 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md"
            >
              Load More ({filteredDesigns.length - visibleCount} remaining)
            </button>
          )}
          <button
            onClick={() => navigate('/designs')}
            className="px-8 py-3.5 bg-pastel-pink-dark hover:bg-pastel-pink text-white hover:text-gray-900 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md"
          >
            View Full Gallery
          </button>
        </motion.div>
      </div>

      {/* ─── Lightbox Modal ─── */}
      <AnimatePresence>
        {selectedDesign && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeLightbox}
              className="absolute inset-0 bg-gray-900/70 backdrop-blur-md"
            />

            {/* Navigation arrows */}
            <button
              onClick={() => navigateLightbox(-1)}
              className="absolute left-4 md:left-8 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              onClick={() => navigateLightbox(1)}
              className="absolute right-4 md:right-8 z-20 p-3 rounded-full bg-white/20 hover:bg-white/40 text-white backdrop-blur-sm transition-all"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Modal content */}
            <motion.div
              key={selectedDesign.id}
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10"
            >
              {/* Image side */}
              <div className="w-full md:w-3/5 h-72 md:h-[600px] relative">
                <img
                  src={selectedDesign.src}
                  alt={selectedDesign.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/5" />
              </div>

              {/* Info side */}
              <div className="w-full md:w-2/5 p-8 md:p-10 flex flex-col justify-center relative">
                <button
                  onClick={closeLightbox}
                  className="absolute top-6 right-6 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>

                <span className="inline-block px-3 py-1 rounded-full bg-pastel-pink-light text-pastel-pink-dark text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
                  {selectedDesign.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                  {selectedDesign.title}
                </h2>
                <p className="text-gray-500 text-base leading-relaxed mb-8">
                  A stunning handcrafted nail design from our exclusive collection. Each set is
                  meticulously created to match your unique style.
                </p>

                <div className="flex flex-col gap-3 mt-auto">
                  <button
                    onClick={(e) => handleDiscuss(e, selectedDesign)}
                    className="bg-pastel-pink-dark hover:bg-pastel-pink text-white hover:text-gray-900 px-6 py-4 rounded-full font-medium transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Get This Design
                  </button>
                  <button
                    onClick={handleAction}
                    className="border-2 border-gray-200 hover:border-pastel-pink text-gray-700 px-6 py-4 rounded-full font-medium transition-all flex items-center justify-center gap-2"
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

      {/* ─── GET THIS DESIGN INQUIRY MODAL ─── */}
      <AnimatePresence>
        {inquiryDesign && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeInquiryModal}
              className="absolute inset-0 bg-gray-900/80 backdrop-blur-lg"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row z-10 max-h-[90vh]"
            >
              {/* Left: Design Image */}
              <div className="w-full md:w-1/2 h-56 md:h-auto relative overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={inquiryDesign.src} alt={inquiryDesign.title} className="w-full h-full object-cover" />
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
                    <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
                      <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-1">Get This Design</h2>
                        <p className="text-sm text-gray-500">Tell us about your preferences and we'll get back to you.</p>
                      </div>
                      <form onSubmit={handleInquirySubmit} className="space-y-5 flex-1">
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
                        {inquiryError && (
                          <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-lg">{inquiryError}</p>
                        )}
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
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex-1 flex flex-col items-center justify-center text-center py-8">
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
    </section>
  );
};
