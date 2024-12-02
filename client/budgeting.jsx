const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const App = () => {
  const [reloadExpenses, setReloadExpenses] = useState(false);
  const [reloadBudget, setReloadBudget] = useState(false);

    return (
      <div>
        <h1>Budgeting App</h1>
        <Popup/>

        <h2>Budget: </h2>
        <h3 id = "Budget">$$$</h3>
        <BudgetForm triggerReload={() => setReloadBudget(!reloadBudget)}/>

        <h2>Available Money: </h2>
        <h3 id = "available">$$$</h3>

        <h2>Expenses:</h2>
        <ExpenseList expenses={[]} reloadExpenses={reloadExpenses} />

        <h2>Add New Expense</h2>
        <ExpenseForm triggerReload={() => setReloadExpenses(!reloadExpenses)}/>
      </div>
    );
  };
  
  const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
    setTimeout(hidePopup, 10000);
  };
  
  window.onload = init;

  const BudgetForm = (props) => {
    return (
      <form id="expenseForm"
      name="loginForm"
      onSubmit={changeBudget}
      action="/changeBudget"
      method="POST"
      className="form"
    >
      <label htmlFor="amount">Change Budget Amount: </label>
      <input id="budgetAmount" type="number" name="amount" placeholder="0" />
      <input className="formSubmit" type="submit" value="Change" />
    </form>
    )
  }

  const ExpenseForm = (props) => {
    return(
      <form id="expenseForm"
        name="loginForm"
        onSubmit={addExpense}
        action="/addExpense"
        method="POST"
        className="form"
      >
        <label htmlFor="name">Name: </label>
        <input id="expenseName" type="text" name="name" placeholder="name" />
        <label htmlFor="amount">Amount: </label>
        <input id="expenseAmount" type="number" name="amount" placeholder="0" />
        <input className="formSubmit" type="submit" value="Add" />
      </form>
    )
  }

  const ExpenseList = (props) => {
    const [expenses, setExpenses] = useState(props.expenses);
  
    useEffect(() => {
      const loadExpensesFromServer = async () => {
        const response = await fetch ('/getExpenses');
        const data = await response.json();
        setExpenses(data.expenses);
      };
      loadExpensesFromServer();
    }, [props.reloadExpenses]);
  
    if(expenses.length === 0) {
      return (
        <div className="expenseList">
          <h3 className="emptyExpense">No Expenses Yet!</h3>
        </div>
      );
    }
  
    const expenseNodes = expenses.map(expense => {
      return(
        <div key={expense.id} className="expense">
          <h3 className="expenseName">{expense.name}: </h3>
          <h3 className="expenseAmount">${expense.amount}</h3>
        </div>
      );
    });
  
    return (
      <div className="expenseList">
        {expenseNodes}
      </div>
    );
  };

const changeBudget = (e, onBudgetAdded) => {
  e.preventDefault();

  const amount = e.target.querySelector('#budgetAmount').value;
  

  if(!amount) {
    helper.handleError('Amount required!');
    return false;
  }

  helper.sendPost(e.target.action, {amount}, onBudgetAdded);
  return false;
}

const addExpense = (e, onExpenseAdded) => {
  e.preventDefault();

  const name = e.target.querySelector('#expenseName').value;
  const amount = e.target.querySelector('#expenseAmount').value;
  

  if(!name || !amount) {
    helper.handleError('All fields are required!');
    return false;
  }

  helper.sendPost(e.target.action, {name, amount}, onExpenseAdded);
  return false;
};

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
    document.getElementById('ad').classList.remove('hidden');
    setTimeout(hidePopup, 10000);
}
//----------------------------------------------------//