const mongoose = require('mongoose');

let ExpenseModel = {};

const ExpenseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

ExpenseModel = mongoose.model('Expense', ExpenseSchema);
module.exports = ExpenseModel;
