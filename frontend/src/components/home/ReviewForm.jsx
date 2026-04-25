import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

export const ReviewForm = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('=== REVIEW FORM SUBMISSION START ===');
    console.log('User:', user);
    console.log('Text:', text);
    console.log('Rating:', rating);
    
    if (!user) {
      console.log('No user found');
      setError('Please log in to submit a review');
      return;
    }

    if (!text.trim()) {
      console.log('Text is empty');
      setError('Please write a review');
      return;
    }

    if (text.trim().length < 10) {
      console.log('Text too short:', text.trim().length);
      setError('Review must be at least 10 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Sending API request...');
      const response = await api.post('/testimonials/submit-review', {
        text: text.trim(),
        rating,
      });
      console.log('=== REVIEW SUBMITTED SUCCESSFULLY ===');
      console.log('Response:', response.data);
      setSubmitted(true);
      setText('');
      setRating(5);
      setTimeout(() => setSubmitted(false), 5000);
    } catch (err) {
      console.error('=== REVIEW SUBMISSION FAILED ===');
      console.error('Error:', err);
      console.error('Error response:', err.response);
      console.error('Error message:', err.message);
      setError(err.response?.data?.message || err.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Share Your Experience</h2>
        <p className="text-slate-600">We'd love to hear about your nail art experience! Your feedback helps us improve and inspire other customers.</p>
      </div>

      <div className="space-y-6">
        {!user ? (
          <div className="text-center py-12">
            <AlertCircle className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600 mb-4">Please log in to submit a review</p>
            <a
              href="/auth"
              className="inline-block px-6 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition"
            >
              Log In
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Success Message */}
            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="p-4 bg-green-50 text-green-700 rounded-lg border border-green-200 flex items-center gap-3"
              >
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">Review submitted successfully!</p>
                  <p className="text-sm">Your review will be displayed after admin approval.</p>
                </div>
              </motion.div>
            )}

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center gap-3"
              >
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p>{error}</p>
              </motion.div>
            )}

            {/* Customer Name (read-only) */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Name</label>
              <input
                type="text"
                value={user.name}
                readOnly
                className="w-full px-4 py-3 border border-slate-200 rounded-lg bg-slate-50 text-slate-600 cursor-not-allowed"
              />
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3">Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      size={32}
                      className={`${
                        star <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-slate-300'
                      } transition-colors`}
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm text-slate-500 mt-2">
                {rating === 1 && 'Poor'}
                {rating === 2 && 'Fair'}
                {rating === 3 && 'Good'}
                {rating === 4 && 'Very Good'}
                {rating === 5 && 'Excellent'}
              </p>
            </div>

            {/* Review Text */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Your Review</label>
              <textarea
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Share your experience with our nail art services..."
                rows={5}
                className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none text-slate-700 bg-white"
              />
              <p className="text-xs text-slate-500 mt-2">
                {text.length} characters (minimum 10)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !text.trim()}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-600 text-white font-semibold rounded-lg transition shadow-sm"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Review
                </>
              )}
            </button>

            <p className="text-xs text-slate-500 text-center">
              Your review will be displayed on our website after admin approval.
            </p>
          </form>
        )}
      </div>
    </div>
  );
};
