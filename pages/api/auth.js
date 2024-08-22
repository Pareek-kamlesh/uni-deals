import connectToDatabase from '../../lib/mongoose';
import User from '../../models/User';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Function to verify JWT token
const verifyToken = (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer <token>
  if (!token) {
    return res.status(401).json({ message: 'Token is missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Main handler function
export default async function handler(req, res) {
  await connectToDatabase(); // Ensure the database connection is established

  const { email, password, username } = req.body;

  if (req.method === 'POST' && req.query.action === 'register') {
    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const newUser = new User({
      email,
      password: hashedPassword,
      username, // Include username
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully' });
  }

  if (req.method === 'POST' && req.query.action === 'login') {
    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the password matches
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return res.status(200).json({ token });
  }

  // Example protected route
  if (req.method === 'GET' && req.query.action === 'protected-route') {
    verifyToken(req, res);
    
    // Assuming you have a way to find the user by ID
    const user = await User.findById(req.user.userId);
    if (user) {
      return res.status(200).json({ 
        message: `Welcome ${user.username}`, // Include username in response
        userId: user._id,
        username: user.username
      });
    } else {
      return res.status(401).json({ message: 'User not found' });
    }
  }

  if (req.method === 'POST' && req.query.action === 'change-password') {
    verifyToken(req, res);
    
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
  
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ message: 'Invalid current password' });
    }
  
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  
    return res.status(200).json({ message: 'Password changed successfully' });
  }
  
  

  // Method not allowed for other cases
  res.status(405).json({ message: 'Method not allowed' });
}
