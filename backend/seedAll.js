import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Service from './models/Service.js';
import Appointment from './models/Appointment.js';
import Inquiry from './models/Inquiry.js';
import Conversation from './models/Conversation.js';
import Message from './models/Message.js';
import Design from './models/Design.js';
import SavedDesign from './models/SavedDesign.js';

dotenv.config();

const seedAll = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // ──────────────────────────────────────
    // 1. USERS (1 admin + 2 customers)
    // ──────────────────────────────────────
    await User.deleteMany({});
    console.log('🗑️  Cleared users');

    const salt = await bcrypt.genSalt(10);

    const users = await User.insertMany([
      {
        name: 'Nandini (Admin)',
        email: 'admin@nailsbynandini.com',
        password: await bcrypt.hash('admin123', salt),
        isAdmin: true,
      },
      {
        name: 'Priya Sharma',
        email: 'priya@example.com',
        password: await bcrypt.hash('user123', salt),
        isAdmin: false,
      },
      {
        name: 'Ananya Patel',
        email: 'ananya@example.com',
        password: await bcrypt.hash('user123', salt),
        isAdmin: false,
      },
    ]);
    console.log(`👤 Seeded ${users.length} users`);

    const admin = users[0];
    const customer1 = users[1];
    const customer2 = users[2];

    // ──────────────────────────────────────
    // 2. SERVICES (with images)
    // ──────────────────────────────────────
    await Service.deleteMany({});
    console.log('🗑️  Cleared services');

    const services = await Service.insertMany([
      {
        title: 'Gel Manicure',
        description: 'Long-lasting gel polish with cuticle care and nail shaping',
        duration: 60,
        price: 1200,
        category: 'Manicure',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        isActive: true,
        order: 1,
      },
      {
        title: 'Nail Art - Floral',
        description: 'Hand-painted floral designs on all nails with premium colors',
        duration: 90,
        price: 1800,
        category: 'Nail Art',
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80',
        isActive: true,
        order: 2,
      },
      {
        title: 'Pedicure Deluxe',
        description: 'Full spa pedicure with foot soak, scrub, massage, and mask',
        duration: 75,
        price: 1500,
        category: 'Pedicure',
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=80',
        isActive: true,
        order: 3,
      },
      {
        title: 'Acrylic Extensions',
        description: 'Full set of acrylic nail extensions with your choice of shape',
        duration: 120,
        price: 2500,
        category: 'Extensions',
        image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=80',
        isActive: true,
        order: 4,
      },
      {
        title: 'Bridal Nail Package',
        description: 'Premium bridal nail art with gems, foils, and custom design consultation',
        duration: 150,
        price: 3500,
        category: 'Special',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        isActive: true,
        order: 5,
      },
    ]);
    console.log(`💅 Seeded ${services.length} services`);

    // ──────────────────────────────────────
    // 3. DESIGNS (gallery items)
    // ──────────────────────────────────────
    await Design.deleteMany({});
    console.log('🗑️  Cleared designs');

    const designs = await Design.insertMany([
      {
        title: 'Rose Gold French Tips',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        price: 1500,
        category: 'Nail Art',
      },
      {
        title: 'Marble Effect Nails',
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80',
        price: 1800,
        category: 'Nail Art',
      },
      {
        title: 'Pastel Ombre Set',
        image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=80',
        price: 2000,
        category: 'Nail Art',
      },
      {
        title: 'Minimal Nude Design',
        image: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=400&q=80',
        price: 1200,
        category: 'Manicure',
      },
    ]);
    console.log(`🎨 Seeded ${designs.length} designs`);

    // ──────────────────────────────────────
    // 4. SAVED DESIGNS (wishlists)
    // ──────────────────────────────────────
    await SavedDesign.deleteMany({});
    console.log('🗑️  Cleared saved designs');

    const savedDesigns = await SavedDesign.insertMany([
      { userId: customer1._id, designId: designs[0]._id },
      { userId: customer1._id, designId: designs[1]._id },
      { userId: customer2._id, designId: designs[2]._id },
    ]);
    console.log(`❤️  Seeded ${savedDesigns.length} saved designs`);

    // ──────────────────────────────────────
    // 5. INQUIRIES / DESIGN REQUESTS
    // ──────────────────────────────────────
    await Inquiry.deleteMany({});
    console.log('🗑️  Cleared inquiries');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dayAfter = new Date();
    dayAfter.setDate(dayAfter.getDate() + 2);

    const inquiries = await Inquiry.insertMany([
      {
        userId: customer1._id,
        designId: designs[0]._id,
        description: 'I would love a custom bridal nail art design with gold accents and small pearls. Planning for my wedding in May.',
        image: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=400&q=80',
        preferredDate: nextWeek,
        status: 'Pending',
      },
      {
        userId: customer2._id,
        designId: designs[2]._id,
        description: 'Looking for pastel ombre nails for a birthday party. Something elegant but fun with a bit of glitter on the ring finger.',
        image: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=400&q=80',
        preferredDate: dayAfter,
        status: 'Confirmed',
      },
      {
        userId: customer1._id,
        description: 'I found this marble nail design on Pinterest and would love something similar. Can you add rose gold lines?',
        image: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=400&q=80',
        status: 'Discussing',
      },
    ]);
    console.log(`💌 Seeded ${inquiries.length} inquiries`);

    // ──────────────────────────────────────
    // 6. APPOINTMENTS (linked to approved inquiry)
    // ──────────────────────────────────────
    await Appointment.deleteMany({});
    console.log('🗑️  Cleared appointments');

    const appointments = await Appointment.insertMany([
      {
        userId: customer2._id,
        inquiryId: inquiries[1]._id,
        service: 'Pastel ombre nails for birthday party',
        date: dayAfter.toISOString().split('T')[0],
        time: '2:00 PM',
        status: 'Confirmed',
        adminConfirmed: true,
        notes: 'Pastel ombre with glitter accent on ring finger',
      },
      {
        userId: customer1._id,
        service: 'Gel Manicure',
        date: tomorrow.toISOString().split('T')[0],
        time: '10:00 AM',
        status: 'Pending',
        notes: 'First time visit, prefers pastel shades',
      },
    ]);
    console.log(`📅 Seeded ${appointments.length} appointments`);

    // ──────────────────────────────────────
    // 7. CONVERSATIONS & MESSAGES
    // ──────────────────────────────────────
    await Conversation.deleteMany({});
    await Message.deleteMany({});
    console.log('🗑️  Cleared conversations & messages');

    // Conversation for the discussing inquiry
    const conv1 = await Conversation.create({
      participants: [customer1._id, admin._id],
      inquiryId: inquiries[2]._id,
      lastMessage: 'Yes, I can add rose gold marble lines! Would you prefer matte or glossy finish?',
      lastMessageAt: new Date(),
    });

    await Message.insertMany([
      {
        conversationId: conv1._id,
        senderId: customer1._id,
        text: 'Hi! I found this marble nail design and I love it. Can you do something similar with rose gold lines?',
        messageType: 'text',
        readBy: [customer1._id, admin._id],
      },
      {
        conversationId: conv1._id,
        senderId: admin._id,
        text: 'That design looks beautiful! I can definitely do marble with rose gold accents. Would you like it on all nails or just accent nails?',
        messageType: 'text',
        readBy: [admin._id],
      },
      {
        conversationId: conv1._id,
        senderId: customer1._id,
        text: 'All nails please! But maybe the ring finger can have a bit more detail?',
        messageType: 'text',
        readBy: [customer1._id, admin._id],
      },
      {
        conversationId: conv1._id,
        senderId: admin._id,
        text: 'Yes, I can add rose gold marble lines! Would you prefer matte or glossy finish?',
        messageType: 'text',
        readBy: [admin._id],
      },
    ]);

    // Conversation for the confirmed inquiry
    const conv2 = await Conversation.create({
      participants: [customer2._id, admin._id],
      inquiryId: inquiries[1]._id,
      appointmentId: appointments[0]._id,
      lastMessage: 'Your appointment is confirmed! See you on ' + dayAfter.toLocaleDateString(),
      lastMessageAt: new Date(Date.now() - 3600000),
    });

    await Message.insertMany([
      {
        conversationId: conv2._id,
        senderId: customer2._id,
        text: 'Hi, I submitted a design request for pastel ombre nails. When can I come in?',
        messageType: 'text',
        readBy: [customer2._id, admin._id],
      },
      {
        conversationId: conv2._id,
        senderId: admin._id,
        text: 'Your appointment is confirmed! See you on ' + dayAfter.toLocaleDateString(),
        messageType: 'text',
        readBy: [customer2._id, admin._id],
      },
    ]);

    console.log(`💬 Seeded 2 conversations with 6 messages`);

    // ──────────────────────────────────────
    // Summary
    // ──────────────────────────────────────
    console.log('\n════════════════════════════════════');
    console.log('🎉 Database seeded successfully!');
    console.log('════════════════════════════════════');
    console.log('\n📋 Login Credentials:');
    console.log('   Admin:    admin@nailsbynandini.com / admin123');
    console.log('   Customer: priya@example.com / user123');
    console.log('   Customer: ananya@example.com / user123');
    console.log('\n📦 Data:');
    console.log(`   ${services.length} services (with images)`);
    console.log(`   ${designs.length} designs`);
    console.log(`   ${savedDesigns.length} saved designs`);
    console.log(`   ${inquiries.length} design requests (1 pending, 1 discussing, 1 confirmed)`);
    console.log(`   ${appointments.length} appointments`);
    console.log(`   2 conversations with 6 messages`);
    console.log('');

    await mongoose.connection.close();
    console.log('🔌 Connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedAll();
