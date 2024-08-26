import connectToDatabase from '../../../../../../lib/mongoose'; // Ensure the correct path
import Item from '../../../../../..//models/Item'; // Ensure the correct path

export async function PUT(req, { params }) {
  const { id } = params;
  const { itemName, description, price, image, sellerPhoneNumber } = await req.json();

  if (!itemName || !description || !price || !image || !sellerPhoneNumber) {
    return new Response(JSON.stringify({ error: 'All fields are required.' }), { status: 400 });
  }

  try {
    await connectToDatabase();

    const result = await Item.findByIdAndUpdate(
      id,
      { itemName, description, price, image, sellerPhoneNumber, postedDate: new Date() }, // Automatically update postedDate
      { new: true } // Return the updated document
    );

    if (!result) {
      return new Response(JSON.stringify({ error: 'Item not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Item updated successfully.' }), { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
