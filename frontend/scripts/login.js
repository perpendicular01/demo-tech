const loginForm = document.getElementById("login_form");

loginForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = new FormData(loginForm);

  const userData = {
    name: formData.get("name"),
    password: formData.get("password"),
  };

  fetch("/backend/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", // Set the content type to JSON
    },
    body: JSON.stringify(userData), // Convert user data to JSON
  })
    .then((response) => response.json())
    .then((data) => {
      // Handle the response from the backend (e.g., display a success message or error)
      if (data.success) {
        window.alert("Successfully logged in!");
        //storing the session data received from the backend
        const userData = {
          username: data.username,
          expiration: new Date().getTime() + 60 * 1000 * 10,
        };
        localStorage.setItem("userData", JSON.stringify(userData));
        window.location.href = "/";
      } else {
        window.alert(data.message);
        window.location.reload();
      }
    })
    .catch((error) => {
      // Handle errors (e.g., network issues or server errors)
      console.error("Error:", error);
    });
});
