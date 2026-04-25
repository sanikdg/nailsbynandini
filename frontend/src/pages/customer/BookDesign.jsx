import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { DesignSelector } from '../../components/customer/DesignSelector';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { Clock, CheckCircle, XCircle } from 'lucide-react';

// Predefined time slots (1-hour intervals, 9 AM to 6 PM)
const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00',
  '17:00', '18:00',
];

const formatTime = (time) => {
  const [h, m] = time.split(':');
  const hour = parseInt(h);
  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
  return `${displayHour}:${m} ${suffix}`;
};

export const BookDesign = () => {
  const { user } = useAuth();
  const location = useLocation();
  const formRef = useRef(null);
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [formData, setFormData] = useState({
    date: '',
    time: '',
  });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Check if design was passed from Designs page
  useEffect(() => {
    if (location.state?.selectedDesign) {
      setSelectedDesign(location.state.selectedDesign);
      // Scroll to booking form after a short delay
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);
    }
  }, [location.state]);

  // Fetch booked slots when date changes
  useEffect(() => {
    if (!formData.date) {
      setBookedSlots([]);
      return;
    }
    const fetchBookedSlots = async () => {
      setLoadingSlots(true);
      try {
        const { data } = await api.get(`/bookings/booked-slots?date=${formData.date}`);
        setBookedSlots(data.bookedTimes || []);
      } catch (err) {
        console.error('Failed to fetch booked slots:', err);
        setBookedSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };
    fetchBookedSlots();
  }, [formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Reset time if date changes
    if (name === 'date') {
      setFormData((prev) => ({ ...prev, date: value, time: '' }));
    }
  };

  const handleTimeSelect = (time) => {
    if (bookedSlots.includes(time)) return; // Can't select booked slots
    setFormData((prev) => ({ ...prev, time }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDesign) {
      setError('Please select a design');
      return;
    }
    if (!formData.time) {
      setError('Please select a time slot');
      return;
    }

    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await api.post('/bookings', {
        userId: user._id,
        customerName: user.name,
        designName: selectedDesign.title,
        designId: selectedDesign._id,
        date: formData.date,
        time: formData.time,
      });

      setSuccess('Booking created successfully! Admin will confirm soon.');
      setFormData({ date: '', time: '' });
      setSelectedDesign(null);
      setBookedSlots([]);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Booking error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Book a Design</h2>
        <p className="text-slate-600">Select a design and choose your preferred date and time</p>
      </div>

      <DesignSelector onSelectDesign={setSelectedDesign} selectedDesign={selectedDesign} />

      <form ref={formRef} onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-5">
        <h3 className="text-lg font-bold text-slate-900">Booking Details</h3>

        {selectedDesign && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-3">
            <CheckCircle className="text-blue-600 w-5 h-5 flex-shrink-0" />
            <span className="text-sm text-blue-900">
              Selected: <strong>{selectedDesign.title}</strong>
            </span>
          </div>
        )}

        {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200 flex items-center gap-2"><XCircle className="w-4 h-4" />{error}</div>}
        {success && <div className="p-3 bg-green-50 text-green-700 rounded border border-green-200 flex items-center gap-2"><CheckCircle className="w-4 h-4" />{success}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            min={new Date().toISOString().split('T')[0]}
            required
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Time Slot Picker */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Select Time Slot
          </label>
          {!formData.date ? (
            <p className="text-sm text-slate-400 italic">Please select a date first</p>
          ) : loadingSlots ? (
            <p className="text-sm text-slate-500">Checking availability...</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2">
              {TIME_SLOTS.map((slot) => {
                const isBooked = bookedSlots.includes(slot);
                const isSelected = formData.time === slot;
                return (
                  <button
                    key={slot}
                    type="button"
                    disabled={isBooked}
                    onClick={() => handleTimeSelect(slot)}
                    className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border-2 ${
                      isBooked
                        ? 'bg-red-50 border-red-200 text-red-400 cursor-not-allowed line-through'
                        : isSelected
                        ? 'bg-blue-600 border-blue-600 text-white shadow-md scale-105'
                        : 'bg-white border-slate-200 text-slate-700 hover:border-blue-400 hover:bg-blue-50'
                    }`}
                  >
                    {formatTime(slot)}
                    {isBooked && <span className="block text-[10px] mt-0.5 no-underline" style={{textDecoration: 'none'}}>Booked</span>}
                  </button>
                );
              })}
            </div>
          )}
          {formData.date && !loadingSlots && bookedSlots.length > 0 && (
            <p className="text-xs text-slate-500 mt-2">
              🔴 Red slots are already booked for this date
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !selectedDesign || !formData.time}
          className="w-full bg-slate-900 text-white py-3 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  );
};

