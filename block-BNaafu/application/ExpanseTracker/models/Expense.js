const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const expenseSchema = new Schema(
  {
    expense: { type: String, required: true },
    expenseAmount: { type: Number, default: 0, required: true },
    date: { type: Date, required: true },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Expense', expenseSchema);
