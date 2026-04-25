import { Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { FloatingSocials } from '../components/FloatingSocials';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-pastel-white">
      <Navbar />
      <main className="flex-grow w-full">
        <Outlet />
      </main>

      {/* Floating WhatsApp & Instagram buttons */}
      <FloatingSocials />

      <Footer />
    </div>
  );
};

export default MainLayout;
