const models = require('../models');

const { Account } = models;

const loginPage = (req, res) => res.render('login');

// ends user session and redirects them to homepage
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

// stars a session for user logging in
// parameters: username, password
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  // check if params are valid
  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password!' });
    }

    // create an session
    req.session.account = Account.toAPI(account);

    // send the user to main page
    return res.status(200).json({ redirect: '/budget' });
  });
};

// creates an account for a new user and logs them in
// parameters: username, password, retype password
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  // check if params are valid
  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // hash password and create a new account with username and pass
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });
    await newAccount.save();
    req.session.account = Account.toAPI(newAccount);
    // send user to main page
    return res.status(200).json({ redirect: '/budget' });
  } catch (err) {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use!' });
    }
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// changes the current user's password
// parameters: username, new password, retype new password
const changePassword = async (req, res) => {
  const username = `${req.body.username}`;
  const newPass = `${req.body.newPass}`;
  const newPass2 = `${req.body.newPass2}`;

  // check if data is valid
  if (!username || !newPass || !newPass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (newPass !== newPass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  try {
    // hash their new password and store it
    const newHash = await Account.generateHash(newPass);
    await Account.updateOne({ username }, { password: newHash });
    // redirect user to login
    return res.json({ redirect: '/login' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'An error occured!' });
  }
};

// returns: the current user's username
const getUsername = async (req, res) => {
  try {
    return res.status(200).json({ username: req.session.account.username });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: 'Error retrieving username!' });
  }
};

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  changePassword,
  getUsername,
};
