let cards = [];

// document.addEventListener("DOMContentLoaded", () => {
//   let userData = JSON.parse(localStorage.getItem("userData"));


//   if (userData != null) {

//     if (userData.username) {

//       const account = document.querySelector(
//         "body > nav > div.nav-authentication > div > p"
//       );
//       account.innerHTML = userData.username;
//       const link1 = document.querySelector(
//         "body > nav > div.nav-authentication > div > div > a:nth-child(1)"
//       );
//       link1.innerHTML = "Profile";
//       link1.href = "";
//       const link2 = document.querySelector(
//         "body > nav > div.nav-authentication > div > div > a:nth-child(2)"
//       );
//       link2.innerHTML = "Logout";
//       link2.href = "";
//     }
//   }
// });

// const Logout = document.querySelector(
//   "body > nav > div.nav-authentication > div > div > a:nth-child(2)"
// );

// Logout.addEventListener("click", function (event) {
//   if (Logout.innerHTML == "Logout") {
//     event.preventDefault();
//     localStorage.removeItem("userData");

//     fetch("/backend/logout", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json", 
//       },
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.success) {
//           localStorage.removeItem("cartItems");
//           window.alert(data.message);
//           window.location.reload();
//         }
//       });
//   }
// });

// const profileButton= document.querySelector(
//   "body > nav > div.nav-authentication > div > div > a:nth-child(1)"
// );

// profileButton.addEventListener("click", function(event){
//   if(profileButton.innerHTML=="Profile"){
//     event.preventDefault();
//     window.location.href="/profile";
//   } 
// });

function goToDetailsPage(index) {
  var passMonitorObject = cards[index - 1];
  // localStorage.setItem("monitorData", JSON.stringify(passMonitorObject));
  // window.location.href = "../monitorDetailsPage/monitorDetailsPage.html";
  // Encode data as query parameters
  const queryParams = new URLSearchParams(passMonitorObject).toString();

  // Redirect to page2.html with data in the URL
  window.location.href = "/monitorDetails?" + queryParams;
}


// backend theke niye data gula cards a rakha
const fetchdata = async function () {
  try {
    const response = await fetch("/backend/fetchMonitorData", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    for (let i = 0; i < data.monitors.length; i++) {
      let card = {
        productName: data.monitors[i].productName,
        resolution: data.monitors[i].resolution,
        displaySize: data.monitors[i].displaySize,
        panelType: data.monitors[i].panelType,
        shop: data.monitors[i].shop,
        image: data.monitors[i].image,
        price: data.monitors[i].price,
        link: data.monitors[i].link,
        index: i + 1,
        itemCount: 0,
        description: data.monitors[i].description,
      };
      // console.log(cards.length);
      cards.push(card);
    }

    // Once the data is fetched, call the postMethods function
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const start = async function () {
  await fetchdata();

  //  console.log(cards);
  const rangeInput = document.querySelectorAll(".range-input input"),
    priceInput = document.querySelectorAll(".price-input input"),
    range = document.querySelector(".slider .progress");
  let priceGap = 10000;

  priceInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minPrice = parseInt(priceInput[0].value),
        maxPrice = parseInt(priceInput[1].value);

      if (maxPrice - minPrice >= priceGap && maxPrice <= rangeInput[1].max) {
        if (e.target.className === "input-min") {
          rangeInput[0].value = minPrice;
          range.style.left = (minPrice / rangeInput[0].max) * 100 + "%";
        } else {
          rangeInput[1].value = maxPrice;
          range.style.right = 100 - (maxPrice / rangeInput[1].max) * 100 + "%";
        }
      }
    });
  });

  rangeInput.forEach((input) => {
    input.addEventListener("input", (e) => {
      let minVal = parseInt(rangeInput[0].value),
        maxVal = parseInt(rangeInput[1].value);

      if (maxVal - minVal < priceGap) {
        if (e.target.className === "range-min") {
          rangeInput[0].value = maxVal - priceGap;
        } else {
          rangeInput[1].value = minVal + priceGap;
        }
      } else {
        priceInput[0].value = minVal;
        priceInput[1].value = maxVal;
        range.style.left = (minVal / rangeInput[0].max) * 100 + "%";
        range.style.right = 100 - (maxVal / rangeInput[1].max) * 100 + "%";
      }
    });
  });

  let temparr = [];

  cards.map((postData) => {
    temparr.push(postData);
  });

  let check = 0;
  const btn = document.querySelector(".filter");
  btn.addEventListener("click", () => {
    console.log("ssssssssssssddddddddddddddddddddddddddddddddddddddddddddd ");
    console.log(check);
    if (check == 0) {
      btn.style.backgroundColor = "#e7bc13";
      const ele = document.querySelector(".filteroption");
      ele.style.display = "inline";
      check = 1;
    } else {
      btn.style.backgroundColor = "#baf125";
      const ele = document.querySelector(".filteroption");
      ele.style.display = "none";
      check = 0;
    }
  });

  function addToCompare() {
    const compareButton = document.querySelectorAll(".addtoCompare");
    console.log(compareButton);
    compareButton.forEach((button, index) => {
      button.addEventListener("click", () => {
        console.log("something clicked");
        var monitorsToCompare = [];
        var tempMonitorsToCompare = localStorage.getItem("monitorsToCompare");
        if (tempMonitorsToCompare) {
          try {
            tempMonitorsToCompare = JSON.parse(tempMonitorsToCompare);
            if (tempMonitorsToCompare.length >= 4) {
              tempMonitorsToCompare.shift();
            }
            //monitorsToCompare = tempMonitorsToCompare;
            console.log(tempMonitorsToCompare);
          } catch (error) {
            console.log(error);
          }
        }
        console.log(tempMonitorsToCompare);
        if (tempMonitorsToCompare && Array.isArray(tempMonitorsToCompare)) {
          for (var item of tempMonitorsToCompare) {
            if (item.productName != temparr[index].productName) {
              console.log(item);
              monitorsToCompare.push(item);
            }
          }
        }
        monitorsToCompare.push(temparr[index]);
        console.log(monitorsToCompare);
        localStorage.setItem(
          "monitorsToCompare",
          JSON.stringify(monitorsToCompare)
        );
      });
    });
  }

  const submitButton = document.querySelector(".submit-button");

// submit button
  submitButton.addEventListener("click", () => {
    // min price
    let minOfRange = document.querySelector("#minimum-input").value;
    // max price
    let maxOfRange = document.querySelector("#maximum-input").value;
    // panel type
    let selectedPanelTypes = Array.from(document.querySelectorAll(".monipanelcheck"))
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    // display type
    let selectedDisplaySizes = Array.from(
      document.querySelectorAll(".monitordisplay"))
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
    // resolution type
    let selectedResolutions = Array.from(
      document.querySelectorAll(".monitorreso"))
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);

    let filterOptions = {
      minRange: minOfRange,
      maxRange: maxOfRange,
      panelTypes: selectedPanelTypes,
      displaySizes: selectedDisplaySizes,
      resolutions: selectedResolutions,
    };
    console.log(filterOptions.minRange);
    console.log(filterOptions.maxRange);
    console.log(temparr.length + "+++");
    temparr = [];
    console.log(temparr.length + "+++");
    // Send the filter options to the backend using fetch() method
    fetch("/backend/filterMonitor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filterOptions),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the backend

        // for(let i=0;i<data.monitors.length;i++)
        // {
        //   console.log("kk");
        //   temparr.push(data.monitors[i]);
        // }
        data.monitors.map((postData) => {
          temparr.push(postData);
        });
        // const page = document.querySelector(".pageNumbers");
        // const pageA = page.querySelectorAll("a");
        // console.log(pageA);
        // let pageco = pageA.length;
        // for (let i = 0; i < pageco; i++) {
        //   console.log("assssssssssssssfffffss");
        //   pageA[i].remove();
        // }
        // const divv = document.querySelectorAll(".card");
        // for (let i = 0; i < divv.length; i++) {
        //   divv[i].remove();
        // }

        const page = document.querySelector(".pageNumbers");
        const pageA = page.querySelectorAll("a");
        console.log(pageA);
        let pageco = pageA.length;
        for (let i = 0; i < pageco; i++) {
          console.log("assss");
          pageA[i].remove();
          console.log(pageA.length);
        }

        console.log(pageA.length);

        const divv = document.querySelectorAll(".card");
        for (let i = 0; i < divv.length; i++) {
          divv[i].remove();
        }
        const postMethods = () => {
          // console.log("g");
          temparr.map((postData) => {
            // console.log("b");

            const postElement = document.createElement("div");
            postElement.classList.add("card");
            postElement.innerHTML = `
            <a href="javascript:goToDetailsPage(${postData.index})" class="card-link">
            <p class="moniShop"> ${postData.shop}</p>
            <img src="${postData.image}" alt="" srcset="" class="card-image">
            <div class="divider"></div>
            <div class="card-name-box h-24" > 
              <h3 class="card-name">${postData.productName}</h3>
            </div>
            <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
            <p class="card-text display-size">Display Size: ${postData.displaySize}</p>
            <p class="card-text panel-size">Panel Type: ${postData.panelType}</p>
            <div class="divider"></div>
            <p class="price">Price: ${postData.price}</p>
            <div class="text-center mt-2 mb-2">
                <button class="buynow text-[#20204E] font-bold py-[6px] px-12 bg-[#E0E0E0] rounded-lg mt-3">
                <i class="fa-solid fa-cart-shopping text-[#20204E]"></i> Buy Now
                </button>
            </div>
            </a>
            <button class="addtoCompare text-sm text-[#000000] pt-2">Add to Compare</button>
        `;
            postContainer.appendChild(postElement);
          });
        };
        postMethods();
        addToCompare();

        const pageNumbers = document.querySelector(".pageNumbers");
        const paginationList = document.getElementById("pagination");
        const cardItems = document.querySelectorAll(".card");
        const prevButton = document.getElementById("prev");
        const nextButton = document.getElementById("next");

        const contentLimit = 60;
        const pageCount = Math.ceil(temparr.length / contentLimit);
        let currentPage = 1;

        const displayPageNumbers = (index) => {
          const pageNumber = document.createElement("a");
          pageNumber.innerText = index;
          pageNumber.setAttribute("href", "#");
          pageNumber.setAttribute("index", index);
          pageNumbers.appendChild(pageNumber);
        };

        const getPageNumbers = () => {
          for (let i = 1; i <= pageCount; i++) {
            console.log("fff");
            displayPageNumbers(i);
          }
        };

        const disableButton = (button) => {
          button.classList.add("disabled");
          button.setAttribute("disabled", true);
        };

        const enableButton = (button) => {
          button.classList.remove("disabled");
          button.removeAttribute("disabled");
        };

        const controlButtonStatus = () => {
          if (currentPage == 1) {
            disableButton(prevButton);
          } else {
            enableButton(prevButton);
          }
          if (currentPage == pageCount) {
            disableButton(nextButton);
          } else {
            enableButton(nextButton);
          }
        };

        const handleActivePageNumber = () => {
          document.querySelectorAll("a").forEach((button) => {
            button.classList.remove("active");
            const pageIndex = Number(button.getAttribute("index"));
            if (pageIndex == currentPage) {
              button.classList.add("active");
            }
          });
        };
        const setCurrentPage = (pageNum) => {
          currentPage = pageNum;
          handleActivePageNumber();
          controlButtonStatus();
          const prevRange = (pageNum - 1) * contentLimit;
          const currRange = pageNum * contentLimit;
          // console.log(cardItems);
          cardItems.forEach((item, index) => {
            //console.log(item);
            //console.log('aa');
            //console.log(index);
            item.classList.add("hidden");
            if (index >= prevRange && index < currRange) {
              item.classList.remove("hidden");
            }
          });
        };
        getPageNumbers();
        setCurrentPage(1);
        prevButton.addEventListener("click", () => {
          setCurrentPage(currentPage - 1);
        });
        nextButton.addEventListener("click", () => {
          setCurrentPage(currentPage + 1);
        });

        document.querySelectorAll("a").forEach((button) => {
          const pageIndex = Number(button.getAttribute("index"));
          if (pageIndex) {
            button.addEventListener("click", () => {
              setCurrentPage(pageIndex);
            });
          }
        });
      })
      .catch((error) => {
        // Handle errors
        console.error("Error:", error);
      });
  });
  const resetButton = document.querySelector(".reset-button");


