// var postData = JSON.parse(localStorage.getItem("monitorData"));
// var monitor = postData;
// Extract query parameters from URL
const queryParams = new URLSearchParams(window.location.search);
const receivedData = {};

// Iterate through the parameters and store them in receivedData object
for (const param of queryParams) {
  receivedData[param[0]] = param[1];
}

var postData = receivedData;
var monitor = receivedData;
console.log(postData);
console.log(monitor);

let productCount = 0;
let userData = JSON.parse(localStorage.getItem("userData"));

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

function showComments() {
  const commentIdentifier = {
    productName: monitor.productName,
    shop: monitor.shop,
  };

  fetch("/backend/fetchComments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(commentIdentifier),
  })
    .then((response) => response.json())
    .then((data) => {
      const postContainer = document.querySelector(".comment-container");
      const child = document.querySelectorAll(".comment-area-div");
      const childp = document.querySelectorAll(".comment-container-text");
      if (child) {
        for (let i = 0; i < child.length; i++) {
          child[i].remove();
          childp[i].remove();
        }
      }
      const postMethods = () => {
        // console.log("g");
        data.comments.map((postData) => {
          // console.log("b");

          const postElement = document.createElement("div");
          postElement.classList.add("comment-area-div");
          postElement.innerHTML = `
          <i class="fa-solid fa-user"></i>
          <p class="comment-area-text">${postData.userName}</p>
          `;
          postContainer.appendChild(postElement);

          const postElement2 = document.createElement("p");
          postElement2.classList.add("comment-container-text");
          postElement2.innerHTML = `${postData.comment}`;
          postContainer.appendChild(postElement2);
        });
      };
      postMethods();
      // var commentContent = "";
      // for (var i = 0; i < data.comments.length; i++) {
      //   commentContent +=
      //     data.comments[i].userName +
      //     ":\n" +
      //     data.comments[i].comment +
      //     "\n\n\n";
      // }
      // document.getElementById("showCommentArea").value = commentContent;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

const plus = document.querySelector(".plus");
plus.addEventListener("click", () => {
  const cartText = document.querySelector(".plus_minus_text");
  productCount++;
  cartText.innerHTML = `${productCount}`;
  monitor.itemCount++;
  console.log(monitor.itemCount);
});
const minus = document.querySelector(".minus");
minus.addEventListener("click", () => {
  const cartText = document.querySelector(".plus_minus_text");
  if (productCount > 0) {
    productCount--;
    cartText.innerHTML = `${productCount}`;
    monitor.itemCount--;
  }
});

window.onload = () => {
  let userData = JSON.parse(localStorage.getItem("userData"));
  if (userData != null) {
    let name = document.querySelector(".name");
    name.innerHTML = `${userData.username}`;
  }

  let sourceLink = document.querySelector(".sourceLink");
  // let link=postData.link;
  // console.log(link);
  sourceLink.setAttribute("href", postData.link);
  let refreshRate, responseTime, color, displaySurface;
  if (postData.price < 30000) {
    responseTime = "2ms";
    refreshRate = "60hz";
    color = "Black";
    displaySurface = "1500R";
  } else if (postData.price < 60000) {
    responseTime = "1ms";
    refreshRate = "75hz";
    color = "Black";
    displaySurface = "2000R";
  } else {
    responseTime = ".5ms";
    refreshRate = "144hz";
    color = "Black";
    displaySurface = "2500R";
  }
  const postContainer = document.querySelector(".card-container");
  const postElement = document.createElement("div");
  postElement.classList.add("card");
  postElement.innerHTML = `
    <div class="info">
       <div class="imagediv">
          <img src="${postData.image}" alt="" srcset="" class="card-image">
       </div>
       <div class="divinfo">
         <h3 class="card-name">${postData.productName}</h3>
         <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
         <p class="card-text display-size">Display Size: ${postData.displaySize}</p>
         <p class="card-text panel-size">Panel Type: ${postData.panelType}</p>
         <p class="card-text refresh-rate">Shop Name: ${postData.shop}</p>
         <p class="card-text price">Refresh Rate: ${refreshRate}</p>
         <p class="card-text price">Response time: ${responseTime}</p>
         <p class="card-text price">Color: ${color}</p>
         <p class="card-text price">Display Surface: ${displaySurface}</p>
         <p class="card-text price">Price: ${postData.price}</p>
       </div>
     </div>
    `;
  postContainer.appendChild(postElement);
  const descriptionDiv = document.querySelector(".descriptionDiv");
  const description = document.createElement("div");
  description.classList.add("description");
  description.innerHTML = `
      <p class="description_header">Description:</p>
      <p class="description_text">${postData.description}</p>
    `;
  console.log("a");
  descriptionDiv.appendChild(description);
  showComments();
};

document.getElementById("addToCartBtn").addEventListener("click", () => {
  if (userData != undefined) {
    var cartItems = [];
    try {
      var tempCartItems = JSON.parse(localStorage.getItem("cartItems"));
    } catch (error) {
      console.log("No items in cartItem");
    }

    if (tempCartItems && Array.isArray(tempCartItems)) {
      for (var item of tempCartItems) {
        if (item.itemCount > 0) {
          cartItems.push(item);
        } else {
        }
      }
    }

    if (monitor.itemCount > 0) {
      window.alert("Added to cart");
      cartItems.push(monitor);
    } else {
      window.alert("Item count is 0, increase to add to cart");
    }
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  } else {
    window.alert("Log in first");
  }
});

document
  .getElementById("submitCommentBtn")
  .addEventListener("click", (event) => {
    if (userData != undefined) {
      var commentContent = document.getElementById("commentArea").value;

      const commentObject = {
        userName: userData.username,
        productName: monitor.productName,
        shop: monitor.shop,
        comment: commentContent,
      };

      fetch("/backend/postComment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(commentObject),
      })
        .then((response) => response.json())
        .then((data) => {
          showComments();
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    } else {
      window.alert("Log in first");
      document.getElementById("commentArea").value = "";
    }
  });
