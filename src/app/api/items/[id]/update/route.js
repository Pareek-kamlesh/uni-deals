import connectToDatabase from '../../../../../../lib/mongoose'; // Ensure the correct path
import Item from '../../../../../../models/Item'; // Ensure the correct path
import cloudinary from '../../../../../../lib/cloudinary'; // Ensure the correct path

export async function PUT(req, { params }) {
  const { id } = params;

  // Parse the request body
  const { itemName, description, price, image, sellerPhoneNumber } = await req.json();

  if (!itemName || !description || !price || !sellerPhoneNumber) {
    return new Response(JSON.stringify({ error: 'All fields except the image are required.' }), { status: 400 });
  }

  try {
    await connectToDatabase();

    let updatedFields = { itemName, description, price, sellerPhoneNumber, postedDate: new Date() };

    // Handle image upload only if a new image is provided
    if (image && !image.startsWith('http')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: 'items', // Folder name in Cloudinary
          transformation: [{ width: 500, height: 500, crop: 'limit' }], // Optional resizing
        });

        updatedFields.image = uploadResponse.secure_url; // Use the Cloudinary URL for the new image
      } catch (error) {
        console.error('Cloudinary Upload Error:', error.message);
        return new Response(
          JSON.stringify({ error: 'Failed to upload image. Please try again.' }),
          { status: 500 }
        );
      }
    } else if (image) {
      updatedFields.image = image; // Use the existing image URL
    }

    // Update the item in the database
    const result = await Item.findByIdAndUpdate(
      id,
      updatedFields,
      { new: true } // Return the updated document
    );

    if (!result) {
      return new Response(JSON.stringify({ error: 'Item not found.' }), { status: 404 });
    }

    return new Response(JSON.stringify({ message: 'Item updated successfully.', item: result }), { status: 200 });
  } catch (error) {
    console.error('Error updating item:', error);
    return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
  }
}
