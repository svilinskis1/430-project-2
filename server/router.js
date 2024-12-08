const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.post('/changePassword', mid.requiresSecure, mid.requiresLogout, controllers.Account.changePassword);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/budget', mid.requiresLogin, controllers.Budgeting.budgetingPage);

  app.get('/getBudget', mid.requiresLogin, controllers.Budgeting.getBudget);
  app.get('/getAvailableBudget', mid.requiresLogin, controllers.Budgeting.getAvailableBudget);

  app.get('/getExpenses', mid.requiresLogin, controllers.Budgeting.getExpenses);
  app.post('/changeBudget', mid.requiresLogin, controllers.Budgeting.changeBudget);
  app.post('/addExpense', mid.requiresLogin, controllers.Budgeting.addExpense);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  app.get('/*', controllers.Account.notFound);
};

module.exports = router;
