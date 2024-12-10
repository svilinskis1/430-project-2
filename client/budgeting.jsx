const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const App = () => {
  const [reloadExpenses, setReloadExpenses] = useState(false);
  const [reloadBudget, setReloadBudget] = useState(false);
  const [reloadAvailableBudget, setReloadAvailableBudget] = useState(false);
  const [reloadUsername, setReloadUsername] = useState(false);

    return (
      <div>
        <Popup/>

        <UserIndicator/>

        <div id = "budgets">
          <div>
            <div className="column">
              <BudgetIndicator/>
              <h2>Budget</h2>
              <BudgetForm triggerReload={() => setReloadBudget(!reloadBudget)}/>
            </div>
          </div>
          <div>
            <div className="column">
              <AvailableBudgetIndicator/>
              <h2>Available Money</h2>
            </div>
          </div>
        </div>

        <div id = "expenses" className='column'>
          <h2>Expenses</h2>
          <ExpenseForm triggerReload={() => setReloadExpenses(!reloadExpenses)}/>
          <ExpenseList expenses={[]} reloadExpenses={reloadExpenses} triggerReload={() => setReloadExpenses(!reloadExpenses)}/>
        </div>

      </div>
    );
  };
  
  const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
  };
  
  window.onload = init;

  const UserIndicator = (props) => {
    const [username, setUsername] = useState(props.username);
  
    useEffect(() => {
      const loadUsernameFromServer = async () => {
        const response = await fetch ('/getUsername');
        const data = await response.json();
        setUsername(data.username);
      };
      loadUsernameFromServer();
    }, [props.reloadUsername]);

    return (
      //<h1 id = "userIndicator">{username}'s Budget</h1>
      <h1 id = "userIndicator">My Budget</h1>
    )
  }

  const BudgetIndicator = (props) => {
    const [budget, setBudget] = useState(props.budget);
  
    useEffect(() => {
      const loadBudgetFromServer = async () => {
        const response = await fetch ('/getBudget');
        const data = await response.json();
        setBudget(data.budget);
      };
      loadBudgetFromServer();
    }, [props.reloadBudget]);

    return (
      //<h3 id = "Budget">{budget}</h3>
      <p id = "Budget">$100</p>
    )
  }

  const AvailableBudgetIndicator = (props) => {
    const [availableBudget, setAvailableBudget] = useState(props.availableBudget);
  
    useEffect(() => {
      const loadAvailableBudgetFromServer = async () => {
        const response = await fetch ('/getAvailableBudget');
        const data = await response.json();
        setAvailableBudget(data.availableBudget);
      };
      loadAvailableBudgetFromServer();
    }, [props.reloadAvailableBudget]);

    return (
      //<h3 id = "available">{availableBudget}</h3>
      <p id = "available">$100</p>
    )
  }

  const BudgetForm = (props) => {
    return (
      <form id="budgetForm"
      name="loginForm"
      onSubmit={(e) => changeBudget(e, props.triggerReload)}
      action="/changeBudget"
      method="POST"
      className="form"
    >
      <label htmlFor="amount">Change Budget Amount: $</label>
      <input id="budgetAmount" type="number" name="amount" placeholder="0" />
      <input className="formSubmit" type="submit" value="Change" />
    </form>
    )
  }

  const ExpenseForm = (props) => {
    return(
      <form id="expenseForm"
        name="loginForm"
        onSubmit={(e) => addExpense(e, props.triggerReload)}
        action="/addExpense"
        method="POST"
        className="form"
      >
        <label htmlFor="name">Add New Expense: </label>
        <input id="expenseName" type="text" name="name" placeholder="Name" />
        <label htmlFor="amount">$</label>
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
        <h3 className="emptyExpense column">No Expenses Yet!</h3>
      );
    }
  
    const expenseNodes = expenses.map(expense => {
      
      return(
        <div key={expense._id} className="expense">
          <p className="expenseName">{expense.name}</p>
          <p className="expenseAmount">${expense.amount}</p>
          <button 
            onClick={(e) => deleteExpense(e, props.triggerReload, expense._id)}>
            Delete</button>
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
  helper.hideError();

  const amount = e.target.querySelector('#budgetAmount').value;
  

  if(!amount) {
    helper.handleError('Amount required!');
    return false;
  }

  if(amount <= 0) {
    helper.handleError('Budget cannot be negative!');
    return false;
  }

  helper.sendPost(e.target.action, {amount}, onBudgetAdded);
  return false;
}

const addExpense = (e, onExpenseAdded) => {
  e.preventDefault();
  helper.hideError();

  const name = e.target.querySelector('#expenseName').value;
  const amount = e.target.querySelector('#expenseAmount').value;
  

  if(!name || !amount) {
    helper.handleError('All fields are required!');
    return false;
  }

  if(amount < 0) {
    helper.handleError('Amount cannot be negative!');
    return false;
  }

  helper.sendPost(e.target.action, {name, amount}, onExpenseAdded);
  return false;
};

const deleteExpense = (e, onExpenseDeleted, expenseId) => {
  e.preventDefault();

  helper.sendPost("/deleteExpense", {expenseId}, onExpenseDeleted);
  return false;
};

//popup specific code --------------------------------//
const Popup = (props) =>{
    return(
        <div id = 'ad'>
            <button id = "close-ad" onClick={hidePopup}>x</button>
            <img src = "/assets/img/ad.jpg"/>
        </div>
    )
}

const hidePopup = () => {
    document.getElementById('ad').classList.add('hidden');
    setTimeout(showPopup, 5000);
}

const showPopup = () => {
    document.getElementById('ad').classList.remove('hidden');
}
//----------------------------------------------------//