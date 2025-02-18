// @ts-nocheck
// Loading jobs and categories
const works = await fetch("http://localhost:5678/api/works");
const categories = await fetch("http://localhost:5678/api/categories");
export let worksResponse = await works.json();
export const categoriesResponse = await categories.json();

// Select navigation links
const projectsLink = document.querySelector("#portfolio-navigation");
const contactLink = document.querySelector("#contact-navigation");

// Function for smooth scrolling
const smoothScroll = (targetId) => {
  const targetElement = document.querySelector(targetId);
  if (targetElement) {
    targetElement.scrollIntoView({
      behavior: "smooth", // Smooth scrolling
      block: "start", // Align to the top of the section
    });
  }
};

// Add event listeners
projectsLink.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default behavior
  smoothScroll("#portfolio");
});

contactLink.addEventListener("click", (e) => {
  e.preventDefault(); // Prevent default behavior
  smoothScroll("#contact");
});

// Function to display works on the main page
export const displayWorks = (works) => {
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

displayWorks(worksResponse);

// Generating filter buttons on the main page
const filters = document.querySelector(".filters");
filters.innerHTML = `
  <button data-category="all" class="active">Tous</button>
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

    // Remove 'active' class from all buttons
    buttons.forEach((btn) => btn.classList.remove("active"));

    // Add 'active' class to the clicked button
    event.target.classList.add("active");

    // Filter the works
    const filteredWorks =
      category === "all"
        ? worksResponse // All works
        : worksResponse.filter(
            (work) => work.categoryId === parseInt(category) // Works of a specific category
          );

    // Update the display of works
    displayWorks(filteredWorks);
  });
});

/* Login & Logout button management */
const loginButton = document.getElementById("login");
const editBtn = document.querySelector(".edit-btn");

const updateUI = () => {
  const isLoggedIn = sessionStorage.getItem("authToken");
  loginButton.textContent = isLoggedIn ? "logout" : "login";
  editBtn.style.display = isLoggedIn ? "block" : "none";
};

const logout = () => {
  sessionStorage.removeItem("authToken");
  updateUI();
};

loginButton.addEventListener("click", () => {
  if (sessionStorage.getItem("authToken")) {
    logout();
  }
});

// Initialize the UI according to the user's connection status
updateUI();
