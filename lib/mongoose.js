// lib/mongoose.js
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;

if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

let cachedClient = global.mongoose;

if (!cachedClient) {
  cachedClient = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
  if (cachedClient.conn) {
    return cachedClient.conn;
  }

  if (!cachedClient.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    };

    cachedClient.promise = mongoose.connect(uri, opts).then((mongoose) => {
      return mongoose;
    });
  }
  cachedClient.conn = await cachedClient.promise;
  return cachedClient.conn;
}

export default connectToDatabase;
