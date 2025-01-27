const email = document.getElementById("email");
const password = document.getElementById("password");
const connexion = document.querySelector("form");

// Add sample data to sessionStorage
sessionStorage.setItem("userEmail", "sophie.bluel@test.tld");
sessionStorage.setItem("userPassword", "S0phie");

connexion.addEventListener("submit", (e) => {
  e.preventDefault();

  // Retrieve IDs from sessionStorage
  const storedEmail = sessionStorage.getItem("userEmail");
  const storedPassword = sessionStorage.getItem("userPassword");

  // Remove any existing error messages
  document.querySelectorAll(".error-message").forEach((el) => el.remove());

  // Check if the email field is empty
  if (email.value === "") {
    const wrongEmail = document.createElement("p");
    wrongEmail.textContent = "Please enter your email";
    wrongEmail.style.color = "red";
    wrongEmail.classList.add("error-message");
    email.after(wrongEmail);

    setTimeout(() => {
      wrongEmail.remove(); // Remove the error message after 5 seconds
    }, 5000);
  }

  // Check if the password field is empty
  if (password.value === "") {
    const wrongPassword = document.createElement("p");
    wrongPassword.textContent = "Please enter your password";
    wrongPassword.style.color = "red";
    wrongPassword.classList.add("error-message");
    password.after(wrongPassword);

    setTimeout(() => {
      wrongPassword.remove(); // Remove the error message after 5 seconds
    }, 5000);
  }

  // Check if IDs match those in sessionStorage
  if (email.value !== "" && password.value !== "") {
    if (email.value !== storedEmail || password.value !== storedPassword) {
      const errorMsg = document.createElement("p");
      errorMsg.textContent = "Incorrect email or password";
      errorMsg.style.color = "red";
      errorMsg.classList.add("error-message");
      connexion.after(errorMsg); // Display the error below the form

      setTimeout(() => {
        errorMsg.remove(); // Remove the error message after 5 seconds
      }, 5000);
    } else {
      window.location.href = "index.html"; // Redirect to the home page
    }
  }
});
