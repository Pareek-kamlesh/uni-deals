import mongoose from 'mongoose';

const ItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // This stores the file path or URL of the image
  postedDate: { type: Date, default: Date.now },
  postedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the user who posted the item
});

export default mongoose.models.Item || mongoose.model('Item', ItemSchema);
