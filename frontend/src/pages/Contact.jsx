import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../services/api';

const CONTACT_INFO = [
  {
    icon: <MapPin className="w-5 h-5" />,
    title: 'Our Studio',
    lines: ['Shivaji Nagar, Malkapur, Maharashtra 443101'],
  },
  {
    icon: <Clock className="w-5 h-5" />,
    title: 'Working Hours',
    lines: ['Monday – Sunday', '11:00 AM – 9:00 PM'],
  },
  {
    icon: <Phone className="w-5 h-5" />,
    title: 'Phone',
    lines: ['88620 24064'],
    href: 'tel:+918862024064',
  },
  {
    icon: <Mail className="w-5 h-5" />,
    title: 'Email',
    lines: ['hello@nailartistry.com'],
    href: 'mailto:hello@nailartistry.com',
  },
];

/* Animated fade-up wrapper */
const FadeUp = ({ children, delay = 0, className = '' }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-60px' }}
    transition={{ duration: 0.7, delay, ease: 'easeOut' }}
    className={className}
  >
    {children}
  </motion.div>
);

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setIsSubmitting(true);
    try {
      await api.post('/contact-messages', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });
      setIsSubmitted(true);
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setError('Failed to send message. Please try again or contact us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full flex flex-col bg-white overflow-x-hidden">

      {/* ═══════════ 1. HERO BANNER ═══════════ */}
      <section className="relative bg-pastel-pink-light overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-pastel-pink/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-56 h-56 bg-pastel-pink/20 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28 text-center relative z-10">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block text-pastel-pink-dark text-sm font-semibold tracking-[0.2em] uppercase mb-5"
          >
            ✦ Let's Connect
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1]"
          >
            Get In{' '}
            <span className="relative inline-block">
              Touch
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
            Have a question, want to book, or just want to say hello? We'd love to hear from you.
          </motion.p>
        </div>
      </section>

      {/* ═══════════ 2. MAIN CONTENT ═══════════ */}
      <section className="py-20 md:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

            {/* ── Left: Contact Info Cards ── */}
            <FadeUp className="w-full lg:w-5/12 space-y-6">
              <div className="space-y-2 mb-8">
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Contact Information</h2>
                <p className="text-gray-600">Reach out through any of these channels.</p>
              </div>

              {/* Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {CONTACT_INFO.map((info, i) => (
                  <FadeUp key={i} delay={i * 0.08}>
                    <div className="flex items-start gap-4 p-5 rounded-2xl bg-pastel-pink-light/40 border border-pastel-pink-light hover:shadow-md transition-shadow duration-300 group">
                      <div className="w-11 h-11 shrink-0 rounded-xl bg-white flex items-center justify-center text-[#9b1b4a] shadow-sm group-hover:bg-[#9b1b4a] group-hover:text-white transition-colors duration-300">
                        {info.icon}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm mb-1">{info.title}</h4>
                        {info.lines.map((line, j) =>
                          info.href ? (
                            <a
                              key={j}
                              href={info.href}
                              className="block text-sm text-gray-600 hover:text-[#9b1b4a] transition-colors"
                            >
                              {line}
                            </a>
                          ) : (
                            <p key={j} className="text-sm text-gray-600">{line}</p>
                          )
                        )}
                      </div>
                    </div>
                  </FadeUp>
                ))}
              </div>

              {/* WhatsApp CTA */}
              <FadeUp delay={0.4}>
                <a
                  href="https://wa.me/918862024064"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-3 w-full px-8 py-4 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat on WhatsApp
                </a>
              </FadeUp>

              {/* Decorative Image */}
              <FadeUp delay={0.5}>
                <div className="rounded-2xl overflow-hidden shadow-lg mt-4 hidden lg:block">
                  <img
                    src="/sanu/hand28.jpeg"
                    alt="Beautiful nail art"
                    className="w-full h-48 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </FadeUp>
            </FadeUp>

            {/* ── Right: Contact Form ── */}
            <FadeUp delay={0.15} className="w-full lg:w-7/12">
              {!isSubmitted ? (
                <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-gray-100 relative overflow-hidden">
                  {/* Decorative glow */}
                  <div className="absolute top-0 right-0 -m-16 w-48 h-48 bg-pastel-pink opacity-15 rounded-full blur-3xl pointer-events-none" />

                  <div className="relative z-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
                    <p className="text-gray-600 mb-8 text-sm">We typically respond within 2-4 hours.</p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Name <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                            Email <span className="text-red-400">*</span>
                          </label>
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Phone</label>
                          <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400"
                            placeholder="(555) 000-0000"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-gray-800 mb-1.5">Subject</label>
                          <select
                            name="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all bg-gray-50 focus:bg-white text-gray-700"
                          >
                            <option value="">Select a topic</option>
                            <option value="Booking">Booking / Appointment</option>
                            <option value="Custom Design">Custom Design Request</option>
                            <option value="Pricing">Pricing Inquiry</option>
                            <option value="General">General Question</option>
                            <option value="Feedback">Feedback</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-800 mb-1.5">
                          Message <span className="text-red-400">*</span>
                        </label>
                        <textarea
                          name="message"
                          value={formData.message}
                          onChange={handleChange}
                          rows={5}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-[#9b1b4a] focus:ring-1 focus:ring-[#9b1b4a] outline-none transition-all bg-gray-50 focus:bg-white text-gray-700 placeholder:text-gray-400 resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      {error && (
                        <p className="text-red-500 text-sm bg-red-50 px-4 py-2.5 rounded-lg">{error}</p>
                      )}

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-[#9b1b4a] hover:bg-[#7d1640] text-white rounded-xl font-bold text-base transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Send className="w-5 h-5" /> Send Message
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white p-12 rounded-[2rem] shadow-xl border border-gray-100 text-center flex flex-col items-center justify-center min-h-[400px]"
                >
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  </div>
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h2>
                  <p className="text-gray-600 max-w-md leading-relaxed mb-8">
                    Thank you for reaching out! We'll get back to you within a few hours.
                    You can also chat with us instantly on WhatsApp.
                  </p>
                  <a
                    href="https://wa.me/918862024064"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 px-8 py-3 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-xl font-medium transition-colors shadow-md"
                  >
                    <MessageCircle className="w-5 h-5" /> Chat on WhatsApp
                  </a>
                </motion.div>
              )}
            </FadeUp>
          </div>
        </div>
      </section>

      {/* ═══════════ 3. MAP / LOCATION VISUAL ═══════════ */}
      <section className="bg-[#2d2d3a] py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 text-center md:text-left">
            <FadeUp>
              <h3 className="text-2xl font-bold text-white mb-3">Visit Our Studio</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We're located in the heart of Los Angeles. Walk-ins are welcome,
                but appointments are recommended to guarantee your slot.
              </p>
            </FadeUp>
            <FadeUp delay={0.1}>
              <h4 className="font-bold text-white mb-2">Getting Here</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                Free parking available in the building lot. We're also accessible
                via Metro (Blue Line) — just a 5-minute walk from 7th St station.
              </p>
            </FadeUp>
            <FadeUp delay={0.2}>
              <h4 className="font-bold text-white mb-2">Cancellation Policy</h4>
              <p className="text-gray-400 text-sm leading-relaxed">
                We understand plans change! Please give us at least 24 hours notice
                for cancellations or rescheduling to avoid any fees.
              </p>
            </FadeUp>
          </div>
        </div>
      </section>
    </div>
  );
};
