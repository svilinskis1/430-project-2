const { Expense } = require('../models');
const { Account } = require('../models');

const budgetingPage = async (req, res) => res.render('app');

// parameters: none
// returns: list of all expenses of the current user
const getExpenses = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const docs = await Expense.find(query).select('name amount').lean().exec();

    return res.status(200).json({ expenses: docs });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving expenses!' });
  }
};

// parameters: none
// returns: budget of the current user
const getBudget = async (req, res) => {
  try {
    const query = { _id: req.session.account._id };
    const docs = await Account.findOne(query);
    return res.status(200).json({ budget: docs.budget });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving budget!' });
  }
};

// calculates the budget based on the base amount and a list of expenses
const calculateAvailableBudget = (budget, expenses) => {
  let expenseTotal = 0;
  expenses.forEach((element) => {
    expenseTotal += element.amount;
  });
  const availablebudget = budget - expenseTotal;
  return availablebudget;
};

// parameters: none
// returns: available budget of the current user (budget - expenses)
const getAvailableBudget = async (req, res) => {
  try {
    const query = { owner: req.session.account._id };
    const expenses = await Expense.find(query).select('name amount').lean().exec();

    const accountId = { _id: req.session.account._id };
    const account = await Account.findOne(accountId);
    const { budget } = account;

    const availablebudget = calculateAvailableBudget(budget, expenses);

    return res.status(200).json({ amount: availablebudget });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving available budget!' });
  }
};

// adds a new expense to the current user's expenses
// parameters: name, amount
// returns: added expense
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

// removes an expense based on an id
// parameters: expense id
const deleteExpense = async (req, res) => {
  const { expenseId } = req.body;

  try {
    await Expense.findByIdAndDelete(expenseId);
    return res.status(201).json({ message: 'expense deleted successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured deleting the expense!' });
  }
};

// changes the current user's budget
// parameters: amount
// returns: changed budget
const changeBudget = async (req, res) => {
  if (!req.body.amount) {
    return res.status(400).json({ error: 'Amount is required!' });
  }

  const newBudget = req.body.amount;
  const { username } = req.session.account;

  try {
    await Account.updateOne({ username }, { budget: newBudget });
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
  deleteExpense,
  calculateAvailableBudget,
};
