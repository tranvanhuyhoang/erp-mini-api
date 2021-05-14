import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const customerSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: false,
  },
  phone: {
    type: String,
    required: false,
  },
  dayOfBirth: {
    type: Date,
    required: false,
  },
  listProductsBought: {
    type: Array,
    required: false,
  },
  countOrder: {
    type: Number,
    required: false,
  }
});

export default mongoose.model('Customer', customerSchema);