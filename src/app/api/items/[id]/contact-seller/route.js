// api/items/[id]/contact-seller.js
import { twilioClient, twilioFrom } from '../../../../../../lib/twilioClient';
import connectToDatabase from '../../../../../../lib/mongoose';
import Item from '../../../../../../models/Item';

export async function POST(req, { params }) {
  const { id } = params;
  const { phoneNumber } = await req.json();

  if (!phoneNumber) {
    return new Response(JSON.stringify({ message: 'Phone number is required' }), { status: 400 });
  }

  try {
    await connectToDatabase();

    const item = await Item.findById(id);
    if (!item) {
      return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
    }

    const sellerPhoneNumber = item.sellerPhoneNumber;

    await twilioClient.messages.create({
      body: `You have a new buyer! Contact them at ${phoneNumber}.`,
      from: twilioFrom,
      to: sellerPhoneNumber,
    });

    return new Response(JSON.stringify({ message: 'Contact information sent to the seller' }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Internal server error' }), { status: 500 });
  }
}