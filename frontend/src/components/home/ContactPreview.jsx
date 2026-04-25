import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, Clock } from 'lucide-react';

export const ContactPreview = () => {
  return (
    <section className="bg-[#1a1a26] py-16 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 items-start">
          
          {/* Location */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-4">
              <MapPin className="w-5 h-5 text-pastel-pink" />
            </div>
            <h4 className="font-bold text-lg mb-2">Our Studio</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              123 Beauty Boulevard, Suite 4A<br/>
              Los Angeles, CA 90015
            </p>
          </motion.div>

          {/* Hours */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-4">
              <Clock className="w-5 h-5 text-pastel-pink" />
            </div>
            <h4 className="font-bold text-lg mb-2">Working Hours</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Monday – Sunday<br/>
              11:00 AM – 9:00 PM
            </p>
          </motion.div>

          {/* Contact */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="text-center md:text-left"
          >
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-white/10 mb-4">
              <Phone className="w-5 h-5 text-pastel-pink" />
            </div>
            <h4 className="font-bold text-lg mb-2">Get In Touch</h4>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              (555) 123-4567<br/>
              hello@nailartistry.com
            </p>
            <a 
              href="https://wa.me/918862024064" 
              target="_blank" 
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-2.5 rounded-full font-medium text-sm transition-colors shadow-lg"
            >
              <MessageCircle className="w-4 h-4" /> Chat on WhatsApp
            </a>
          </motion.div>

        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} NailArtistry. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </section>
  );
};
