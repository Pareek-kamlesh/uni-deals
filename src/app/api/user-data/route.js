import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';
import { NextApiRequest, NextApiResponse } from 'next';

export async function GET(req, res) {
  await connectToDatabase();

  try {
    const users = await User.find().select('city college');
    
    // Set Cache-Control header to disable caching for this API route
    res.setHeader('Cache-Control', 'no-store, max-age=0');
    
    // Return the response
    return res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return res.status(500).json({ message: 'Error fetching user data', error: error.message });
  }
}