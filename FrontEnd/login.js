// @ts-nocheck
const email = document.getElementById("email");
const password = document.getElementById("password");
const connexion = document.querySelector("form");

// Function to create and display error messages
function displayErrorMessage(element, message) {
  const errorMsg = document.createElement("p");
  errorMsg.textContent = message;
  errorMsg.style.color = "red";
  errorMsg.classList.add("error-message");
  element.after(errorMsg);
}

connexion.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Remove any existing error messages
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  // Validate inputs
  let hasError = false;
  if (email.value === "") {
    displayErrorMessage(email, "Please enter your email");
    hasError = true;
  }

  if (password.value === "") {
    displayErrorMessage(password, "Please enter your password");
    hasError = true;
  }

  if (hasError) {
    return; // Stop the function if there are validation errors
  }

  // Send login request to the API
  const loginUrl = "http://localhost:5678/api/users/login";
  const requestBody = {
    email: email.value,
    password: password.value,
  };

  try {
    const response = await fetch(loginUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (response.status === 200) {
      const data = await response.json();

      // Store the token in sessionStorage
      if (typeof data.token !== "undefined" && data.token !== "") {
        sessionStorage.setItem("authToken", data.token);
      }

      // Redirect to another page
      window.location.href = "./index.html";
    } else if (response.status === 401 || response.status === 404) {
      // Unauthorized: Invalid IDs
      displayErrorMessage(connexion, "Invalid email or password");
    } else {
      // Handle other errors
      displayErrorMessage(
        connexion,
        "An error occurred. Please try again later."
      );
    }
  } catch (error) {
    console.error("Error:", error);
    displayErrorMessage(
      connexion,
      "Unable to connect to the server. Please try again later."
    );
  }
});
