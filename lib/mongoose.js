import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

// Use global object to cache the mongoose connection across hot reloads in dev environment
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongoose) => {
      console.log('Connected to MongoDB');
      return mongoose;
    }).catch((error) => {
      console.error('MongoDB connection error:', error);
      throw error;  // Ensure we throw errors to handle connection failures
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectToDatabase;
