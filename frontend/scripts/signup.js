const signUpForm = document.getElementById("sign_up_form");

signUpForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent the default form submission

  // Get user input
  const formData = new FormData(signUpForm);

  // Create an object to hold user data
  const userData = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password")
  };

  // Send a POST request to the backend
  fetch('/backend/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json', // Set the content type to JSON
    },
    body: JSON.stringify(userData) // Convert user data to JSON
  })
    .then(response => response.json())
    .then(data => {
      // Handle the response from the backend (e.g., display a success message or error)
      if (data.success) {
        window.alert("Success!");
        //storing the session data received from the backend 
        const userData = {
          username: data.username,
          expiration: new Date().getTime() + 60 * 1000 * 10
        }
        localStorage.setItem('userData', JSON.stringify(userData));
        window.location.href = './';
      } else {
        window.alert(data.message);
        window.location.reload();
      }
    })
    .catch(error => {
      // Handle errors (e.g., network issues or server errors)
      console.error('Error:', error);
    });
});
