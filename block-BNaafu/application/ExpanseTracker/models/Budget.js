const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const budgetSchema = new Schema(
  {
    budget: { type: String, required: true },
    expense: { type: String },
    source: { type: String },
    incomeAmount: { type: Number, default: 0 },
    expenseAmount: { type: Number, default: 0 },
    date: { type: Date, default: Date() },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Budget', budgetSchema);
