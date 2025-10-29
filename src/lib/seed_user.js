import dbConnect from './db.js';
import User from '../models/User.js';
import { seedUsers } from './seedUsers.js';

const seedUserDB = async () => {
  await dbConnect();
  await User.deleteMany({});
  await User.insertMany(seedUsers);
  console.log('User Database seeded!');
};

export default seedUserDB;