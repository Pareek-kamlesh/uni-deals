import connectToDatabase from '@lib/mongoose';
import User from '@models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '@lib/auth';

export async function POST(req) {
  await connectToDatabase();
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const action = url.searchParams.get('action');

  try {
    if (action === 'register') {
      const { email, password, username, city, college } = await req.json();

      // Check if user already exists
      if (await User.findOne({ email })) {
        return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
      }

      // Hash the password and create a new user
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ email, password: hashedPassword, username, city, college });
      await newUser.save();

      // Construct the response object, including city and college explicitly
      return new Response(JSON.stringify({
        message: 'User registered successfully',
        user: {
          email: newUser.email,
          username: newUser.username,
          city: newUser.city,          // Include city
          college: newUser.college,    // Include college
          _id: newUser._id
        }
      }), { status: 201 });
    

    
      
      

    }

    if (action === 'login') {
      const { email, password } = await req.json();

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
      }

      // Check if the password matches
      if (!await bcrypt.compare(password, user.password)) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }

      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return new Response(JSON.stringify({ token, expiresIn: 3600 }), { status: 200 });
    }

    if (action === 'change-password') {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      const { currentPassword, newPassword } = await req.json();

      if (!token) {
        return new Response(JSON.stringify({ message: 'Unauthorized access' }), { status: 401 });
      }

      // Verify the JWT token
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
      }

      // Check if the current password matches
      if (!await bcrypt.compare(currentPassword, user.password)) {
        return new Response(JSON.stringify({ message: 'Current password is incorrect' }), { status: 400 });
      }

      // Hash the new password and save the updated user
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();

      return new Response(JSON.stringify({ message: 'Password changed successfully' }), { status: 200 });
    }

    return new Response(JSON.stringify({ message: 'Action not supported' }), { status: 400 });

  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}

export async function GET(req) {
  await connectToDatabase();
  
  const url = new URL(req.url, `http://${req.headers.host}`);
  const action = url.searchParams.get('action');

  if (action === 'protected-route') {
    const token = req.headers.get('Authorization')?.split(' ')[1];

    try {
      const decoded = verifyToken(token);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), { status: 401 });
      }

      return new Response(JSON.stringify({
        message: `Welcome ${user.username}`,
        userId: user._id,
        username: user.username
      }), { status: 200 });
    } catch (err) {
      return new Response(JSON.stringify({ message: err.message }), { status: 401 });
    }
  }

  return new Response(JSON.stringify({ message: 'Action not supported' }), { status: 400 });
}