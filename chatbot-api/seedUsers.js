require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./src/models/User'); 

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch((err) => console.error('MongoDB connection error:', err));

const seedUsers = async () => {
  try {
    await User.deleteMany({});

const users = [
  {
    username: 'adminUser',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin',
  },
  {
    username: 'regularUser',
    email: 'user@example.com',
    password: 'userpass',
    role: 'user',
  },
];
    await User.insertMany(users);
    console.log('Users seeded successfully.');
    process.exit();
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedUsers();
