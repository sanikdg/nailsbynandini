import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ── Decorative botanical SVG (left side) ── */
const BotanicalLeft = () => (
  <svg
    className="absolute left-0 top-1/4 w-16 md:w-24 opacity-20 pointer-events-none"
    viewBox="0 0 80 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M40 280 C40 280, 20 220, 30 180 C35 160, 15 140, 20 100 C25 60, 10 40, 15 10"
      stroke="#d4a0a0"
      strokeWidth="1.5"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.5, ease: "easeInOut" }}
    />
    <motion.path
      d="M30 180 C30 180, 50 170, 55 150"
      stroke="#d4a0a0"
      strokeWidth="1.2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 1 }}
    />
    <motion.path
      d="M20 100 C20 100, 45 95, 50 75"
      stroke="#d4a0a0"
      strokeWidth="1.2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 1.5 }}
    />
    {/* Leaves */}
    <motion.ellipse cx="55" cy="148" rx="12" ry="6" fill="#d4a0a0" opacity="0.15"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.8, duration: 0.6 }}
      transform="rotate(-30 55 148)"
    />
    <motion.ellipse cx="50" cy="73" rx="10" ry="5" fill="#d4a0a0" opacity="0.15"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.2, duration: 0.6 }}
      transform="rotate(-20 50 73)"
    />
  </svg>
);

/* ── Decorative botanical SVG (right side) ── */
const BotanicalRight = () => (
  <svg
    className="absolute right-0 top-8 w-16 md:w-24 opacity-20 pointer-events-none"
    viewBox="0 0 80 300"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <motion.path
      d="M40 10 C40 10, 60 70, 50 120 C45 150, 65 170, 55 220 C50 250, 60 270, 55 290"
      stroke="#d4a0a0"
      strokeWidth="1.5"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 2.5, ease: "easeInOut", delay: 0.3 }}
    />
    <motion.path
      d="M50 120 C50 120, 25 115, 20 95"
      stroke="#d4a0a0"
      strokeWidth="1.2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 1.2 }}
    />
    <motion.path
      d="M55 220 C55 220, 30 210, 25 195"
      stroke="#d4a0a0"
      strokeWidth="1.2"
      fill="none"
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 1.5, delay: 1.8 }}
    />
    {/* Leaves */}
    <motion.ellipse cx="20" cy="93" rx="12" ry="6" fill="#d4a0a0" opacity="0.15"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2, duration: 0.6 }}
      transform="rotate(25 20 93)"
    />
    <motion.ellipse cx="25" cy="193" rx="10" ry="5" fill="#d4a0a0" opacity="0.15"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 2.4, duration: 0.6 }}
      transform="rotate(20 25 193)"
    />
  </svg>
);

export const Hero = () => {
  return (
    <section className="relative w-full min-h-[calc(100vh-80px)] bg-pastel-pink-light overflow-hidden">
      {/* Decorative Botanicals */}
      <BotanicalLeft />
      <BotanicalRight />

      {/* Subtle floating particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-pastel-pink-dark/10"
            style={{
              width: 4 + Math.random() * 8,
              height: 4 + Math.random() * 8,
              left: `${15 + Math.random() * 70}%`,
              top: `${10 + Math.random() * 80}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: i * 0.8,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-0">
        <div className="flex flex-col md:flex-row items-center min-h-[calc(100vh-80px)]">
          
          {/* ── Left: Text Content ── */}
          <div className="w-full md:w-1/2 relative z-10 py-12 md:py-0 md:pr-12 lg:pr-20">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <span className="inline-block text-pastel-pink-dark text-sm font-semibold tracking-[0.2em] uppercase mb-6">
                ✦ Premium Nail Studio
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-[4.2rem] font-bold text-gray-900 leading-[1.1] tracking-tight"
            >
              Make Fabulous{' '}
              <span className="relative inline-block">
                Nails
                <motion.span
                  className="absolute -bottom-1 left-0 w-full h-2 bg-pastel-pink/50 rounded-full -z-10"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.6, delay: 0.9 }}
                  style={{ originX: 0 }}
                />
              </span>{' '}
              an Everyday Accessory
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="mt-6 text-lg md:text-xl text-gray-600 max-w-lg leading-relaxed font-light"
            >
              Elegant, personalized nail designs crafted to match your unique style. 
              Experience luxury at your fingertips.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: "easeOut" }}
              className="mt-10 flex flex-row gap-4"
            >
              <Link
                to="/contact"
                className="px-8 py-3.5 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                Book Appointment
              </Link>
              <Link
                to="/designs"
                className="px-8 py-3.5 bg-transparent border-2 border-[#9b1b4a] text-[#9b1b4a] hover:bg-[#9b1b4a] hover:text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
              >
                View Designs
              </Link>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="mt-12 flex gap-8 md:gap-12"
            >
              {[
                { number: '500+', label: 'Happy Clients' },
                { number: '50+', label: 'Nail Designs' },
                { number: '5★', label: 'Average Rating' },
              ].map((stat, i) => (
                <div key={i} className="text-center md:text-left">
                  <motion.p
                    className="text-2xl md:text-3xl font-bold text-gray-900"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.15 }}
                  >
                    {stat.number}
                  </motion.p>
                  <p className="text-xs text-gray-500 mt-1 tracking-wide uppercase">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>

          {/* ── Right: Image Collage ── */}
          <div className="w-full md:w-1/2 relative flex items-center justify-center py-8 md:py-0">
            {/* Main hero image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, x: 40 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
              className="relative z-10 w-full max-w-md lg:max-w-lg"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-2xl aspect-[3/4]">
                <img
                  src="/hero-nail.png"
                  alt="Beautiful nail art showcase"
                  className="w-full h-full object-cover"
                />
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/5 via-transparent to-transparent" />
              </div>

              {/* Floating accent card */}
              <motion.div
                className="absolute -bottom-4 -left-4 md:-left-8 bg-white rounded-2xl shadow-xl p-4 z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-pastel-pink flex items-center justify-center text-lg">
                    💅
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Premium Quality</p>
                    <p className="text-xs text-gray-500">100% Gel Products</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Secondary floating image */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.7 }}
              className="absolute -bottom-2 -right-2 md:bottom-8 md:right-0 w-32 md:w-40 z-20"
            >
              <div className="rounded-2xl overflow-hidden shadow-xl border-4 border-white">
                <img
                  src="/sanu/hand4.jpeg"
                  alt="Nail design sample"
                  className="w-full h-28 md:h-36 object-cover"
                />
              </div>
            </motion.div>

            {/* Decorative circle */}
            <motion.div
              className="absolute -top-6 right-4 md:right-12 w-20 h-20 rounded-full border-2 border-pastel-pink-dark/20"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1, duration: 0.6, ease: "easeOut" }}
            />
            <motion.div
              className="absolute top-1/4 -left-6 w-12 h-12 rounded-full bg-pastel-pink/30"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1.3, duration: 0.6, ease: "easeOut" }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
