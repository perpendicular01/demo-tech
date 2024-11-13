document.addEventListener("DOMContentLoaded", () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
  
    // Check if user data exists
    if (userData != null) {
      // Check if user data exists
      if (userData.username) {
        // Display user data on the home page as needed
        const account = document.querySelector(
          "body > nav > div.nav-authentication > div > p"
        );
        account.innerHTML = userData.username;
        const link1 = document.querySelector(
          "body > nav > div.nav-authentication > div > div > a:nth-child(1)"
        );
        link1.innerHTML = "Profile";
        link1.href = "";
        const link2 = document.querySelector(
          "body > nav > div.nav-authentication > div > div > a:nth-child(2)"
        );
        link2.innerHTML = "Logout";
        link2.href = "";
      }
    }
  });
  
  const Logout = document.querySelector(
    "body > nav > div.nav-authentication > div > div > a:nth-child(2)"
  );
  
  Logout.addEventListener("click", function (event) {
    if (Logout.innerHTML == "Logout") {
      event.preventDefault();
      localStorage.removeItem("userData");
  
      fetch("/backend/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set the content type to JSON
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            localStorage.removeItem("cartItems");
            window.alert(data.message);
            window.location.reload();
          }
        });
    }
  });
  
  const profileButton= document.querySelector(
    "body > nav > div.nav-authentication > div > div > a:nth-child(1)"
  );
  
  profileButton.addEventListener("click", function(event){
    if(profileButton.innerHTML=="Profile"){
      event.preventDefault();
      window.location.href="/profile";
    } 
  });