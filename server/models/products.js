import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const productsSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: false,
  },
  avatar: {
    type: String,
    required: false,
  },
  type: {
    type: String,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
  totalSold: {
    type: Number,
    required: false,
  },
});

export default mongoose.model('products', productsSchema);