import { motion } from 'framer-motion';
const Instagram = ({ className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="24" 
    height="24" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

// Use real images from sanu folder
const GALLERY = [
  '/sanu/hand20.jpeg',
  '/sanu/hand21.jpeg',
  '/sanu/hand22.jpeg',
  '/sanu/hand23.jpeg',
  '/sanu/hand24.jpeg',
  '/sanu/hand25.jpeg',
];

export const GalleryFeed = () => {
  return (
    <section className="py-24 bg-gray-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row justify-between items-end mb-12"
        >
          <div>
            <h2 className="text-3xl font-bold text-gray-800">On The Gram</h2>
            <p className="mt-2 text-gray-600">Follow our latest creations and behind-the-scenes</p>
          </div>
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity shadow-md"
          >
            <Instagram className="w-5 h-5" /> @NailsByNandini
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {GALLERY.map((img, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
            >
              <img 
                src={img} 
                alt="Instagram feed item" 
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                <Instagram className="w-6 h-6 text-white" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
