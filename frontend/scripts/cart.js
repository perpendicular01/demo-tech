// Retrieve data from localStorage
var cartItems = [];
var storedCartItems = localStorage.getItem("cartItems");

if (storedCartItems) {
  try {
    // Attempt to parse the retrieved data as JSON
    storedCartItems = JSON.parse(storedCartItems);
    cartItems = storedCartItems;
    // Use the parsed data (parsedCartItems) as needed
  } catch (error) {
    console.log("Error parsing JSON:", error);
    // Handle the parsing error, possibly due to invalid JSON
  }
} else {
  console.log("No data found in localStorage for 'cartItems'");
  // Handle the case where no data is present in localStorage
}
var finalized = 0;

if (cartItems.length > 0) {
  for (let i = 0; i < cartItems.length; i++) {
    let count = cartItems[i].itemCount;
    for (let j = 0; j < cartItems.length; j++) {
      if (i == j) {
        continue;
      } else if (cartItems[i].productName == cartItems[j].productName) {
        count += cartItems[j].itemCount;
        cartItems[j].itemCount = 0;
      }
    }
    cartItems[i].itemCount = count;
  }

  newArray = cartItems.filter((items) => items.itemCount != 0);
  cartItems = newArray;

  document.addEventListener("DOMContentLoaded", () => {
    let userData = JSON.parse(localStorage.getItem("userData"));
  
    // Check if user data exists
    if (userData != null) {
      // Check if user data exists
      if (userData.username) {
        // Display user data on the home page as needed
        const account = document.querySelector("#ac1");
        account.innerHTML = userData.username;
        
        const link1 = document.querySelector(
          "#aclogin"
        );
        link1.innerHTML = "Profile";
        link1.href = "";
        const link2 = document.querySelector(
          "#acsignup"
        );
        link2.innerHTML = "Logout";
        link2.href = "";
      }
    }
  });
  
  const Logout = document.querySelector(
    "#acsignup"
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
    "#aclogin"
  );
  
  profileButton.addEventListener("click", function(event){
    if(profileButton.innerHTML=="Profile"){
      event.preventDefault();
      window.location.href="/profile";
    } 
  });

  console.log("f")
  document.querySelector(".invoice").addEventListener("click", (event) => {
    console.log("b")
    fetch("/backend/createInvoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
      body: JSON.stringify(cartItems),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          console.log(data.message);
        } else {
          console.log(data.message);
        }
      });

      const pop=document.querySelector(".popup");
      pop.classList.add("open-popup");
      console.log("aa")
  });
  const ok=document.querySelector(".popup-button");
  ok.addEventListener("click",()=>{
    console.log("aaa");
    const pop=document.querySelector(".popup");
      pop.classList.remove("open-popup");

  });
  const stars = document.querySelectorAll(".stars i");
