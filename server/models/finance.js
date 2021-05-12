import mongoose from 'mongoose';
mongoose.Promise = global.Promise;

const financeSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  date: {
    type: String,
    required: false,
  },
  mountSale: {
    type: Number,
    required: true,
  },
  totalMoney: {
    type: String,
    required: true,
  },
  inventory: {
    type: Number,
    required: true,
  }
});

export default mongoose.model('Finance', financeSchema);