import { Hero } from '../components/Hero';
import { FeaturedDesigns } from '../components/home/FeaturedDesigns';
import { HowItWorks } from '../components/home/HowItWorks';
import { CustomDesignHighlight } from '../components/home/CustomDesignHighlight';
import { OffersSection } from '../components/home/OffersSection';
import { AboutPreview } from '../components/home/AboutPreview';
import { ServicesPreview } from '../components/home/ServicesPreview';
import { Testimonials } from '../components/home/Testimonials';


export const Home = () => {
  return (
    <div className="w-full flex flex-col bg-white overflow-x-hidden">
      {/* 1. Hero Section (Split Layout) */}
      <Hero />

      {/* 2. About / Knowledge Section */}
      <AboutPreview />

      {/* 3. Services with Image Cards */}
      <ServicesPreview />

      {/* 4. Featured Designs Grid (Portfolio) */}
      <FeaturedDesigns />

      {/* 5. How It Works - 3 Step Process */}
      <HowItWorks />

      {/* 6. Design Your Own Nails (Core Feature) */}
      <CustomDesignHighlight />

      {/* 7. Offers / Promotions Section */}
      <OffersSection />

      {/* 8. Testimonials (Customer Reviews) */}
      <Testimonials />
    </div>
  );
};
