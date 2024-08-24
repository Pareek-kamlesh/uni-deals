import dbConnect from '../../../../../lib/mongoose';
import Item from '../../../../../models/Item';
import { verifyToken } from '../../../../../lib/auth';

export async function GET(req) {
  await dbConnect();
  
  try {
    // Extract and verify the token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const decoded = verifyToken(token);
    const items = await Item.find({ postedBy: decoded.userId });
    
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error("Error fetching user-specific items:", error.message);
    return new Response(JSON.stringify({ message: 'Error fetching user-specific items', error: error.message }), { status: 500 });
  }
}
