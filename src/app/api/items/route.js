import dbConnect from '../../../../lib/mongoose';
import Item from '../../../../models/Item';
import { verifyToken } from '../../../../lib/auth';  // Import the verifyToken function

export async function GET(req) {
  await dbConnect();
  
  try {
    const items = await Item.find();
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error.message);
    return new Response(JSON.stringify({ message: 'Error fetching items', error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  
  try {
    // Extract and verify the token
    const token = req.headers.get('Authorization')?.split(' ')[1];
    if (!token) {
      return new Response(JSON.stringify({ message: 'Unauthorized' }), { status: 401 });
    }

    const decoded = verifyToken(token);
    const { itemName, description, price, image } = await req.json();

    // Create and save the new item
    const newItem = new Item({
      itemName,
      description,
      price,
      image,
      postedDate: new Date(),
      postedBy: decoded.userId,  // Assuming userId from token
    });

    await newItem.save();
    return new Response(JSON.stringify({ message: 'Item added successfully' }), { status: 201 });
  } catch (error) {
    console.error("Error adding item:", error.message);
    return new Response(JSON.stringify({ message: 'Error adding item', error: error.message }), { status: 500 });
  }
}
