const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/budget', mid.requiresLogin, controllers.Budgeting.budgetingPage);
  
  app.post('/changeIncome', mid.requiresLogin, controllers.Budgeting.changeIncome);
  app.post('/addExpense', mid.requiresLogin, controllers.Budgeting.addExpense);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
