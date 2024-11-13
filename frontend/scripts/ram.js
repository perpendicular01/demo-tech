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

let cards = [];

const fetchdata = async function () {
  // await fetch("/backend/fetchMonitorData", {
  //   method: "POST",
  //   headers: { "Content-type": "application/json" },
  // })
  //   .then((response) => response.json())
  //   .then((data) => {
  //     for (let i = 0; i < data.rams.length; i++) {
  //       let card = {
  //         product_name: data.rams[i].productName,
  //         resolution: data.rams[i].resolution,
  //         display_size: data.rams[i].displaySize,
  //         panel_type: data.rams[i].panelType,
  //         refresh_rate: data.rams[i].refreshRate,
  //         image: data.rams[i].image,
  //       };
  //       console.log(cards.length);
  //       cards.push(card);
  //     }
  //   });

  try {
    const response = await fetch("/backend/fetchRAMData", {
      method: "POST",
      headers: { "Content-type": "application/json" },
    });
    
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    for (let i = 0; i < data.rams.length; i++) {
      let card = {
        product_name: data.rams[i].productName,
        type: data.rams[i].type,
        capacity: data.rams[i].capacity,
        frequency: data.rams[i].frequency,
        latency: data.rams[i].latency,
        image: data.rams[i].image,
      };
      // console.log(cards.length);
      cards.push(card);
    }

    // Once the data is fetched, call the postMethods function

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const start=async function(){

await fetchdata();

//  console.log(cards);

const postContainer = document.querySelector(".card-container");

// cards.map((postdata)=>{
//     console.log(postdata);

// });



// const postMethods = () => {
//   // console.log("g");
//   cards.map((postData) => {
//     // console.log("b");
//     // console.log(postData);
//     const postElement = document.createElement("div");
//     postElement.classList.add("card");
//     postElement.innerHTML = `
//         <img src="${postData.image}" alt="" srcset="" class="card-image">
//         <h3 class="card-name">${postData.product_name}</h3>
//         <p class="card-text resoluiton">Resolution: ${postData.resolution}</p>
//         <p class="card-text display-size">Display Size: ${postData.display_size}</p>
//         <p class="card-text panel-size">Panel Type: ${postData.panel_type}</p>
//         <p class="card-text refresh-rate">Refresh Rate: ${postData.refresh_rate}</p>
//         `;
//     postContainer.appendChild(postElement);
//   });
// };
// postMethods();

// console.log(cards.length);
// const pageNumbers=document.querySelector('.pageNumbers');
// const paginationList=document.getElementById("pagination");
// const cardItems=document.querySelectorAll('.card');
// const prevButton=document.getElementById('prev');
// const nextButton=document.getElementById('next');

// const contentLimit=30;
// const pageCount=Math.ceil(cards.length/contentLimit);
// let currentPage=1;



// const displayPageNumbers=(index)=>{
//     const pageNumber=document.createElement("a");
//     pageNumber.innerText=index;
//     pageNumber.setAttribute('href','#');
//     pageNumber.setAttribute('index',index);
//     pageNumbers.appendChild(pageNumber);
// };

// const getPageNumbers=()=>{
//     for(let i=1;i<=pageCount;i++)
//     {
//         displayPageNumbers(i);
//     } 
// };



// const disableButton=(button)=>{
//     button.classList.add('disabled');
//     button.setAttribute('disabled',true);
// }

// const enableButton=(button)=>{
//     button.classList.remove("disabled");
//     button.removeAttribute("disabled");  
// }



// const controlButtonStatus=()=>{
//     if(currentPage==1)
//     {
//         disableButton(prevButton);
//     }
//     else
//     {
//         enableButton(prevButton);
//     }
//     if(currentPage==pageCount)
//     {
//         disableButton(nextButton);
//     }
//     else
//     {
//         enableButton(nextButton);
//     }
        
// };

// const handleActivePageNumber=()=>{
//     document.querySelectorAll('a').forEach((button)=>
//     {
//         button.classList.remove('active');
//         const pageIndex=Number(button.getAttribute('index'));
//         if(pageIndex==currentPage)
//         {
//             button.classList.add('active');
//         }
//     });
    
// };
// const setCurrentPage=(pageNum)=>{
//     console.log("ff");
//     currentPage=pageNum;
//     handleActivePageNumber();
//     controlButtonStatus();
//     const prevRange=(pageNum-1)*contentLimit;
//     const currRange=pageNum*contentLimit;
//     console.log(cardItems);
//     cardItems.forEach((item,index)=>{
//         console.log(item);
//         console.log('aa');
//         console.log(index);
//         item.classList.add("hidden");
//         if(index>=prevRange && index<currRange)
//         {
//             item.classList.remove("hidden");
//         }
//     });
// };

// getPageNumbers();
//     setCurrentPage(1);
//     prevButton.addEventListener('click',()=>{
//         setCurrentPage(currentPage-1);
//     })
//     nextButton.addEventListener('click',()=>{
//         setCurrentPage(currentPage+1);
//     })


//     document.querySelectorAll('a').forEach((button)=>{
//         const pageIndex=Number(button.getAttribute('index'));
//         if(pageIndex)
//         {
//             button.addEventListener('click',()=>{
//                 setCurrentPage(pageIndex);
//             });
//         };
//     });

// window.addEventListener('load',()=>{
//     getPageNumbers();
//     setCurrentPage(1);
//     prevButton.addEventListener('click',()=>{
//         setCurrentPage(currentPage-1);
//     })
//     nextButton.addEventListener('click',()=>{
//         setCurrentPage(currentPage+1);
//     })


//     document.querySelectorAll('a').forEach((button)=>{
//         const pageIndex=Number(button.getAttribute('index'));
//         if(pageIndex)
//         {
//             button.addEventListener('click',()=>{
//                 setCurrentPage(pageIndex);
//             });
//         };
//     });
// });

// }



//aaaa

const searchInput = document.getElementById("searchbar");

searchInput.addEventListener("input", (e) => {
  console.log(e.target.value);

  const value = e.target.value.toLowerCase();
  let arr = [];
  cards.forEach((item) => {
    const isvisible =
      item.product_name.toLowerCase().includes(value)
    if (isvisible) {
      console.log(item);
      arr.push(item);
      // console.log(item);
    }
  });
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
    }
    const divv = document.querySelectorAll(".card");
    for (let i = 0; i < divv.length; i++) {
      divv[i].remove();
    }

    const postMethods = () => {
      // console.log("g");
      cards.map((postData) => {
        console.log(postData.image)
        // console.log("b");
        // console.log(postData);
        const postElement = document.createElement("div");
        postElement.classList.add("card");
        postElement.innerHTML = `
            <img src="${postData.image}" alt="" srcset="" class="card-image">
            <h3 class="card-name">${postData.product_name}</h3>
            <p class="card-text resoluiton">Type: ${postData.type}</p>
            <p class="card-text display-size">Capacity: ${postData.capacity}</p>
            <p class="card-text panel-size">Frequency: ${postData.frequency}</p>
            <p class="card-text refresh-rate">Latency: ${postData.latency}</p>
            `;
        postContainer.appendChild(postElement);
      });
    };
    postMethods();
    // cards.map((postData) => {
    //   //console.log(postData);
    //   const postElement = document.createElement("div");
    //   postElement.classList.add("card");
    //   postElement.innerHTML = `<h3 class="card-name">${postData.card_name}</h3>
    //             </h3>
    //             <p class="card-text size">Size:</p>
    //             <p class="card-text price">Price:</p>
    //             <p class="card-text resolution">Resolution</p>
    //             <p class="card-text size">Size:</p>
    //             <p class="card-text price">Price:</p>
    //             <p class="card-text resolution">Resolution</p>`;
    //   postContainer.appendChild(postElement);
    // });
    const pageNumbers = document.querySelector(".pageNumbers");
    const paginationList = document.getElementById("pagination");
    const cardItems = document.querySelectorAll(".card");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const contentLimit = 30;
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
  } else {
    console.log("123");

    const page = document.querySelector(".pageNumbers");
    const pageA = page.querySelectorAll("a");
    console.log(pageA);
    let pageco = pageA.length;
    for (let i = 0; i < pageco; i++) {
      console.log("assss");
      pageA[i].remove();
    }

    const divv = document.querySelectorAll(".card");
    for (let i = 0; i < divv.length; i++) {
      divv[i].remove();
    }
    const postMethods = () => {
        // console.log("g");
        arr.map((postData) => {
          console.log(postData.image)
          // console.log("b");
          // console.log(postData);
          const postElement = document.createElement("div");
          postElement.classList.add("card");
          postElement.innerHTML = `
              <img src="${postData.image}" alt="" srcset="" class="card-image">
              <h3 class="card-name">${postData.product_name}</h3>
              <p class="card-text resoluiton">Type: ${postData.type}</p>
              <p class="card-text display-size">Capacity: ${postData.capacity}</p>
              <p class="card-text panel-size">Frequency: ${postData.frequency}</p>
              <p class="card-text refresh-rate">Latency: ${postData.latency}</p>
              `;
          postContainer.appendChild(postElement);
        });
      };
      postMethods();
    // arr.map((postData) => {
    //   //console.log(postData);
    //   const postElement = document.createElement("div");
    //   postElement.classList.add("card");
    //   postElement.innerHTML = `<h3 class="card-name">${postData.card_name}</h3>
    //             </h3>
    //             <p class="card-text size">Size:</p>
    //             <p class="card-text price">Price:</p>
    //             <p class="card-text resolution">Resolution</p>
    //             <p class="card-text size">Size:</p>
    //             <p class="card-text price">Price:</p>
    //             <p class="card-text resolution">Resolution</p>`;
    //   postContainer.appendChild(postElement);
    // });

    const pageNumbers = document.querySelector(".pageNumbers");

    const paginationList = document.getElementById("pagination");
    const cardItems = document.querySelectorAll(".card");
    const prevButton = document.getElementById("prev");
    const nextButton = document.getElementById("next");

    const contentLimit = 30;
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

//     const postMethods=()=>{

//     cards.map((postData)=>{
//         //console.log(postData);
//         const postElement=document.createElement('div');
//         postElement.classList.add('card');
//         postElement.innerHTML = `<h3 class="card-name">${postData.card_name}</h3>
//         </h3>
//         <p class="card-text size">Size:</p>
//         <p class="card-text price">Price:</p>
//         <p class="card-text resolution">Resolution</p>
//         <p class="card-text size">Size:</p>
//         <p class="card-text price">Price:</p>
//         <p class="card-text resolution">Resolution</p>`
//         postContainer.appendChild(postElement);

//     })

// }
// postMethods();

// document.getElementById('searchbar').addEventListener('keyup',(e)=>)
// {
//     const searchData=e.target.value.toLowerCase();
//     const filterData=cards.filter((item)=>{
//         return (
//             item.size.toLocaleLowerCase().include(searchData)
//         )

//     });

// }
const postMethods = () => {
    // console.log("g");
    cards.map((postData) => {
      console.log(postData.image)
      // console.log("b");
      // console.log(postData);
      const postElement = document.createElement("div");
      postElement.classList.add("card");
      postElement.innerHTML = `
          <img src="${postData.image}" alt="" srcset="" class="card-image">
          <h3 class="card-name">${postData.product_name}</h3>
          <p class="card-text resoluiton">Type: ${postData.type}</p>
          <p class="card-text display-size">Capacity: ${postData.capacity}</p>
          <p class="card-text panel-size">Frequency: ${postData.frequency}</p>
          <p class="card-text refresh-rate">Latency: ${postData.latency}</p>
          `;
      postContainer.appendChild(postElement);
    });
  };
  postMethods();
// cards.map((postData) => {
//   //console.log(postData);
//   const postElement = document.createElement("div");
//   postElement.classList.add("card");
//   postElement.innerHTML = `<h3 class="card-name">${postData.card_name}</h3>
//       </h3>
//       <p class="card-text size">Size:</p>
//       <p class="card-text price">Price:</p>
//       <p class="card-text resolution">Resolution</p>
//       <p class="card-text size">Size:</p>
//       <p class="card-text price">Price:</p>
//       <p class="card-text resolution">Resolution</p>`;
//   postContainer.appendChild(postElement);
// });
const pageNumbers = document.querySelector(".pageNumbers");
const paginationList = document.getElementById("pagination");
const cardItems = document.querySelectorAll(".card");
const prevButton = document.getElementById("prev");
const nextButton = document.getElementById("next");

const contentLimit = 30;
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



window.addEventListener("load", () => {
  console.log("ss");
  const postMethods = () => {
    // console.log("g");
    cards.map((postData) => {
      console.log(postData.image)
      // console.log("b");
      // console.log(postData);
      const postElement = document.createElement("div");
      postElement.classList.add("card");
      postElement.innerHTML = `
          <img src="${postData.image}" alt="" srcset="" class="card-image">
          <h3 class="card-name">${postData.product_name}</h3>
          <p class="card-text resoluiton">Type: ${postData.type}</p>
          <p class="card-text display-size">Capacity: ${postData.capacity}</p>
          <p class="card-text panel-size">Frequency: ${postData.frequency}</p>
          <p class="card-text refresh-rate">Latency: ${postData.latency}</p>
          `;
      postContainer.appendChild(postElement);
    });
  };
  postMethods();
  // cards.map((postData) => {
  //   //console.log(postData);
  //   const postElement = document.createElement("div");
  //   postElement.classList.add("card");
  //   postElement.innerHTML = `<h3 class="card-name">${postData.card_name}</h3>
  //       </h3>
  //       <p class="card-text size">Size:</p>
  //       <p class="card-text price">Price:</p>
  //       <p class="card-text resolution">Resolution</p>
  //       <p class="card-text size">Size:</p>
  //       <p class="card-text price">Price:</p>
  //       <p class="card-text resolution">Resolution</p>`;
  //   postContainer.appendChild(postElement);
  // });
  const pageNumbers = document.querySelector(".pageNumbers");
  const paginationList = document.getElementById("pagination");
  const cardItems = document.querySelectorAll(".card");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");

  const contentLimit = 30;
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
});

}



start();



