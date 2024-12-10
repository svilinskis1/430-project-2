const helper = require('./helper.js');
const React = require('react');
const {createRoot} = require('react-dom/client');

//sends a login request to the server
const handleLogin = (e) => {
  e.preventDefault();
  helper.hideError();
 
  //get the data from the html form
  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;

  //check if its valid
  if(!username || !pass) {
    helper.handleError('Username or password is empty!');
    return false;
  }

  //send the post
  helper.sendPost(e.target.action, {username, pass});
  return false;
}

//sends a signup request to the server
const handleSignup = (e) => {
  e.preventDefault();
  helper.hideError();

  //get the data from the html form
  const username = e.target.querySelector('#user').value;
  const pass = e.target.querySelector('#pass').value;
  const pass2 = e.target.querySelector('#pass2').value;

  //check if its valid
  if(!username || !pass || !pass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if(pass !== pass2){
    helper.handleError('Passwords do not match!');
    return false;
  }

  //send the post
  helper.sendPost(e.target.action, {username, pass, pass2});
  return false;
}

//sends a change password request to the server
const handleChangePassword = (e) => {
  e.preventDefault();
  helper.hideError();

  //get data from the html form
  const username = e.target.querySelector('#user').value;
  const newPass = e.target.querySelector('#newPass').value;
  const newPass2 = e.target.querySelector('#newPass2').value;

  //check if its valid
  if(!username || !newPass || !newPass2) {
    helper.handleError('All fields are required!');
    return false;
  }

  if(newPass !== newPass2){
    helper.handleError('Passwords do not match!');
    return false;
  }

  //send the post
  helper.sendPost(e.target.action, {username, newPass, newPass2});

  return false;
}

/*form that lets the user log in or change their password
parameters: username (string), password (string)
method:post
method:login */
const LoginWindow = (props) => {

  //changePassword method for the changePassword button 
  changePassword = (e) => {
    e.preventDefault();
    const root = createRoot(document.getElementById('content'));
    root.render( <ChangePasswordWindow /> );
    return false;
  };

  return (
    <form id="loginForm"
      name="loginForm"
      onSubmit={handleLogin}
      action="/login"
      method="POST"
      className="mainForm"
    >
      <h2>Log In</h2>
      <input id="user" type="text" name="username" placeholder="Username" />
      <input id="pass" type="password" name="pass" placeholder="Password" />
      <a id = "changePasswordButton" href="/changePassword" onClick={changePassword}>Change Password</a>
      <input className="formSubmit" type="submit" value="Sign in" />
    </form>
  );
};

/*form that lets the user make a new account
parameters: username (string), password (string), retype password (string)
method:post
method:signup */
const SignupWindow = (props) => {
  return (
    <form id="signupForm"
      name="signupForm"
      onSubmit={handleSignup}
      action="/signup"
      method="POST"
      className="mainForm"
    >
      <h2>Sign Up</h2>
      <input id="user" type="text" name="username" placeholder="Username" />
      <input id="pass" type="password" name="pass" placeholder="Password" />
      <input id="pass2" type="password" name="pass2" placeholder="Retype Password" />
      <input className="formSubmit" type="submit" value="Sign up" />
    </form>
  );
};

/*form that lets the user change their password
parameters: username (string), new password (string), retype new password (string)
method:post
method:changePasword */
const ChangePasswordWindow = (props) => {
  return (
    <form id="changePasswordForm"
      name="changePasswordForm"
      onSubmit={handleChangePassword}
      action="/changePassword"
      method="POST"
      className="mainForm"
    >
      <h2>Change Password</h2>
      <input id="user" type="text" name="username" placeholder="Username" />
      <input id="newPass" type="password" name="pass2" placeholder="New Password" />
      <input id="newPass2" type="password" name="pass3" placeholder="Retype New Password" />
      <input className="formSubmit" type="submit" value="Change Password" />
    </form>
  );
};

//create the window
const init = () => {
  const loginButton = document.getElementById('loginButton');
  const signupButton = document.getElementById('signupButton');

  const root = createRoot(document.getElementById('content'));

  //hook up the buttons in the nav bar to render their correct windows
  loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    root.render( <LoginWindow /> );
    return false;
  });

  signupButton.addEventListener('click', (e) => {
    e.preventDefault();
    root.render( <SignupWindow /> );
    return false;
  });

  root.render( <LoginWindow /> );

};

window.onload = init;