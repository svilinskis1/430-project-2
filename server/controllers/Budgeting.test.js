const budgeting = require('./Budgeting.js');

// test the calculateAvailableBudget method to make sure its working correctly
describe('calculateAvailableBudget()', () => {
  test('subtracts expenses from budget', () => {
    expect(budgeting.calculateAvailableBudget(100, [5, 10, 15])).toBe(70);
  });
  test('should return a negative number', () => {
    expect(budgeting.calculateAvailableBudget(100, [50, 50, 10])).toBe(-10);
  });
});
