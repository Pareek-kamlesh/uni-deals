import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { verifyToken } from '../../../../lib/auth';


// POST request handler for login and register
export async function POST(req) {
    await connectToDatabase();
  
    const url = new URL(req.url, `http://${req.headers.host}`);
    const action = url.searchParams.get('action');
  
    console.log(`POST request received with action: ${action}`); // Debugging
  
    if (action === 'register') {
      const body = await req.json();
      const { email, password, username } = body;
  
      // Check if user already exists
      const userExists = await User.findOne({ email });
  
      if (userExists) {
        return new Response(JSON.stringify({ message: 'User already exists' }), { status: 400 });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({ email, password: hashedPassword, username });
      await newUser.save();
  
      return new Response(JSON.stringify({ message: 'User registered successfully' }), { status: 201 });
    }
  
    if (action === 'login') {
      const body = await req.json();
      const { email, password } = body;
  
      // Find the user by email
      const user = await User.findOne({ email });
  
      if (!user) {
        return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
      }
  
      // Check if the password matches
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return new Response(JSON.stringify({ message: 'Invalid credentials' }), { status: 401 });
      }
  
      // Generate JWT token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const expiresIn = 3600;
  
      return new Response(JSON.stringify({ token, expiresIn }), { status: 200 });
    }

    if (action === 'change-password') {
      const token = req.headers.get('Authorization')?.split(' ')[1];
      const body = await req.json();
      const { currentPassword, newPassword } = body;

      if (!token) {
          return new Response(JSON.stringify({ message: 'Unauthorized access' }), { status: 401 });
      }

      try {
          // Verify the JWT token
          const decoded = verifyToken(token);
          const user = await User.findById(decoded.userId);

          if (!user) {
              return new Response(JSON.stringify({ message: 'User not found' }), { status: 404 });
          }

          // Check if the current password matches
          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
              return new Response(JSON.stringify({ message: 'Current password is incorrect' }), { status: 400 });
          }

          // Hash the new password
          const hashedNewPassword = await bcrypt.hash(newPassword, 10);
          user.password = hashedNewPassword;

          // Save the updated user with the new password
          await user.save();

          return new Response(JSON.stringify({ message: 'Password changed successfully' }), { status: 200 });
      } catch (err) {
          return new Response(JSON.stringify({ message: err.message }), { status: 500 });
      }
  }
  
    return new Response(JSON.stringify({ message: 'Action not supported' }), { status: 400 });
  }
  
  // GET request handler for protected routes
  export async function GET(req) {
    await connectToDatabase();
  
    const url = new URL(req.url, `http://${req.headers.host}`);
    const action = url.searchParams.get('action');
  
    console.log(`GET request received with action: ${action}`); // Debugging
  
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