import jwt from 'jsonwebtoken';

export function verifyToken(token) {
  if (!token) {
    throw new Error('Token is missing');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Invalid token');
  }
}
