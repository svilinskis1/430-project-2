//shows the error message and changes its text 
const handleError = (message) => {
  document.getElementById('errorMessage').textContent = message;
  document.getElementById('errorMessage').classList.remove('hidden');
};

//sends a post to the server
const sendPost = async (url, data, handler) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if(result.redirect) {
    window.location = result.redirect;
  }

  if(result.error) {
    handleError(result.error);
  }

  if(handler) {
    handler(result);
  }
};

//hides the error message
const hideError = () => {
  document.getElementById('errorMessage').classList.add('hidden');
};

module.exports = {
  handleError,
  sendPost,
  hideError,
};