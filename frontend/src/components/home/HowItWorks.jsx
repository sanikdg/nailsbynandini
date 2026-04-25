import { motion } from 'framer-motion';
import { SearchIcon, MessageSquare, Sparkles } from 'lucide-react';

const STEPS = [
  {
    icon: SearchIcon,
    title: 'Browse or Upload Inspiration',
    description: 'Explore our curated gallery of premium designs or upload your own Pinterest inspirations directly to our platform.',
    delay: 0.1
  },
  {
    icon: MessageSquare,
    title: 'Discuss with the Artist',
    description: 'Engage in a one-on-one consultation with our expert nail technicians to refine shapes, colors, and specific customizations.',
    delay: 0.3
  },
  {
    icon: Sparkles,
    title: 'Get Your Perfect Nails',
    description: 'Finalize your appointment, walk into our luxury studio, and let us bring your ultimate dream nails to reality.',
    delay: 0.5
  }
];

export const HowItWorks = () => {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">How It Works</h2>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">Your journey to exquisite, personalized nail art is simple and seamless.</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: step.delay }}
                className="group flex flex-col items-center"
              >
                <div className="w-24 h-24 mb-8 bg-pastel-pink-light rounded-full flex items-center justify-center relative transition-transform duration-500 group-hover:scale-110">
                  <div className="absolute inset-0 bg-primary opacity-20 rounded-full blur-xl group-hover:opacity-40 transition-opacity duration-500"></div>
                  <Icon className="w-10 h-10 text-primary-dark relative z-10" />
                  
                  {/* Step Connector Line (Desktop only) */}
                  {index !== STEPS.length - 1 && (
                    <div className="hidden md:block absolute top-1/2 left-full w-full h-px bg-gray-200 -z-10 translate-x-4">
                      {/* Arrow head */}
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 w-2 h-2 border-t-2 border-r-2 border-gray-300 rotate-45"></div>
                    </div>
                  )}
                </div>
                
                <h3 className="text-xl font-bold text-gray-800 mb-4">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">{step.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
