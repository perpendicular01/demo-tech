// Retrieve data from localStorage
let monitorsToCompare = localStorage.getItem("monitorsToCompare");

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


if (monitorsToCompare) {
  try {
    // Attempt to parse the retrieved data as JSON
    monitorsToCompare = JSON.parse(monitorsToCompare);
    console.log("Parsed data:", monitorsToCompare);
    const postMethods = () => {
      const postContainer = document.querySelector(".all-Product");
      // console.log("g");
      monitorsToCompare.map((postData) => {
        var postElement = document.createElement("div");

        postElement.classList.add("zip-product");
        postElement.innerHTML = `
        <div class="bg-white px-4">
          <div class="h-[420px] p-4 border-b-[1px] border-b-[#DCD6F7]">
            <img class="mx-auto h-[180px]" src="${postData.image}" alt="">
            <h3 class="h-[120px] font-bold text-lg pt-4 pb-2 text-center text-black"> ${postData.productName} </h3>
            <p class=" h-[20px] text-[#F6130F] font-bold text-xl text-center">${postData.price} &#2547; </p>
          </div>
          <div class="h-[40px] border-b-[1px] border-b-[#DCD6F7] flex items-center justify-center">
            <p class=" text-base text-[#000000] text-opacity-50 text-center"> ${postData.resolution} </p>
          </div>
          <div class="h-[40px] border-b-[1px] border-b-[#DCD6F7]  flex items-center justify-center">
            <p class="text-base text-[#000000] text-opacity-50 text-center"> ${postData.displaySize} </p>
          </div>
          <div class="h-[40px] border-b-[1px] border-b-[#DCD6F7]  flex items-center justify-center">
            <p class="text-base text-[#000000] text-opacity-50 text-center"> ${postData.panelType} </p>
          </div>
          <div class="h-[40px] border-b-[1px] border-b-[#DCD6F7] flex items-center justify-center">
            <p class="text-xl text-emerald-800 font-bold text-center"> ${postData.shop} </p>
          </div>
          <div class=" border-b-[1px] border-b-[#DCD6F7]  flex items-center justify-center py-2">
            <p class="text-base text-[#000000] text-opacity-50 text-center"> ${postData.description}</p>
          </div>
        </div>
        
        `;

        
        

      //   <p class="zip-productName"> ${postData.productName} </p> 
      // <img src="${postData.image}" alt="" srcset="" class="zip-productImage"/>
      // <p class="zip-productPrice"> ${postData.price}</p>
      // <p class="zip-productResolution"> ${postData.resolution}</p>
      // <p class="zip-productDisplay"> ${postData.displaySize}</p>
      // <p class="zip-productPanel"> ${postData.panelType}</p>
      // <p class="zip-productShop"> ${postData.shop}</p>
      // <div class="zip-productDescriptionDiv">
      //   <p class="zip-productDescription">
      //   ${postData.description}
      //   </p>
      // </div>
        
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
  console.log("No data found in localStorage for 'monitorsToCompare'");
  // Handle the case where no data is present in localStorage
}


const clearButton = document.getElementById("clearBtn");

if (clearButton) {
  clearButton.addEventListener("click", () => {
    // Clear the monitorsToCompare from localStorage
    localStorage.removeItem("monitorsToCompare");
    
    // Empty the monitorsToCompare array in memory
    monitorsToCompare = [];
    
    // Optionally, update the UI to reflect that all monitors have been cleared
    const postContainer = document.querySelector(".all-Product");
    if (postContainer) {
      postContainer.innerHTML = ''; // Clear the product display in the UI
    }
    
    console.log("All monitors have been cleared.");
  });
}