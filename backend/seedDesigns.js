import mongoose from 'mongoose';
import Design from './models/Design.js';
import dotenv from 'dotenv';

dotenv.config();

const designs = [
  { title: 'Classic Bridal', image: 'http://localhost:5000/sanu/hand1.jpeg', category: 'Bridal', price: 45 },
  { title: 'Elegant Minimal', image: 'http://localhost:5000/sanu/hand2.jpeg', category: 'Minimal', price: 35 },
  { title: 'Trendy Neon', image: 'http://localhost:5000/sanu/hand4.jpeg', category: 'Trendy', price: 40 },
  { title: 'Abstract Art', image: 'http://localhost:5000/sanu/hand5.jpeg', category: 'Abstract', price: 38 },
  { title: 'Spring Bloom', image: 'http://localhost:5000/sanu/hand6.jpeg', category: 'Seasonal', price: 42 },
  { title: 'Modern Geometric', image: 'http://localhost:5000/sanu/hand7.jpeg', category: 'Trendy', price: 39 },
  { title: 'Luxury Gold', image: 'http://localhost:5000/sanu/hand8.jpeg', category: 'Bridal', price: 50 },
  { title: 'Minimalist White', image: 'http://localhost:5000/sanu/hand9.jpeg', category: 'Minimal', price: 33 },
  { title: 'Vibrant Rainbow', image: 'http://localhost:5000/sanu/hand10.jpeg', category: 'Trendy', price: 41 },
  { title: 'Artistic Strokes', image: 'http://localhost:5000/sanu/hand11.jpeg', category: 'Abstract', price: 37 },
  { title: 'Winter Frost', image: 'http://localhost:5000/sanu/hand12.jpeg', category: 'Seasonal', price: 43 },
  { title: 'Sleek Black', image: 'http://localhost:5000/sanu/hand13.jpeg', category: 'Minimal', price: 34 },
  { title: 'Floral Paradise', image: 'http://localhost:5000/sanu/hand14.jpeg', category: 'Bridal', price: 46 },
  { title: 'Bold Statement', image: 'http://localhost:5000/sanu/hand15.jpeg', category: 'Trendy', price: 42 },
  { title: 'Pastel Dreams', image: 'http://localhost:5000/sanu/hand16.jpeg', category: 'Seasonal', price: 40 },
  { title: 'Metallic Shine', image: 'http://localhost:5000/sanu/hand18.jpeg', category: 'Trendy', price: 44 },
  { title: 'Elegant Lace', image: 'http://localhost:5000/sanu/hnad17.jpeg', category: 'Bridal', price: 48 },
  { title: 'Minimalist Dots', image: 'http://localhost:5000/sanu/hand20.jpeg', category: 'Minimal', price: 32 },
  { title: 'Summer Vibes', image: 'http://localhost:5000/sanu/hand21.jpeg', category: 'Seasonal', price: 41 },
  { title: 'Artistic Blend', image: 'http://localhost:5000/sanu/hand22.jpeg', category: 'Abstract', price: 39 },
  { title: 'Chic Pattern', image: 'http://localhost:5000/sanu/hand23.jpeg', category: 'Trendy', price: 40 },
  { title: 'Royal Purple', image: 'http://localhost:5000/sanu/hand24.jpeg', category: 'Bridal', price: 47 },
  { title: 'Clean Lines', image: 'http://localhost:5000/sanu/hand25.jpeg', category: 'Minimal', price: 35 },
  { title: 'Autumn Leaves', image: 'http://localhost:5000/sanu/hand26.jpeg', category: 'Seasonal', price: 42 },
  { title: 'Modern Art', image: 'http://localhost:5000/sanu/hand27.jpeg', category: 'Abstract', price: 38 },
  { title: 'Trendy Ombre', image: 'http://localhost:5000/sanu/hand28.jpeg', category: 'Trendy', price: 41 },
  { title: 'Wedding Ready', image: 'http://localhost:5000/sanu/hand29.jpeg', category: 'Bridal', price: 49 },
  { title: 'Artistic Expression', image: 'http://localhost:5000/sanu/hnad19.jpeg', category: 'Abstract', price: 40 },
  { title: 'Festival Colors', image: 'http://localhost:5000/sanu/hand31.jpeg', category: 'Seasonal', price: 43 },
];

async function seedDesigns() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/nail-salon');
    console.log('Connected to MongoDB');

    // Clear existing designs
    await Design.deleteMany({});
    console.log('Cleared existing designs');

    // Insert new designs
    const result = await Design.insertMany(designs);
    console.log(`Successfully added ${result.length} designs!`);

    await mongoose.connection.close();
    console.log('Connection closed');
  } catch (error) {
    console.error('Error seeding designs:', error);
    process.exit(1);
  }
}

seedDesigns();
