const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expanseSchema = new Schema(
  {
    expanse: { type: String, required: true },
    expanseAmount: { type: Number, default: 0, required: true },
    date: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expanse', expanseSchema);
