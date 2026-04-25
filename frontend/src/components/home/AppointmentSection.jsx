import { motion } from 'framer-motion';
import { useState } from 'react';

const SERVICES_LIST = [
  'Gel Extensions',
  'Gel Overlay',
  'Shellac Manicure',
  'Nail Art',
  'Bridal Set',
  'Classic Manicure',
  'Classic Pedicure',
  'Luxury Spa Treatment',
];

export const AppointmentSection = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    service: '',
    date: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: integrate with backend
    alert('Appointment request submitted! We will contact you shortly.');
    setFormData({ firstName: '', lastName: '', email: '', phone: '', service: '', date: '', message: '' });
  };

  return (
    <section className="py-20 md:py-28 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-stretch gap-0 rounded-3xl overflow-hidden shadow-2xl">

          {/* ── Left: Image ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 min-h-[300px] lg:min-h-[600px] relative"
          >
            <img
              src="/services-gel.png"
              alt="Nail technician at work"
              className="w-full h-full object-cover absolute inset-0"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/10" />
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="w-full lg:w-1/2 bg-gray-50 p-8 md:p-12 flex flex-col justify-center"
          >
            <span className="text-[#9b1b4a] text-xs font-semibold tracking-[0.2em] uppercase mb-3">
              Booking Now
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
              Make An Appointment
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Row 1: Names */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="First Name*"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white"
                />
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Last Name*"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white"
                />
              </div>

              {/* Row 2: Contact */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address*"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white"
                />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number*"
                  required
                  className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white"
                />
              </div>

              {/* Service Select */}
              <select
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white text-gray-600 appearance-none"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23999' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
                  backgroundRepeat: 'no-repeat',
                  backgroundPosition: 'right 16px center',
                }}
              >
                <option value="">Select Service</option>
                {SERVICES_LIST.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>

              {/* Date */}
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                placeholder="Select Date"
                required
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white text-gray-600"
              />

              {/* Message */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Any special requests? (optional)"
                rows="3"
                className="w-full px-4 py-3.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a]/30 transition-all bg-white resize-none"
              />

              {/* Submit */}
              <motion.button
                type="submit"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl text-base tracking-wide"
              >
                Book Appointment
              </motion.button>
            </form>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
