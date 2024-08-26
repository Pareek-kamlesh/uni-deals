// api/items/route.js
import connectToDatabase from '../../../../lib/mongoose';
import Item from '../../../../models/Item';
import { verifyToken } from '../../../../lib/auth';

export async function GET(req) {
  await connectToDatabase();

  try {
    const items = await Item.find();
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error("Error fetching items:", error.message);
    return new Response(JSON.stringify({ message: 'Error fetching items', error: error.message }), { status: 500 });
  }
}

export async function POST(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1];
  if (!token) {
    return new Response(JSON.stringify({ message: 'Authorization token missing' }), { status: 401 });
  }

  const verifiedUser = verifyToken(token);
  if (!verifiedUser) {
    return new Response(JSON.stringify({ message: 'Invalid or expired token' }), { status: 401 });
  }

  const { itemName, description, price, image, sellerPhoneNumber } = await req.json();

  await connectToDatabase();

  try {
    const newItem = await Item.create({
      itemName,
      description,
      price,
      image,
      sellerPhoneNumber,
      postedBy: verifiedUser.userId,
    });

    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (error) {
    console.error("Error creating item:", error.message);
    return new Response(JSON.stringify({ message: 'Error creating item', error: error.message }), { status: 500 });
  }
}
