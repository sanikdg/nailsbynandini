import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, Award, Star, Palette, Gem, Crown, ArrowRight } from 'lucide-react';

const STATS = [
  { number: '500+', label: 'Happy Clients' },
  { number: '50+', label: 'Unique Designs' },
  { number: '5★', label: 'Average Rating' },
  { number: '3+', label: 'Years Experience' },
];

const EXPERTISE = [
  {
    icon: <Gem className="w-6 h-6" />,
    title: 'Gel Extensions',
    description: 'Sculpted perfection with premium gel for natural-looking length and strength.',
    image: '/sanu/hand5.jpeg',
  },
  {
    icon: <Palette className="w-6 h-6" />,
    title: 'Nail Art',
    description: 'Hand-painted designs from minimalist to elaborate — every nail tells a story.',
    image: '/sanu/hand15.jpeg',
  },
  {
    icon: <Crown className="w-6 h-6" />,
    title: 'Bridal Sets',
    description: 'Bespoke bridal nail designs that complement your special day perfectly.',
    image: '/sanu/hand20.jpeg',
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'Chrome & Ombré',
    description: 'Trending finishes that catch the light — mirror chrome, baby boomer, and more.',
    image: '/sanu/hand4.jpeg',
  },
];

/* Animated fade-up wrapper */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const About = () => {
  return (
    <div className="w-full flex flex-col bg-white overflow-x-hidden">

      {/* ═══════════ 1. HERO BANNER ═══════════ */}
      <section className="relative bg-pastel-pink-light overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-pastel-pink/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-pastel-pink/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-pastel-pink-dark text-sm font-semibold tracking-[0.2em] uppercase mb-5"
          >
            ✦ Our Story
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]"
          >
            The Art Behind{' '}
            <span className="relative inline-block">
              Every Detail
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
            className="mt-6 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed font-light"
          >
            Discover the passion, precision, and creativity that goes into every set we create.
          </motion.p>
        </div>
      </section>

      {/* ═══════════ 2. ARTIST STORY ═══════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-14 lg:gap-20">

            {/* Image Collage */}
            <FadeUp className="w-full lg:w-1/2 relative">
              <div className="grid grid-cols-12 gap-4 max-w-lg mx-auto lg:mx-0">
                {/* Large main image */}
                <motion.div
                  className="col-span-7 rounded-2xl overflow-hidden shadow-lg"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src="/sanu/hand8.jpeg"
                    alt="Nail art showcase"
                    className="w-full h-64 md:h-80 object-cover"
                  />
                </motion.div>

                {/* Small top-right */}
                <motion.div
                  className="col-span-5 rounded-2xl overflow-hidden shadow-lg mt-8"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src="/sanu/hand12.jpeg"
                    alt="Elegant nail design"
                    className="w-full h-48 md:h-64 object-cover"
                  />
                </motion.div>

                {/* Wide bottom */}
                <motion.div
                  className="col-span-12 rounded-2xl overflow-hidden shadow-lg -mt-6"
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.4 }}
                >
                  <img
                    src="/sanu/hand25.jpeg"
                    alt="Nail art close-up"
                    className="w-full h-48 md:h-56 object-cover"
                  />
                </motion.div>
              </div>

              {/* Floating accent badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute -bottom-4 -right-2 md:right-4 bg-white rounded-2xl shadow-xl p-4 z-20 border border-pastel-pink-light"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-pastel-pink flex items-center justify-center">
                    <Heart className="w-5 h-5 text-[#9b1b4a]" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900">Made with Love</p>
                    <p className="text-xs text-gray-500">Every single set</p>
                  </div>
                </div>
              </motion.div>
            </FadeUp>

            {/* Text Content */}
            <FadeUp delay={0.15} className="w-full lg:w-1/2 space-y-6">
              <span className="inline-block text-pastel-pink-dark text-xs font-semibold tracking-[0.2em] uppercase">
                About the Artist
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                Where Passion Meets{' '}
                <span className="relative inline-block">
                  Precision
                  <motion.span
                    className="absolute -bottom-1 left-0 w-full h-2 bg-pastel-pink/40 rounded-full -z-10"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    style={{ originX: 0 }}
                  />
                </span>
              </h2>

              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                Hello! I'm Sanu — an independent nail artist dedicated to creating elegant, 
                high-quality nail experiences. What started as a creative hobby has blossomed 
                into a full-fledged passion for transforming nails into wearable art.
              </p>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                My style focuses on clean aesthetics, soft pastels, intricate detailing, and 
                incredible attention to detail. Every set is uniquely crafted to match your 
                personality and occasion — from everyday chic to bridal glamour.
              </p>
              <p className="text-gray-600 leading-relaxed text-base md:text-lg">
                I use only premium, salon-grade products that are safe for your natural nails. 
                Your nail health is always my top priority, alongside delivering designs that 
                make you feel confident and beautiful.
              </p>

              <div className="flex flex-row gap-4 pt-4">
                <Link
                  to="/designs"
                  className="px-8 py-3.5 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  View My Work
                </Link>
                <Link
                  to="/contact"
                  className="px-8 py-3.5 bg-transparent border-2 border-[#9b1b4a] text-[#9b1b4a] hover:bg-[#9b1b4a] hover:text-white rounded-lg font-medium transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5 text-sm sm:text-base"
                >
                  Get In Touch
                </Link>
              </div>
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. STATS BAR ═══════════ */}
      <section className="bg-[#2d2d3a] py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12">
            {STATS.map((stat, i) => (
              <FadeUp key={i} delay={i * 0.1} className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-white mb-1">{stat.number}</p>
                <p className="text-sm text-gray-400 uppercase tracking-wider">{stat.label}</p>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 4. EXPERTISE / SKILLS GRID ═══════════ */}
      <section className="py-20 md:py-28 bg-pastel-pink-light/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <span className="inline-block text-pastel-pink-dark text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              What I Specialize In
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight max-w-2xl mx-auto">
              Crafted With Expertise & Care
            </h2>
          </FadeUp>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
            {EXPERTISE.map((item, index) => (
              <FadeUp key={index} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-shadow duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    {/* Card Image */}
                    <div className="w-full md:w-2/5 h-48 md:h-auto overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>

                    {/* Card Content */}
                    <div className="w-full md:w-3/5 p-6 md:p-8 flex flex-col justify-center">
                      <div className="w-12 h-12 rounded-xl bg-pastel-pink-light flex items-center justify-center text-[#9b1b4a] mb-4">
                        {item.icon}
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 5. VALUES SECTION ═══════════ */}
      <section className="py-20 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <FadeUp className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Why Clients{' '}
              <span className="relative inline-block">
                Love Us
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
          </FadeUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Award className="w-7 h-7" />,
                title: 'Premium Products',
                desc: 'Only salon-grade gels and polishes that are gentle on your natural nails and deliver lasting results.',
              },
              {
                icon: <Star className="w-7 h-7" />,
                title: 'Bespoke Designs',
                desc: 'Every set is personally designed and hand-crafted — no cookie-cutter looks, only unique creations.',
              },
              {
                icon: <Heart className="w-7 h-7" />,
                title: 'Client-First Approach',
                desc: 'From consultation to aftercare, your comfort and satisfaction drive everything I do.',
              },
            ].map((value, i) => (
              <FadeUp key={i} delay={i * 0.12}>
                <div className="text-center p-8 rounded-2xl border border-gray-100 bg-white hover:shadow-lg transition-shadow duration-300 h-full">
                  <div className="w-16 h-16 rounded-2xl bg-pastel-pink-light flex items-center justify-center text-[#9b1b4a] mx-auto mb-5">
                    {value.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ 6. CTA SECTION ═══════════ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/sanu/hand31.jpeg"
            alt="Beautiful nails"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 py-24 md:py-32 text-center px-4">
          <FadeUp>
            <h2
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white tracking-tight italic mb-6"
              style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}
            >
              Ready For Your Dream Nails?
            </h2>
            <p className="text-white/80 text-lg max-w-xl mx-auto mb-10 font-light leading-relaxed">
              Let's create something beautiful together. Book a consultation or browse my portfolio to get inspired.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                to="/dashboard/custom-design"
                className="inline-flex items-center gap-2 px-10 py-4 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-medium transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1"
              >
                Start Custom Design <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/designs"
                className="inline-flex items-center gap-2 px-10 py-4 bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-lg font-medium transition-all duration-300 backdrop-blur-sm"
              >
                Browse Gallery
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
};
