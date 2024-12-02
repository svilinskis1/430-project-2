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

const getBudget = async (req, res) => {
  try {
    return req.session.account.budget;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving budget!' });
  }
};

const getAvailableBudget = async (req, res) => {
  try {
    return req.session.account.budget - req.session.account.usedBudget;
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving available budget!' });
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
    req.session.account.usedBudget += newExpense.amount;
    return res.status(201).json({
      name: newExpense.name,
      amount: newExpense.amount,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured adding the expense!' });
  }
};

const changeBudget = async (req, res) => {
  if (!req.body.amount) {
    return res.status(400).json({ error: 'Amount is required!' });
  }

  const budget = req.body.amount;

  try {
    req.session.account.budget = budget;
    return res.status(201).json({
      budget: req.session.account.budget,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured changing the budget!' });
  }
};

module.exports = {
  budgetingPage,
  getExpenses,
  addExpense,
  getBudget,
  getAvailableBudget,
  changeBudget,
};
