// @ts-nocheck
import {
  worksResponse as originalWorksResponse,
  categoriesResponse,
  displayWorks,
} from "./script.js";
let worksResponse = [...originalWorksResponse]; // Copy of the original works

/** Modal management **/
const editBtn = document.querySelector(".edit-btn");
const overlay = document.querySelector(".modal-overlay");
const closeOverlayBtns = document.querySelectorAll(".fa-xmark");
const addNewWorkBtn = document.querySelector(".add-new-work-btn");
const returnBtn = document.querySelector(".fa-arrow-left");
const galleryContainer = document.querySelector(".gallery-edition-container");
const newWorkContainer = document.querySelector(".new-work-container");

// Open the modal and display the gallery
const openModal = () => {
  overlay.style.display = "flex";
  galleryContainer.style.display = "flex";
  newWorkContainer.style.display = "none";
  displayWorksOnModal(worksResponse);
};

// Close the modal
const closeModal = () => {
  overlay.style.display = "none";
};

// Display the add form
const showForm = () => {
  galleryContainer.style.display = "none";
  newWorkContainer.style.display = "flex";
  displayCategories(categoriesResponse);
};

// Return to the edit gallery
const showGallery = () => {
  galleryContainer.style.display = "flex";
  newWorkContainer.style.display = "none";
};

// Event listeners
editBtn.addEventListener("click", openModal);
closeOverlayBtns.forEach((btn) => btn.addEventListener("click", closeModal));
overlay.addEventListener("click", (e) => e.target === overlay && closeModal());
addNewWorkBtn.addEventListener("click", showForm);
returnBtn.addEventListener("click", showGallery);

// Function to recup data in order to display it in the modal
const displayWorksOnModal = (works) => {
  const modalGallery = document.querySelector(".gallery-edition-works");
  modalGallery.innerHTML = works
    .map((work) => {
      return `<figure>
        <img src="${work.imageUrl}" alt="${work.title}" />
        <i class="fa-solid fa-trash-can" data-id="${work.id}"></i>
      </figure>`;
    })
    .join("");

  attachTrashCanListeners();
};

// Function to display categories in the form
const categoryOptions = document.getElementById("category");
const displayCategories = (categories) => {
  categoryOptions.innerHTML = `
    <option selected disabled>Choisir une catégorie</option>
    ${categories
      .map((category) => {
        return `<option value="${category.id}">${category.name}</option>`;
      })
      .join("")}
  `;
};

/*** New work form management ***/
const uploadForm = document.getElementById("upload-new-work");
const uploadBtn = document.getElementById("upload-btn");
const imageUpload = document.getElementById("image-upload");
const titleInput = document.getElementById("title");
const categorySelect = document.getElementById("category");
const submitBtn = document.querySelector(".submit-btn");

// Prevent the form from being submitted
uploadForm.addEventListener("submit", (e) => {
  e.preventDefault();
});

// Open the file explorer when clicking on the upload button
uploadBtn.addEventListener("click", () => {
  imageUpload.click();
});

// Display the image when uploading
imageUpload.addEventListener("change", () => {
  const file = event.target.files[0];
  if (file) {
    uploadBtn.querySelector("i").style.display = "none";
    uploadBtn.querySelector("span").style.display = "none";
    uploadBtn.querySelector("p").style.display = "none";

    const existingImg = uploadBtn.querySelector("img");
    if (existingImg) {
      existingImg.remove();
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "200px";
      img.style.maxHeight = "200px";
      uploadBtn.style.padding = "0";
      uploadBtn.appendChild(img);
    };
    reader.readAsDataURL(file);
  }
});

// Check the form validity
const checkFormValidity = () => {
  if (
    imageUpload.files.length > 0 &&
    titleInput.value.trim() !== "" &&
    categorySelect.value !== "0"
  ) {
    submitBtn.removeAttribute("disabled");
  }
};

// Event listeners to the form fields
imageUpload.addEventListener("change", checkFormValidity);
titleInput.addEventListener("input", checkFormValidity);
categorySelect.addEventListener("change", checkFormValidity);

// Function to delete a work
const deleteWork = async (workId, event) => {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
        Accept: "*/*",
      },
    });

    if (!response.ok) {
      throw new Error(`Error during deletion: ${response.statusText}`);
    }

    // Remove the element from the DOM and update the list
    worksResponse = worksResponse.filter(
      (work) => work.id !== parseInt(workId)
    );
    event.target.parentElement.remove();
    displayWorks(worksResponse);
    displayWorksOnModal(worksResponse);
  } catch (error) {
    console.error("Network error:", error);
  }
};

// Add listeners to the trash can icons
const attachTrashCanListeners = () => {
  document.querySelectorAll(".fa-trash-can").forEach((icon) => {
    icon.addEventListener("click", (event) => {
      const workId = event.target.getAttribute("data-id");
      if (workId) deleteWork(workId, event);
    });
  });
};

// Function to add a new work
const addNewWork = async () => {
  const file = imageUpload.files[0];
  const title = titleInput.value;
  const category = categorySelect.value;

  if (!file || !title || category === "0") {
    console.error("Please fill in all fields.");
    return;
  }

  const formData = new FormData();
  formData.append("image", file);
  formData.append("title", title);
  formData.append("category", category);

  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("authToken")}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const newWork = await response.json();
    worksResponse.push(newWork);
    displayWorks(worksResponse);
    displayWorksOnModal(worksResponse);

    uploadForm.reset(); // Reset the form
    overlay.style.display = "none"; // Close the modal
  } catch (error) {
    console.error("Error during addition:", error);
  }
};

// Add a listener to the submit button
submitBtn.addEventListener("click", addNewWork);
