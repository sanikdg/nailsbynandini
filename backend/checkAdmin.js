import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

// Minimal User Schema definitions for quick script
const userSchema = mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, required: true, default: false },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);

const createOrFindAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    
    let admin = await User.findOne({ email: 'admin@nailsalon.com' });
    
    if (admin) {
      if (!admin.isAdmin) {
        admin.isAdmin = true;
      }
      
      // Update password just so we are 100% sure what it is
      admin.password = 'adminpassword';
      await admin.save();
      
      console.log('--- ADMIN ACCOUNT READY ---');
      console.log('Email: admin@nailsalon.com');
      console.log('Password: adminpassword');
      console.log('---------------------------');
    } else {
      await User.create({
        name: 'Super Admin',
        email: 'admin@nailsalon.com',
        password: 'adminpassword',
        isAdmin: true
      });
      console.log('--- NEW ADMIN CREATED ---');
      console.log('Email: admin@nailsalon.com');
      console.log('Password: adminpassword');
      console.log('---------------------------');
    }
    
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

createOrFindAdmin();
