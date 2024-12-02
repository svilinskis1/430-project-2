const { Expense } = require('../models');

const budgetingPage = async (req, res) => res.render('app');

const getExpenses = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Expense.find(query).select('name amount').lean().exec();

    return res.json({ expenses: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving expenses!' });
  }
};

const addExpense = async (req, res) => {
  if (!req.body.name || !req.body.amount) {
    return res.status(400).json({ error: 'Name and amount are both required!' });
  }

  const expenseData = {
    name: req.body.name,
    amount: req.body.amount,
    owner: req.session.account._id,
  };

  try {
    const newExpense = new Expense(expenseData);
    await newExpense.save();
    return res.status(201).json({
      name: newExpense.name,
      amount: newExpense.amount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured adding the expense!' });
  }
};


const changeIncome = async (req, res) => {
  return res.json({ message:"hi" });
};

module.exports = {
  budgetingPage,
  getExpenses,
  addExpense,
  changeIncome,
};