// reset button
  resetButton.addEventListener("click", () => {
    // for (let i = 0; i < temparr.length; i++) {
    //   temparr.pop();
    // }
    console.log("bbb");
    const page = document.querySelector(".pageNumbers");
    const pageA = page.querySelectorAll("a");
    let pageco = pageA.length;
    for (let i = 0; i < pageco; i++) {
      console.log("assss");
      pageA[i].remove();
    }

    const divv = document.querySelectorAll(".card");
    for (let i = 0; i < divv.length; i++) {
      divv[i].remove();
    }
    temparr = [];
    cards.map((postData) => {
      temparr.push(postData);
    });
    const postMethods = () => {
      // console.log("g");
      temparr.map((postData) => {
        // console.log("b");

        const postElement = document.createElement("div");
        postElement.classList.add("card");
        postElement.innerHTML = `
        <a href="javascript:goToDetailsPage(${postData.index})" class="card-link">
            <p class="moniShop"> ${postData.shop}</p>
            <img src="${postData.image}" alt="" srcset="" class="card-image">
            <div class="divider"></div>
            <div class="card-name-box h-24" > 
              <h3 class="card-name">${postData.productName}</h3>
            </div>
            <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
            <p class="card-text display-size">Display Size: ${postData.displaySize}</p>
            <p class="card-text panel-size">Panel Type: ${postData.panelType}</p>
            <div class="divider"></div>
            <p class="price">Price: ${postData.price}</p>
            <div class="text-center mt-2 mb-2">
                <button class="buynow text-[#20204E] font-bold py-[6px] px-12 bg-[#E0E0E0] rounded-lg mt-3">
                <i class="fa-solid fa-cart-shopping text-[#20204E]"></i> Buy Now
                </button>
            </div>
            </a>
            <button class="addtoCompare text-sm text-[#000000] pt-2">Add to Compare</button>
        `;
        postContainer.appendChild(postElement);
      });
    };
    postMethods();
    addToCompare();

    const pageNumbers = document.querySelector(".pageNumbers");
    const paginationList = document.getElementById("pagination");
    const cardItems = document.querySelectorAll(".card");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const contentLimit = 60;
    const pageCount = Math.ceil(temparr.length / contentLimit);
    let currentPage = 1;

    const displayPageNumbers = (index) => {
      const pageNumber = document.createElement("a");
      pageNumber.innerText = index;
      pageNumber.setAttribute("href", "#");
      pageNumber.setAttribute("index", index);
      pageNumbers.appendChild(pageNumber);
    };

    const getPageNumbers = () => {
      for (let i = 1; i <= pageCount; i++) {
        displayPageNumbers(i);
      }
    };

    const disableButton = (button) => {
      button.classList.add("disabled");
      button.setAttribute("disabled", true);
    };

    const enableButton = (button) => {
      button.classList.remove("disabled");
      button.removeAttribute("disabled");
    };

    const controlButtonStatus = () => {
      if (currentPage == 1) {
        disableButton(prevButton);
      } else {
        enableButton(prevButton);
      }
      if (currentPage == pageCount) {
        disableButton(nextButton);
      } else {
        enableButton(nextButton);
      }
    };

    const handleActivePageNumber = () => {
      document.querySelectorAll("a").forEach((button) => {
        button.classList.remove("active");
        const pageIndex = Number(button.getAttribute("index"));
        if (pageIndex == currentPage) {
          button.classList.add("active");
        }
      });
    };
    const setCurrentPage = (pageNum) => {
      currentPage = pageNum;
      handleActivePageNumber();
      controlButtonStatus();
      const prevRange = (pageNum - 1) * contentLimit;
      const currRange = pageNum * contentLimit;
      // console.log(cardItems);
      cardItems.forEach((item, index) => {
        //console.log(item);
        //console.log('aa');
        //console.log(index);
        item.classList.add("hidden");
        if (index >= prevRange && index < currRange) {
          item.classList.remove("hidden");
        }
      });
    };
    getPageNumbers();
    setCurrentPage(1);
    prevButton.addEventListener("click", () => {
      setCurrentPage(currentPage - 1);
    });
    nextButton.addEventListener("click", () => {
      setCurrentPage(currentPage + 1);
    });

    document.querySelectorAll("a").forEach((button) => {
      const pageIndex = Number(button.getAttribute("index"));
      if (pageIndex) {
        button.addEventListener("click", () => {
          setCurrentPage(pageIndex);
        });
      }
    });
  });

  const postContainer = document.querySelector(".card-container");

  const searchInput = document.getElementById("searchbar");


