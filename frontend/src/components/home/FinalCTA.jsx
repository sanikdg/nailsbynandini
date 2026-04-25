import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const FinalCTA = () => {
  return (
    <section className="relative w-full overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/cta-banner.png"
          alt="Indulge your nails"
          className="w-full h-full object-cover"
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30 backdrop-blur-[1px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 py-28 md:py-36 text-center px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight italic"
          style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
        >
          Indulge Your Nails
        </motion.h2>

        {/* Hours */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="mt-6 flex items-center justify-center gap-4 text-white/80"
        >
          <span className="text-sm md:text-base tracking-wide">Monday – Sunday</span>
          <span className="w-20 h-px bg-white/40" />
          <span className="text-sm md:text-base tracking-wide">11:00 AM – 9:00 PM</span>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-8"
        >
          <Link
            to="/dashboard/custom-design"
            className="inline-block px-10 py-4 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 text-base"
          >
            Book Now
          </Link>
        </motion.div>
      </div>
    </section>
  );
};
