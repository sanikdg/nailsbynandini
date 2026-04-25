import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import API_URL from '../../config';

const FALLBACK_SERVICES = [
  { _id: '1', title: 'Gel Extensions', description: 'Most popular type, gives extra length and strength with a natural glossy finish.', image: '/sanu/hand5.jpeg' },
  { _id: '2', title: 'Gel Overlay', description: 'Prevents breakage, chipping & adds shine to your natural nails with lasting protection.', image: '/sanu/hand8.jpeg' },
  { _id: '3', title: 'Shellac', description: 'Gel Polish or gel manicure on natural nails for a chip-free, brilliant shine.', image: '/sanu/hand12.jpeg' },
  { _id: '4', title: 'Nail Art', description: 'Custom hand-painted designs, chrome, ombre, 3D art and more creative expressions.', image: '/sanu/hand15.jpeg' },
  { _id: '5', title: 'Bridal Sets', description: 'Elegant, bespoke bridal nail designs for your special day with premium products.', image: '/sanu/hand20.jpeg' },
  { _id: '6', title: 'Manicure & Pedicure', description: 'Classic & luxury spa treatments for hands and feet with relaxing massage.', image: '/sanu/hand24.jpeg' },
];

export const ServicesPreview = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data } = await api.get('/services');
        setServices(data.length > 0 ? data : FALLBACK_SERVICES);
      } catch (error) {
        setServices(FALLBACK_SERVICES);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const getImageSrc = (service) => {
    if (!service.image) return '/sanu/hand5.jpeg';
    if (service.image.startsWith('/uploads/')) return `${API_URL}${service.image}`;
    return service.image;
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-14 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-lg">
              Make Gorgeous Nails a Part Of Your Life
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#2d2d3a] hover:bg-[#1a1a26] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Book a Service <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {services.slice(0, 6).map((service, index) => (
              <motion.div
                key={service._id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group cursor-pointer"
              >
                {/* Image */}
                <div className="relative rounded-2xl overflow-hidden aspect-[4/5] mb-0">
                  <img
                    src={getImageSrc(service)}
                    alt={service.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  {/* Gradient overlay at bottom */}
                  <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                </div>
                
                {/* Info card overlapping image */}
                <div className="relative -mt-16 mx-3 bg-[#2d2d3a] text-white p-5 rounded-xl z-10 group-hover:bg-[#1a1a26] transition-colors duration-300">
                  <h3 className="text-lg font-bold mb-1.5">{service.title}</h3>
                  <p className="text-sm text-gray-300 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
