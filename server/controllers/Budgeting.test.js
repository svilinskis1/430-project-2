const budgeting = require('./Budgeting.js');

const testVars = {
  budget: 100,

  testOneExpenses: [
    {
      amount: 5
    },
    {
      amount: 10
    },
    {
      amount: 15
    }
  ],

  testTwoExpenses: [
    {
      amount: 100
    },
    {
      amount: 1
    },
  ]
};


// test the calculateAvailableBudget method to make sure its working correctly
describe('calculateAvailableBudget()', () => {
  test('should subtract expenses from budget', () => {
    expect(budgeting.calculateAvailableBudget(testVars.budget, testVars.testOneExpenses)).toBe(70);
  });
  test('should return a negative number', () => {
    expect(budgeting.calculateAvailableBudget(testVars.budget, testVars.testTwoExpenses)).toBe(-1);
  });
});
