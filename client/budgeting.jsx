const helper = require('./helper.js');
const React = require('react');
const {useState, useEffect} = React;
const {createRoot} = require('react-dom/client');

const App = () => {
  const [reloadExpenses, setReloadExpenses] = useState(false);
  const [reloadBudget, setReloadBudget] = useState(false);
  const [reloadAvailableBudget, setReloadAvailableBudget] = useState(false);

    return (
      <div>
        <h1>a's Budget</h1>
        <Popup/>

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
          <ExpenseList expenses={[]} reloadExpenses={reloadExpenses} />
        </div>

      </div>
    );
  };
  
  const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
    setTimeout(hidePopup, 10000);
  };
  
  window.onload = init;

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
      <form id="expenseForm"
      name="loginForm"
      onSubmit={changeBudget}
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
        onSubmit={addExpense}
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
        <div className="expenseList">
          <h3 className="emptyExpense">No Expenses Yet!</h3>
        </div>
      );
    }
  
    const expenseNodes = expenses.map(expense => {
      return(
        <div key={expense.id} className="expense">
          <p className="expenseName">{expense.name}</p>
          <p className="expenseAmount">${expense.amount}</p>
          <div classname = "expenseButtons">
            <button>Edit</button>
            <button>Delete</button>
          </div>
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