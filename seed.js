import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js';

dotenv.config();

const initialUsers = [
  { name: 'Rahul', totalPoints: 0 },
  { name: 'Kamal', totalPoints: 0 },
  { name: 'Sanak', totalPoints: 0 },
  { name: 'Priya', totalPoints: 0 },
  { name: 'Amit', totalPoints: 0 },
  { name: 'Neha', totalPoints: 0 },
  { name: 'Vikram', totalPoints: 0 },
  { name: 'Anjali', totalPoints: 0 },
  { name: 'Rajesh', totalPoints: 0 },
  { name: 'Sneha', totalPoints: 0 }
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('Connected to MongoDB');

    // Drop the entire database to start fresh
    await mongoose.connection.db.dropDatabase();
    console.log('Dropped existing database');

    // Clear existing users (in case the drop didn\'t work)
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Insert initial users
    const users = await User.insertMany(initialUsers);
    console.log(`Seeded ${users.length} users:`);
    
    users.forEach(user => {
      console.log(`- ${user.name}`);
    });

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase(); 