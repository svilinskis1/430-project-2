const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const App = () => {
    return (
      <div>
        <h1>Budgeting App</h1>
        <Popup/>

        <h2>Income: </h2>
        <h3 id = "income">$$$</h3>

        <form id="expenseForm"
          name="loginForm"
          onSubmit={changeIncome}
          action="/budget"
          method="POST"
          className="form"
        >
          <label htmlFor="amount">Change Income Amount: </label>
          <input id="incomeAmount" type="number" name="amount" placeholder="0" />
          <input className="formSubmit" type="submit" value="Change" />
        </form>

        <h2>Available Money: </h2>
        <h3 id = "available">$$$</h3>

        <h2>Expenses:</h2>

        <h2>Add New Expense</h2>
        <form id="expenseForm"
          name="loginForm"
          onSubmit={addExpense}
          action="/budget"
          method="POST"
          className="form"
        >
          <label htmlFor="name">Name: </label>
          <input id="expenseName" type="text" name="name" placeholder="name" />
          <label htmlFor="amount">Amount: </label>
          <input id="expenseAmount" type="number" name="amount" placeholder="0" />
          <input className="formSubmit" type="submit" value="Add" />
        </form>
      </div>
    );
  };
  
  const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
    setTimeout(hidePopup, 10000);
  };
  
  window.onload = init;

const addExpense = () => {
  //TODO: add expense
}

const changeIncome = () => {
  
}

//popup specific code --------------------------------//
const Popup = (props) =>{
    return(
        <div id = 'ad'>
            <img src = "/assets/img/ad.jpg"/>
        </div>
    )
}

const hidePopup = () => {
    console.log(document.getElementById('ad'));
    document.getElementById('ad').classList.add('hidden');
    setTimeout(showPopup, 2000);
}

const showPopup = () => {
    console.log("showed popup");
    document.getElementById('ad').classList.remove('hidden');
    setTimeout(hidePopup, 10000);
}
//----------------------------------------------------//