// @ts-nocheck

// Loading jobs and categories
const works = await fetch("http://localhost:5678/api/works");
const worksResponse = await works.json();
console.log(worksResponse);

const categories = await fetch("http://localhost:5678/api/categories");
const categoriesResponse = await categories.json();
console.log(categoriesResponse);

// Function to display works
const displayWorks = (works) => {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = works
    .map((work) => {
      return `<figure>
        <img src="${work.imageUrl}" alt="${work.title}" />
        <figcaption>${work.title}</figcaption>
      </figure>`;
    })
    .join("");
};

// Display all works on the main page
displayWorks(worksResponse);

// Generating filter buttons on the main page
const filters = document.querySelector(".filters");
filters.innerHTML = `
  <button data-category="all">Tous</button>
  ${categoriesResponse
    .map((category) => {
      return `<button data-category="${category.id}">${category.name}</button>`;
    })
    .join("")}`;

// Add event handlers on buttons
const buttons = document.querySelectorAll(".filters button");
buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    const category = event.target.dataset.category;
    console.log(`Bouton cliqué : ${category}`);

    // Filter the works
    const filteredWorks =
      category === "all"
        ? worksResponse // All works
        : worksResponse.filter(
            (work) => work.categoryId === parseInt(category)
          );

    // Update the display of works
    displayWorks(filteredWorks);
  });
});

// Login & Logout button management
const loginButton = document.getElementById("login");
const editBtn = document.querySelector(".edit-btn");

if (sessionStorage.getItem("authToken")) {
  loginButton.innerHTML = "logout"; // If the user is logged in, we display the logout button
  editBtn.style.display = "block"; // If the user is logged in, we display the edit button
} else {
  loginButton.innerHTML = "login"; // If the user is not logged in, we display the login button
  editBtn.style.display = "none"; // If the user is not logged in, we hide the edit button
}

loginButton.addEventListener("click", () => {
  if (sessionStorage.getItem("authToken") !== "undefined") {
    sessionStorage.removeItem("authToken"); // We remove the token in order to logout
  }
});

// Modal management
const overlay = document.querySelector(".modal-overlay");
const closeOverlayBtn = document.querySelectorAll(".fa-xmark");
const addNewWorkBtn = document.querySelector(".add-new-work-btn");
const returnBtn = document.querySelector(".fa-arrow-left");

// Open the modal & display the works when clicking on the edit button
editBtn.addEventListener("click", () => {
  document.querySelector(".modal-overlay").style.display = "flex";
  document.querySelector(".gallery-edition-container").style.display = "flex";
  document.querySelector(".new-work-container").style.display = "none";
  displayWorksOnModal(worksResponse);
});

// Close the modal when clicking on the x-mark or the overlay
closeOverlayBtn.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".modal-overlay").style.display = "none";
  });
});

overlay.addEventListener("click", (e) => {
  if (e.target === overlay) {
    document.querySelector(".modal-overlay").style.display = "none";
  }
});

// Display the form when clicking on the add button
addNewWorkBtn.addEventListener("click", () => {
  document.querySelector(".gallery-edition-container").style.display = "none";
  document.querySelector(".new-work-container").style.display = "flex";
  displayCategories(categoriesResponse);
});

// Return to the gallery when clicking on the return button
returnBtn.addEventListener("click", () => {
  document.querySelector(".gallery-edition-container").style.display = "flex";
  document.querySelector(".new-work-container").style.display = "none";
});

// Function to recup data in order to display it in the modal
const displayWorksOnModal = (works) => {
  const modalGallery = document.querySelector(".gallery-edition-works");
  modalGallery.innerHTML = works
    .map((work) => {
      return `<figure>
        <img src="${work.imageUrl}" alt="${work.title}" />
        <i class="fa-solid fa-trash-can"></i>
      </figure>`;
    })
    .join("");
};

const categoryOptions = document.getElementById("category");

// Function to display categories in the form
const displayCategories = (categories) => {
  categoryOptions.innerHTML = categories
    .map((category) => {
      return `<option value="${category.id}">${category.name}</option>`;
    })
    .join("");
};
