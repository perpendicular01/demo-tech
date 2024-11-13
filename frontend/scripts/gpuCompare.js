// Retrieve data from localStorage
let gpuToCompare = localStorage.getItem("gpuToCompare");

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

if (gpuToCompare) {
  try {
    // Attempt to parse the retrieved data as JSON
    gpuToCompare = JSON.parse(gpuToCompare);
    console.log("Parsed data:", gpuToCompare);
    const postMethods = () => {
      const postContainer = document.querySelector(".all-Product");
      // console.log("g");
      gpuToCompare.map((postData) => {
        var postElement = document.createElement("div");

        postElement.classList.add("zip-product");
        postElement.innerHTML = `
        <p class="zip-productName">
        ${postData.productName}
      </p>
      <img
        src="${postData.image}"
        alt=""
        srcset=""
        class="zip-productImage"
      />
      <p class="zip-productPrice"> ${postData.price}</p>
      <p class="zip-productResolution"> ${postData.type}</p>
      <p class="zip-productDisplay"> ${postData.size}</p>
      <p class="zip-productShop"> ${postData.shop}</p>
      <div class="zip-productDescriptionDiv">
        <p class="zip-productDescription">
        ${postData.description}
        </p>
      </div>
        `;
        console.log(postContainer);
        if (postContainer != null) {
          postContainer.appendChild(postElement);
        }
      });
    };
    postMethods();

    // Use the parsed data (parsedCartItems) as needed
  } catch (error) {
    console.log("Error parsing JSON:", error);
    // Handle the parsing error, possibly due to invalid JSON
  }
} else {
  console.log("No data found in localStorage for 'gpuToCompare'");
  // Handle the case where no data is present in localStorage
}
