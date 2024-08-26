// api/items/[id]/route.js
import connectToDatabase from '../../../../../lib/mongoose';
import Item from '../../../../../models/Item';

export async function GET(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const item = await Item.findById(id);
    if (!item) {
      return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
    }

    return new Response(JSON.stringify(item), { status: 200 });
  } catch (error) {
    console.error("Error fetching item:", error.message);
    return new Response(JSON.stringify({ message: 'Error fetching item', error: error.message }), { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await connectToDatabase();
  const { id } = params;

  try {
    const result = await Item.findByIdAndDelete(id);
    if (!result) {
      return new Response(JSON.stringify({ message: 'Item not found' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Item deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error("Error deleting item:", error.message);
    return new Response(JSON.stringify({ message: 'Error deleting item', error: error.message }), { status: 500 });
  }
}
