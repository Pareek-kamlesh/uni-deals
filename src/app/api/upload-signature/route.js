import cloudinary from '../../../../lib/cloudinary';

export async function POST(req) {
  try {
    const { folder } = await req.json(); // Optional: Specify folder for uploaded files
    const timestamp = Math.round(new Date().getTime() / 1000); // Current timestamp
    const signature = cloudinary.utils.api_sign_request(
      {
        timestamp,
        folder: folder || 'items', // Default folder
      },
      process.env.CLOUDINARY_API_SECRET
    );

    return new Response(
      JSON.stringify({
        signature,
        timestamp,
        folder: folder || 'items',
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error('Error generating signature:', error.message);
    return new Response(
      JSON.stringify({ message: 'Failed to generate signature', error: error.message }),
      { status: 500 }
    );
  }
}
