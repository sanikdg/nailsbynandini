import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Tag, Clock, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const formatExpiry = (expiryDate) => {
  const now = new Date();
  const expiry = new Date(expiryDate);
  const diffMs = expiry - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return 'Expired';
  if (diffDays === 1) return 'Expires tomorrow';
  if (diffDays <= 7) return `Expires in ${diffDays} days`;
  if (diffDays <= 30) return `Expires in ${Math.ceil(diffDays / 7)} weeks`;
  return `Valid until ${expiry.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
};

const generateCode = (title, discount) => {
  const word = title.split(' ')[0].toUpperCase().slice(0, 6);
  return `${word}${discount}`;
};

export const OffersSection = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const { data } = await api.get('/offers');
        setOffers(data);
      } catch (error) {
        console.error('Failed to fetch offers:', error);
        setOffers([]);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  const handleClaim = () => {
    if (!user) {
      navigate('/auth', { state: { from: location } });
    } else {
      navigate('/dashboard/book');
    }
  };

  if (loading) {
    return (
      <section className="py-20 bg-white">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col items-center text-center mb-12"
        >
          <div className="bg-red-50 text-red-500 p-3 rounded-full mb-4">
            <Tag className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">Special Offers</h2>
          <p className="mt-2 text-gray-600">Exclusive deals just for you</p>
        </motion.div>

        {offers.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-gradient-to-br from-slate-50 to-slate-100 border-2 border-dashed border-slate-300 rounded-3xl p-16 text-center">
              <div className="bg-slate-200 text-slate-600 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Coming Soon</h3>
              <p className="text-slate-600 mb-6">We're preparing amazing special offers and exclusive deals for you. Stay tuned!</p>
              <p className="text-sm text-slate-500">Check back soon for exciting promotions and discounts</p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {offers.slice(0, 4).map((offer, index) => (
            <motion.div
              key={offer._id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="bg-white border-2 border-pastel-pink rounded-3xl p-8 relative overflow-hidden group hover:shadow-lg transition-all"
            >
              {/* Decorative Background */}
              <div className="absolute -right-12 -top-12 w-40 h-40 bg-pastel-pink-light opacity-50 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>

              <div className="relative z-10">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold mb-4 tracking-wide flex items-center gap-1 w-max">
                  <Clock className="w-3 h-3" /> {formatExpiry(offer.expiry)}
                </span>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {offer.title}
                </h3>
                <p className="text-gray-600 mb-6">{offer.description}</p>
                
                <div className="flex items-center justify-between mt-auto">
                  <div className="bg-gray-50 border border-gray-200 px-4 py-2 rounded-lg text-sm font-mono text-gray-500 font-medium">
                    {offer.code || generateCode(offer.title, offer.discount)}
                  </div>
                  <button 
                    onClick={handleClaim}
                    className="bg-gray-900 hover:bg-black text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors shadow-sm"
                  >
                    Claim Offer
                  </button>
                </div>
              </div>
            </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