// Loop through the "stars" NodeList
stars.forEach((star, index1) => {
  // Add an event listener that runs a function when the "click" event is triggered
  star.addEventListener("click", () => {
    // Loop through the "stars" NodeList Again
    stars.forEach((star, index2) => {
      // Add the "active" class to the clicked star and any stars with a lower index
      // and remove the "active" class from any stars with a higher index
      index1 >= index2 ? star.classList.add("active") : star.classList.remove("active");
    });
  });
});

  window.onload = () => {
    if (cartItems == null) {
      const postContainer = document.querySelector(".card-container");
      const postMethods = () => {
        const postElement = document.createElement("div");
        postElement.classList.add("cart-items");
        postElement.innerHTML = `
          <p class="cart-text">
          No items has been added yet.
          </p>
        `;
        postContainer.appendChild(postElement);
      };
      postMethods();
    } else {
      let totalPrice = 0;
      let promo_applied = 0;

      const postContainer = document.querySelector(".card-container");
      const postMethods = () => {
        // console.log("g");
        cartItems.map((postData) => {
          // console.log("b");

          const postElement = document.createElement("div");
          postElement.classList.add("cart-items");
          postElement.innerHTML = `
          <p class="cart-text">
          ${postData.productName}
          </p>
          <p class="cart-shoptext">
          ${postData.shop}
          </p>
          <div class="plus_minus">
            <button class="plus">+</button>
            <p class="cart-count">${postData.itemCount}</p>
            <button class="minus">-</button>
          </div>
          <p class="cart-price">${postData.itemCount * postData.price}</p>
        `;
          postContainer.appendChild(postElement);
          totalPrice += postData.itemCount * postData.price;
        });
      };
      postMethods();
      const tPrice = document.querySelector(".total-price");
      tPrice.innerHTML = `Total Price: ${totalPrice}`;
      const plus = document.querySelectorAll(".plus");
      for (let i = 0; i < plus.length; i++) {
        plus[i].addEventListener("click", () => {
          const cartText = document.querySelectorAll(".cart-count");
          cartItems[i].itemCount++;
          localStorage.removeItem(cartItems);
          localStorage.setItem("cartItems", JSON.stringify(cartItems));
          cartText[i].innerHTML = `${cartItems[i].itemCount}`;
          const cartPrice = document.querySelectorAll(".cart-price");
          cartPrice[i].innerHTML = `${
            cartItems[i].itemCount * cartItems[i].price
          }`;
          totalPrice = 0;
          for (let i = 0; i < plus.length; i++) {
            totalPrice += cartItems[i].itemCount * cartItems[i].price;
          }
          tPrice.innerHTML = `Total Price: ${totalPrice}`;
          if (promo_applied == 1) {
            const discountPrice = document.querySelector(".discount-price");
            discountPrice.innerHTML = `Discount Price:${
              totalPrice - totalPrice * 0.1
            }`;
          }
        });
      }

      const minus = document.querySelectorAll(".minus");
      for (let i = 0; i < minus.length; i++) {
        minus[i].addEventListener("click", () => {
          const cartText = document.querySelectorAll(".cart-count");
          if (cartItems[i].itemCount > 0) {
            cartItems[i].itemCount--;
            localStorage.removeItem(cartItems);
            localStorage.setItem("cartItems", JSON.stringify(cartItems));
            cartText[i].innerHTML = `${cartItems[i].itemCount}`;
            const cartPrice = document.querySelectorAll(".cart-price");
            cartPrice[i].innerHTML = `${
              cartItems[i].itemCount * cartItems[i].price
            }`;
            totalPrice = 0;
            for (let i = 0; i < plus.length; i++) {
              totalPrice += cartItems[i].itemCount * cartItems[i].price;
            }
            tPrice.innerHTML = `Total Price: ${totalPrice}`;
            if(totalPrice==0)
            {
              const discountPrice = document.querySelector(".discount-price");
              discountPrice.innerHTML = `Discount Price:${
                totalPrice - totalPrice
              }`;
            }
            else if (promo_applied == 1) {
              const discountPrice = document.querySelector(".discount-price");
              discountPrice.innerHTML = `Discount Price:${
                totalPrice - totalPrice * 0.1
              }`;
            }
            if (cartItems[i].itemCount == 0) {
              cartItems.splice(i, 1);
              const cartitems = document.querySelectorAll(".cart-items");
              for (let i = 0; i < plus.length; i++) {
                cartitems[i].remove();
              }
              window.onload();

              console.log(cartItems);
            }
          }
        });

        const promo = document.querySelector(".promoapply");
        promo.addEventListener("click", () => {
          var promo_input = document.getElementById("promo-input").value;
          var promoInput = {
            content: promo_input,
          };
          fetch("/backend/validatePromo", {
            method: "POST",
            headers: {
              "Content-Type": "application/json", // Set the content type to JSON
            },
            body: JSON.stringify(promoInput),
          })
            .then((response) => response.json())
            .then((data) => {
              if (data.success) {
                window.alert(data.message);
                promo_applied = 1;
                const discountPrice = document.querySelector(".discount-price");
                discountPrice.innerHTML = `Discount Price:${
                  totalPrice - totalPrice * data.discountPercentage
                }`;
              } else {
                window.alert(data.message);
              }
            });
        });
      }
      localStorage.removeItem("cartitems");
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }

    //   plus.addEventListener("click", () => {
    //     const cartText = document.querySelector(".plus_minus_text");
    //     productCount++;
    //     cartText.innerHTML = `${productCount}`;
    //     monitor.itemCount++;
    //     console.log(monitor.itemCount);
    //   });
    //   const minus = document.querySelectorAll(".minus");
    //   minus.addEventListener("click", () => {
    //     const cartText = document.querySelector(".plus_minus_text");
    //     if (productCount > 0) {
    //       productCount--;
    //       cartText.innerHTML = `${productCount}`;
    //       monitor.itemCount--;
    //     }
    //   });
    // };

    // document.getElementById('removeFromCartBtn').addEventListener("click", ()=>{
    //     // localStorage.removeItem('cartItems');
    // })
  };
}
