const app = require('./app.js');

// test to make sure the app is working
test('Server starts up correctly', () => {
  expect(app).toBeDefined();
});

afterAll(() => {
  app.close();
});
