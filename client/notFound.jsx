const React = require('react');
const {createRoot} = require('react-dom/client');

const init = () => {
    const root = createRoot(document.getElementById('content'));
    root.render( <NotFound /> );
  };

  window.onload = init;
  
  const NotFound = (props) => {
    return(
        <div className='column'>
            <h1>Page Not Found</h1>
            <a href = '/login'>Return to Homepage</a>
        </div>
    )
  }