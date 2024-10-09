import connectToDatabase from '../../../../lib/mongoose';
import User from '../../../../models/User';

export async function GET(req) {
  await connectToDatabase();

  try {
    const users = await User.find().select('city college');
    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    console.error("Error fetching user data:", error.message);
    return new Response(JSON.stringify({ message: 'Error fetching user data', error: error.message }), { status: 500 });
  }
}