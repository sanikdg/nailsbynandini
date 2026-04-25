import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Loader2 } from 'lucide-react';
import api from '../../services/api';

const FALLBACK_REVIEWS = [
  {
    _id: '1',
    name: 'Samay Singh',
    rating: 5,
    text: 'Absolutely the best nail experience I have ever had. The attention to detail on my bridal set was unmatched and they lasted 4 weeks without lifting!',
    role: 'Bride'
  },
  {
    _id: '2',
    name: 'Renuka Patil',
    rating: 5,
    text: 'I brought in a very complex Pinterest reference for abstract art, and the result was somehow even better than the picture. Incredibly talented.',
    role: 'Loyal Client'
  },
  {
    _id: '3',
    name: 'Anuja Ahire',
    rating: 5,
    text: 'Clean studio, premium products, and an artist who genuinely cares about nail health. I will never go anywhere else.',
    role: 'First-time Client'
  }
];

export const Testimonials = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/testimonials');
        setReviews(data.length > 0 ? data : FALLBACK_REVIEWS);
      } catch (error) {
        setReviews(FALLBACK_REVIEWS);
      } finally {
        setLoading(false);
      }
    };
    fetchTestimonials();
  }, []);

  if (loading) {
    return (
      <section className="py-24 bg-white">
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Client Love</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Don't just take our word for it. Here is what our clients have to say.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {reviews.slice(0, 6).map((review, index) => (
            <motion.div
              key={review._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15 }}
              className="bg-pastel-white/50 border border-pastel-pink-light rounded-3xl p-8 hover:shadow-md transition-shadow relative"
            >
              {/* Decorative quotation mark */}
              <div className="absolute top-6 right-8 text-6xl text-primary opacity-20 font-serif leading-none">"</div>
              
              <div className="flex gap-1 mb-6 relative z-10">
                {[...Array(review.rating || 5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              
              <p className="text-gray-700 italic mb-8 relative z-10 font-light">"{review.text}"</p>
              
              <div className="flex items-center gap-4 border-t border-gray-200/50 pt-6 relative z-10">
                <div className="w-12 h-12 bg-primary-dark text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{review.name}</h4>
                  <p className="text-sm text-gray-500">{review.role || 'Client'}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
