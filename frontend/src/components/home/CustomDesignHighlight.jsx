import { motion } from 'framer-motion';
import { Upload, Link as LinkIcon, ArrowRight } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export const CustomDesignHighlight = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleAction = () => {
    if (!user) {
      navigate('/auth', { state: { from: location } });
    } else {
      navigate('/custom-design');
    }
  };

  return (
    <section className="py-24 bg-pastel-pink/20 relative overflow-hidden">
      {/* Decorative blurred background shapes */}
      <div className="absolute top-0 right-0 -mr-32 -mt-32 w-96 h-96 bg-primary opacity-30 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute bottom-0 left-0 -ml-32 -mb-32 w-96 h-96 bg-pastel-pink-dark opacity-30 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl p-10 md:p-14 rounded-[3rem] shadow-xl border border-white"
        >
          <span className="inline-block px-4 py-1.5 bg-primary/20 text-primary-dark rounded-full text-sm font-bold uppercase tracking-wider mb-6">
            Core Feature
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 tracking-tight mb-6">
            Design Your Own Nails
          </h2>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Turn your inspiration into reality. Upload a photo or share a link, and our artists will craft a custom masterpiece exclusively for your hands.
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-6 max-w-2xl mx-auto mb-10">
            <div className="flex-1 w-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer" onClick={handleAction}>
              <Upload className="w-8 h-8 text-pastel-pink-dark mb-3" />
              <span className="font-medium text-gray-700">Upload Image</span>
            </div>
            
            <div className="text-gray-400 font-medium">OR</div>
            
            <div className="flex-1 w-full bg-white border border-gray-200 rounded-2xl p-6 flex flex-col items-center justify-center hover:border-primary transition-colors cursor-pointer" onClick={handleAction}>
              <LinkIcon className="w-8 h-8 text-pastel-pink-dark mb-3" />
              <span className="font-medium text-gray-700">Paste a Link</span>
            </div>
          </div>

          <button 
            onClick={handleAction}
            className="flex items-center justify-center gap-2 mx-auto bg-primary hover:bg-primary-dark text-gray-900 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-1"
          >
            Start Custom Design <ArrowRight className="w-5 h-5" />
          </button>

        </motion.div>
      </div>
    </section>
  );
};
