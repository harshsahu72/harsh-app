try {
  require('dns').setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  console.warn('Failed to set custom DNS servers:', e);
}

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const users = [
  {
    name: "Alex",
    email: "alex@example.com",
    password: "password123",
    age: 24,
    gender: "female",
    interestedIn: ["male", "non-binary"],
    bio: "Love hiking and outdoor adventures!",
    interests: ["Hiking", "Photography", "Travel"],
    photos: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
    location: { city: "New York", country: "USA" },
    isProfileComplete: true,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    name: "Sam",
    email: "sam@example.com",
    password: "password123",
    age: 28,
    gender: "male",
    interestedIn: ["female"],
    bio: "Coffee addict and tech enthusiast.",
    interests: ["Coffee", "Coding", "Music"],
    photos: ["https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
    location: { city: "San Francisco", country: "USA" },
    isProfileComplete: true,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    name: "Jordan",
    email: "jordan@example.com",
    password: "password123",
    age: 26,
    gender: "non-binary",
    interestedIn: ["everyone"],
    bio: "Art student looking for inspiration and good vibes.",
    interests: ["Art", "Museums", "Yoga"],
    photos: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
    location: { city: "Los Angeles", country: "USA" },
    isProfileComplete: true,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    name: "Jessica",
    email: "jessica@example.com",
    password: "password123",
    age: 23,
    gender: "female",
    interestedIn: ["male", "female"],
    bio: "Fitness junkie and food lover. Let's get tacos!",
    interests: ["Fitness", "Foodie", "Dancing"],
    photos: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
    location: { city: "Miami", country: "USA" },
    isProfileComplete: true,
    isVerified: true,
    verificationStatus: 'verified'
  },
  {
    name: "David",
    email: "david@example.com",
    password: "password123",
    age: 30,
    gender: "male",
    interestedIn: ["female"],
    bio: "Dog dad looking for someone to join our pack.",
    interests: ["Dogs", "Movies", "Cooking"],
    photos: ["https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
    location: { city: "Chicago", country: "USA" },
    isProfileComplete: true,
    isVerified: true,
    verificationStatus: 'verified'
  },
  // Demo account used by the "Try Demo Account" button on the login page
  {
    name: "Demo User",
    email: "demo@flamr.com",
    password: "demo1234",
    age: 25,
    gender: "male",
    interestedIn: ["everyone"],
    bio: "This is the demo account for Flamr. Swipe away! 🔥",
    interests: ["Travel", "Music", "Fitness", "Photography"],
    photos: ["https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"],
    location: { city: "Mumbai", country: "India" },
    isProfileComplete: true,
    isVerified: true,
    verificationStatus: 'verified'
  }
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/flamr');
    console.log('✅ Connected to MongoDB for seeding');

    let created = 0;
    let skipped = 0;

    for (const userData of users) {
      const existing = await User.findOne({ email: userData.email });
      if (existing) {
        console.log(`⏭️  Skipping existing user: ${userData.email}`);
        skipped++;
        continue;
      }
      await User.create(userData);
      console.log(`🌱 Created user: ${userData.email}`);
      created++;
    }

    console.log(`\n✅ Seed complete! Created: ${created}, Skipped: ${skipped}`);
    mongoose.connection.close();
    console.log('👋 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
