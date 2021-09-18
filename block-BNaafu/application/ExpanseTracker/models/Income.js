const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const incomeSchema = new Schema(
  {
    source: { type: String, required: true },
    incomeAmount: { type: Number, default: 0, required: true },
    date: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Income', incomeSchema);
