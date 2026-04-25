import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

/* Decorative nail art SVG illustration */
const NailArtIllustration = () => (
  <svg
    className="absolute right-0 bottom-0 w-40 md:w-56 opacity-15 pointer-events-none"
    viewBox="0 0 200 250"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Stylized hand/nail silhouette */}
    <motion.path
      d="M100 240 C100 240, 85 200, 80 170 C75 140, 90 130, 95 100 C98 80, 85 60, 90 40 C95 20, 110 15, 115 35 C120 55, 105 70, 108 100 C112 130, 125 140, 120 170 C115 200, 100 240, 100 240"
      stroke="#d4a0a0"
      strokeWidth="1.5"
      fill="none"
      initial={{ pathLength: 0 }}
      whileInView={{ pathLength: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 2, ease: "easeInOut" }}
    />
    {/* Nail tip accent */}
    <motion.ellipse
      cx="102" cy="30" rx="14" ry="18"
      stroke="#d4a0a0"
      strokeWidth="1"
      fill="#d4a0a0"
      opacity="0.1"
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: 1.5, duration: 0.6 }}
    />
  </svg>
);

export const AboutPreview = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 bg-white relative overflow-hidden">
      <NailArtIllustration />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

          {/* ── Left: Image Collage ── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 relative"
          >
            <div className="grid grid-cols-2 gap-4 max-w-md mx-auto lg:mx-0">
              {/* Top-left image (tools flatlay) */}
              <motion.div
                className="rounded-2xl overflow-hidden shadow-lg self-end"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
              >
                <img
                  src="/tools-flatlay.png"
                  alt="Nail salon tools and products"
                  className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Top-right image (woman in salon) */}
              <motion.div
                className="rounded-2xl overflow-hidden shadow-lg -mt-8"
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4 }}
              >
                <img
                  src="/about-salon.png"
                  alt="Client at nail salon"
                  className="w-full h-56 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>

              {/* Bottom-center image (nail work) */}
              <motion.div
                className="col-span-2 rounded-2xl overflow-hidden shadow-lg -mt-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <img
                  src="/sanu/hand1.jpeg"
                  alt="Beautiful nail art close-up"
                  className="w-full h-48 md:h-56 object-cover hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </div>
          </motion.div>

          {/* ── Right: Text Content ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="w-full lg:w-1/2 space-y-6"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              We Have the Nail{' '}
              <span className="relative inline-block">
                Knowledge
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-2 bg-pastel-pink/40 rounded-full -z-10"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  style={{ originX: 0 }}
                />
              </span>
            </h2>

            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              Welcome to Nails by Nandini, your premier destination for luxurious nail treatments.
              Our mission is to provide our guests with the highest quality of care and service
              in a relaxing and comfortable atmosphere.
            </p>
            <p className="text-gray-600 leading-relaxed text-base md:text-lg">
              Our talented team of nail technicians are highly trained, experienced, and
              passionate about providing you with the perfect look for any occasion, from
              everyday wear to a special night out. Our selection of polishes and gels are
              hand-picked to ensure the highest level of quality and safety.
            </p>

            <motion.button
              onClick={() => navigate('/about')}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-4 px-8 py-3.5 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Learn More About Us
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