// search input click function
  searchInput.addEventListener("input", (e) => {
    console.log(e.target.value);
    console.log("ghhh");

    const value = e.target.value.toLowerCase();
    let arr = [];
    console.log(temparr);
    temparr.forEach((item) => {
      const isvisible = item.productName.toLowerCase().includes(value);
      if (isvisible) {
        arr.push(item);
        console.log(item);
      }
    });
    console.log(arr + " addd");
    console.log(e.target.value);
    if (e.target.value == "") {
      console.log("1222222");
      const page = document.querySelector(".pageNumbers");
      const pageA = page.querySelectorAll("a");
      console.log(pageA);
      let pageco = pageA.length;
      for (let i = 0; i < pageco; i++) {
        console.log("assssssssssssssfffffss");
        pageA[i].remove();
        console.log(pageA.length);
      }
      console.log(pageA.length);

      const divv = document.querySelectorAll(".card");
      for (let i = 0; i < divv.length; i++) {
        divv[i].remove();
      }

      const postMethods = () => {
        // console.log("g");
        arr.map((postData) => {
          // console.log("b");

          const postElement = document.createElement("div");
          postElement.classList.add("card");
          postElement.innerHTML = `
          <a href="javascript:goToDetailsPage(${postData.index})" class="card-link">
            <p class="moniShop"> ${postData.shop}</p>
            <img src="${postData.image}" alt="" srcset="" class="card-image">
            <div class="divider"></div>
            <div class="card-name-box h-24" > 
              <h3 class="card-name">${postData.productName}</h3>
            </div>
            <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
            <p class="card-text display-size">Display Size: ${postData.displaySize}</p>
            <p class="card-text panel-size">Panel Type: ${postData.panelType}</p>
            <div class="divider"></div>
            <p class="price">Price: ${postData.price}</p>
            <div class="text-center mt-2 mb-2">
                <button class="buynow text-[#20204E] font-bold py-[6px] px-12 bg-[#E0E0E0] rounded-lg mt-3">
                <i class="fa-solid fa-cart-shopping text-[#20204E]"></i> Buy Now
                </button>
            </div>
            </a>
            <button class="addtoCompare text-sm text-[#000000] pt-2">Add to Compare</button>
        `;
          postContainer.appendChild(postElement);
        });
      };
      postMethods();
      const compareButton = document.querySelectorAll(".addtoCompare");
      console.log(compareButton);
      compareButton.forEach((button, index) => {
        button.addEventListener("click", () => {
          console.log("something clicked");
          var monitorsToCompare = [];
          var tempMonitorsToCompare = localStorage.getItem("monitorsToCompare");
          if (tempMonitorsToCompare) {
            try {
              tempMonitorsToCompare = JSON.parse(tempMonitorsToCompare);
              if (tempMonitorsToCompare.length >= 4) {
                tempMonitorsToCompare.shift();
              }
              //monitorsToCompare = tempMonitorsToCompare;
              console.log(tempMonitorsToCompare);
            } catch (error) {
              console.log(error);
            }
          }
          console.log(tempMonitorsToCompare);
          if (tempMonitorsToCompare && Array.isArray(tempMonitorsToCompare)) {
            for (var item of tempMonitorsToCompare) {
              if (item.productName != arr[index].productName) {
                console.log(item);
                monitorsToCompare.push(item);
              }
            }
          }
          monitorsToCompare.push(arr[index]);
          console.log(monitorsToCompare);
          localStorage.setItem(
            "monitorsToCompare",
            JSON.stringify(monitorsToCompare)
          );
        });
      });
      const pageNumbers = document.querySelector(".pageNumbers");
      const paginationList = document.getElementById("pagination");
      const cardItems = document.querySelectorAll(".card");
      const prevButton = document.getElementById("prev");
      const nextButton = document.getElementById("next");

      const contentLimit = 60;
      const pageCount = Math.ceil(cards.length / contentLimit);
      let currentPage = 1;

      const displayPageNumbers = (index) => {
        const pageNumber = document.createElement("a");
        pageNumber.innerText = index;
        pageNumber.setAttribute("href", "#");
        pageNumber.setAttribute("index", index);
        pageNumbers.appendChild(pageNumber);
      };

      const getPageNumbers = () => {
        for (let i = 1; i <= pageCount; i++) {
          // console.log("1");
          displayPageNumbers(i);
        }
      };

      const disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
      };

      const enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
      };

      const controlButtonStatus = () => {
        if (currentPage == 1) {
          disableButton(prevButton);
        } else {
          enableButton(prevButton);
        }
        if (currentPage == pageCount) {
          disableButton(nextButton);
        } else {
          enableButton(nextButton);
        }
      };

      const handleActivePageNumber = () => {
        document.querySelectorAll("a").forEach((button) => {
          button.classList.remove("active");
          const pageIndex = Number(button.getAttribute("index"));
          if (pageIndex == currentPage) {
            button.classList.add("active");
          }
        });
      };
      const setCurrentPage = (pageNum) => {
        currentPage = pageNum;
        handleActivePageNumber();
        controlButtonStatus();
        const prevRange = (pageNum - 1) * contentLimit;
        const currRange = pageNum * contentLimit;
        // console.log(cardItems);
        cardItems.forEach((item, index) => {
          //console.log(item);
          //console.log('aa');
          //console.log(index);
          item.classList.add("hidden");
          if (index >= prevRange && index < currRange) {
            item.classList.remove("hidden");
          }
        });
      };
      getPageNumbers();
      setCurrentPage(1);
      prevButton.addEventListener("click", () => {
        setCurrentPage(currentPage - 1);
      });
      nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
      });

      document.querySelectorAll("a").forEach((button) => {
        const pageIndex = Number(button.getAttribute("index"));
        if (pageIndex) {
          button.addEventListener("click", () => {
            setCurrentPage(pageIndex);
          });
        }
      });
    } else {
      console.log("123");

      const page = document.querySelector(".pageNumbers");
      const pageA = page.querySelectorAll("a");
      console.log(pageA);
      let pageco = pageA.length;
      for (let i = 0; i < pageco; i++) {
        console.log("assss");
        pageA[i].remove();
        console.log(pageA.length);
      }

      const divv = document.querySelectorAll(".card");
      for (let i = 0; i < divv.length; i++) {
        divv[i].remove();
      }
      const postMethods = () => {
        // console.log("g");
        arr.map((postData) => {
          // console.log("b");

          const postElement = document.createElement("div");
          postElement.classList.add("card");
          postElement.innerHTML = `
          <a href="javascript:goToDetailsPage(${postData.index})" class="card-link">
            <p class="moniShop"> ${postData.shop}</p>
            <img src="${postData.image}" alt="" srcset="" class="card-image">
            <div class="divider"></div>
            <div class="card-name-box h-24" > 
              <h3 class="card-name">${postData.productName}</h3>
            </div>
            <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
            <p class="card-text display-size">Display Size: ${postData.displaySize}</p>
            <p class="card-text panel-size">Panel Type: ${postData.panelType}</p>
            <div class="divider"></div>
            <p class="price">Price: ${postData.price}</p>
            <div class="text-center mt-2 mb-2">
                <button class="buynow text-[#20204E] font-bold py-[6px] px-12 bg-[#E0E0E0] rounded-lg mt-3">
                <i class="fa-solid fa-cart-shopping text-[#20204E]"></i> Buy Now
                </button>
            </div>
            </a>
            <button class="addtoCompare text-sm text-[#000000] pt-2">Add to Compare</button>
        `;
          postContainer.appendChild(postElement);
        });
      };
      postMethods();
      const compareButton = document.querySelectorAll(".addtoCompare");
      console.log(compareButton);
      compareButton.forEach((button, index) => {
        button.addEventListener("click", () => {
          console.log("something clicked");
          var monitorsToCompare = [];
          var tempMonitorsToCompare = localStorage.getItem("monitorsToCompare");
          if (tempMonitorsToCompare) {
            try {
              tempMonitorsToCompare = JSON.parse(tempMonitorsToCompare);
              if (tempMonitorsToCompare.length >= 4) {
                tempMonitorsToCompare.shift();
              }
              //monitorsToCompare = tempMonitorsToCompare;
              console.log(tempMonitorsToCompare);
            } catch (error) {
              console.log(error);
            }
          }
          console.log(tempMonitorsToCompare);
          if (tempMonitorsToCompare && Array.isArray(tempMonitorsToCompare)) {
            for (var item of tempMonitorsToCompare) {
              if (item.productName != arr[index].productName) {
                console.log(item);
                monitorsToCompare.push(item);
              }
            }
          }
          monitorsToCompare.push(arr[index]);
          console.log(monitorsToCompare);
          localStorage.setItem(
            "monitorsToCompare",
            JSON.stringify(monitorsToCompare)
          );
        });
      });

      const pageNumbers = document.querySelector(".pageNumbers");

      const paginationList = document.getElementById("pagination");
      const cardItems = document.querySelectorAll(".card");
      const prevButton = document.getElementById("prev");
      const nextButton = document.getElementById("next");

      const contentLimit = 60;
      const pageCount = Math.ceil(arr.length / contentLimit);
      console.log(pageCount);
      let currentPage = 1;

      const displayPageNumbers = (index) => {
        const pageNumber = document.createElement("a");
        pageNumber.innerText = index;
        pageNumber.setAttribute("href", "#");
        pageNumber.setAttribute("index", index);
        pageNumbers.appendChild(pageNumber);
      };

      const getPageNumbers = () => {
        for (let i = 1; i <= pageCount; i++) {
          displayPageNumbers(i);
        }
      };

      const disableButton = (button) => {
        button.classList.add("disabled");
        button.setAttribute("disabled", true);
      };

      const enableButton = (button) => {
        button.classList.remove("disabled");
        button.removeAttribute("disabled");
      };

      const controlButtonStatus = () => {
        if (currentPage == 1) {
          disableButton(prevButton);
        } else {
          enableButton(prevButton);
        }
        if (currentPage == pageCount) {
          disableButton(nextButton);
        } else {
          enableButton(nextButton);
        }
      };

      const handleActivePageNumber = () => {
        document.querySelectorAll("a").forEach((button) => {
          button.classList.remove("active");
          const pageIndex = Number(button.getAttribute("index"));
          if (pageIndex == currentPage) {
            button.classList.add("active");
          }
        });
      };
      const setCurrentPage = (pageNum) => {
        currentPage = pageNum;
        handleActivePageNumber();
        controlButtonStatus();
        const prevRange = (pageNum - 1) * contentLimit;
        const currRange = pageNum * contentLimit;
        // console.log(cardItems);
        cardItems.forEach((item, index) => {
          //console.log(item);
          //console.log('aa');
          //console.log(index);
          item.classList.add("hidden");
          if (index >= prevRange && index < currRange) {
            item.classList.remove("hidden");
          }
        });
      };
      getPageNumbers();
      setCurrentPage(1);
      prevButton.addEventListener("click", () => {
        setCurrentPage(currentPage - 1);
      });
      nextButton.addEventListener("click", () => {
        setCurrentPage(currentPage + 1);
      });

      document.querySelectorAll("a").forEach((button) => {
        const pageIndex = Number(button.getAttribute("index"));
        if (pageIndex) {
          button.addEventListener("click", () => {
            setCurrentPage(pageIndex);
          });
        }
      });
    }
  });

  const postMethods = () => {
    temparr.map((postData) => {
      // console.log("b");
      const postElement = document.createElement("div");
      postElement.classList.add("card");
      postElement.innerHTML = `
      <a href="javascript:goToDetailsPage(${postData.index})" class="card-link">
            <p class="moniShop"> ${postData.shop}</p>
            <img src="${postData.image}" alt="" srcset="" class="card-image">
            <div class="divider"></div>
            <div class="card-name-box h-24" > 
              <h3 class="card-name">${postData.productName}</h3>
            </div>
            <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
            <p class="card-text display-size">Display Size: ${postData.displaySize}</p>
            <p class="card-text panel-size">Panel Type: ${postData.panelType}</p>
            <div class="divider"></div>
            <p class="price">Price: ${postData.price}</p>
            <div class="text-center mt-2 mb-2">
                <button class="buynow text-[#20204E] font-bold py-[6px] px-12 bg-[#E0E0E0] rounded-lg mt-3">
                <i class="fa-solid fa-cart-shopping text-[#20204E]"></i> Buy Now
                </button>
            </div>
            </a>
            <button class="addtoCompare text-sm text-[#000000] pt-2">Add to Compare</button>
        `;
      postContainer.appendChild(postElement);
    });
  };
  postMethods();

  const pageNumbers = document.querySelector(".pageNumbers");
  const paginationList = document.getElementById("pagination");
  const cardItems = document.querySelectorAll(".card");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  const contentLimit = 60;
  const pageCount = Math.ceil(cards.length / contentLimit);
  let currentPage = 1;

  const displayPageNumbers = (index) => {
    const pageNumber = document.createElement("a");
    pageNumber.innerText = index;
    pageNumber.setAttribute("href", "#");
    pageNumber.setAttribute("index", index);
    pageNumbers.appendChild(pageNumber);
  };

  const getPageNumbers = () => {
    for (let i = 1; i <= pageCount; i++) {
      displayPageNumbers(i);
    }
  };

  const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
  };

  const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
  };

  const controlButtonStatus = () => {
    if (currentPage == 1) {
      disableButton(prevButton);
    } else {
      enableButton(prevButton);
    }
    if (currentPage == pageCount) {
      disableButton(nextButton);
    } else {
      enableButton(nextButton);
    }
  };

  const handleActivePageNumber = () => {
    document.querySelectorAll("a").forEach((button) => {
      button.classList.remove("active");
      const pageIndex = Number(button.getAttribute("index"));
      if (pageIndex == currentPage) {
        button.classList.add("active");
      }
    });
  };
  const setCurrentPage = (pageNum) => {
    currentPage = pageNum;
    handleActivePageNumber();
    controlButtonStatus();
    const prevRange = (pageNum - 1) * contentLimit;
    const currRange = pageNum * contentLimit;
    // console.log(cardItems);
    cardItems.forEach((item, index) => {
      //console.log(item);
      //console.log('aa');
      //console.log(index);
      item.classList.add("hidden");
      if (index >= prevRange && index < currRange) {
        item.classList.remove("hidden");
      }
    });
  };
  getPageNumbers();
  setCurrentPage(1);
  prevButton.addEventListener("click", () => {
    setCurrentPage(currentPage - 1);
  });
  nextButton.addEventListener("click", () => {
    setCurrentPage(currentPage + 1);
  });

  document.querySelectorAll("a").forEach((button) => {
    const pageIndex = Number(button.getAttribute("index"));
    if (pageIndex) {
      button.addEventListener("click", () => {
        setCurrentPage(pageIndex);
      });
    }
  });

  addToCompare();
};

start();
