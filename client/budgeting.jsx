const App = () => {

    return (
      <div>
        <p>budgeting page</p>
      </div>
    );
  };
  
  const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
    setTimeout(hidePopup, 10000);
  };
  
  window.onload = init;

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