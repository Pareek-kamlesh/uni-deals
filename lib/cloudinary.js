import { config } from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';

// Explicitly load .env.local
config({ path: './.env.local' }); // Adjust the path if necessary

console.log('CLOUDINARY_CLOUD_NAME:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('CLOUDINARY_API_KEY:', process.env.CLOUDINARY_API_KEY ? 'Loaded' : 'Missing');
console.log('CLOUDINARY_API_SECRET:', process.env.CLOUDINARY_API_SECRET ? 'Loaded' : 'Missing');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;
