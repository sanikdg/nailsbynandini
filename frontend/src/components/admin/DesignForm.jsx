import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import api from '../../services/api';

export const DesignForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Misc',
    image: null,
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const clearImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
      setImagePreview(null);
    }
    // Reset file input
    const input = document.getElementById('image-input');
    if (input) input.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('category', formData.category);
      if (formData.image) {
        data.append('image', formData.image);
      }

      await api.post('/designs', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setFormData({ title: '', category: 'Misc', image: null });
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to add design');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-slate-200 shadow-sm space-y-4">
      <h2 className="text-xl font-bold text-slate-900">Add New Design</h2>

      {error && <div className="p-3 bg-red-50 text-red-700 rounded border border-red-200">{error}</div>}

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Design Title</label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="e.g., Glitter Ombre"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Category</label>
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="Misc">Miscellaneous</option>
          <option value="Bridal">Bridal</option>
          <option value="Minimal">Minimal</option>
          <option value="Trendy">Trendy</option>
          <option value="Abstract">Abstract</option>
          <option value="Nail Art">Nail Art</option>
          <option value="Manicure">Manicure</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Upload Image</label>
        <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            id="image-input"
          />
          <label htmlFor="image-input" className="cursor-pointer flex flex-col items-center gap-2">
            <Upload size={24} className="text-slate-400" />
            <span className="text-sm text-slate-600">
              {formData.image ? formData.image.name : 'Click to upload image'}
            </span>
          </label>
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-3 relative inline-block">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-slate-200 shadow-sm"
            />
            <button
              type="button"
              onClick={clearImage}
              className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition shadow-md"
            >
              <X size={14} />
            </button>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 text-white py-2 rounded-lg font-medium hover:bg-slate-800 transition disabled:opacity-50"
      >
        {loading ? 'Adding...' : 'Add Design'}
      </button>
    </form>
  );
};

