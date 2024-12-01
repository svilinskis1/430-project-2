
const mongoose = require('mongoose');

let BudgetModel = {};

const BudgetSchema = new mongoose.Schema({
  income: {
    type: Number,
    required: true,
  },
  expenses: {
    type: Array,
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

BudgetModel = mongoose.model('Budget', BudgetSchema);
module.exports = BudgetModel;
