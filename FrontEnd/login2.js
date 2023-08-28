// Factory pour créer une fonction de récupération de valeur d'élément DOM
function createDOMValueGetter(selector) {
  return function () {
    const element = document.querySelector(selector);
    return element ? element.value : null;
  };
}

// Factory pour la requête HTTP
function createAPIPostRequest(url) {
  return async function (body) {
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      return { data, status: response.status };
    } catch (error) {
      console.error("Une erreur est survenue", error);
      return null;
    }
  };
}

// Gestion de la soumission du formulaire
async function handleFormSubmission(event) {
  event.preventDefault();

  const getEmail = createDOMValueGetter("#login-email");
  const getPassword = createDOMValueGetter("#login-password");
  const loginUser = createAPIPostRequest(
    "http://localhost:5678/api/users/login"
  );

  const email = getEmail();
  const password = getPassword();
  const response = await loginUser({ email, password });

  if (response && response.status === 200) {
    localStorage.setItem("user", JSON.stringify(response.data.userId));
    localStorage.setItem("token", response.data.token);
    location.href = "index.html";
  } else {
    const errorMessageElement = document.getElementById("error-message");
    errorMessageElement.textContent = "Identifiant ou mot de passe incorrect";
  }
}

// Vérifier l'état de connexion de l'utilisateur
function checkTokenLogin() {
  const tokenAuth = localStorage.getItem("token");
  const loginLink = document.getElementById("login-link");

  loginLink.textContent = tokenAuth ? "logout" : "login";
}

// Ajout de l'écouteur d'événements pour la soumission du formulaire
function initLoginForm() {
  const form = document.getElementById("login");
  form.addEventListener("submit", handleFormSubmission);
}

// Vérification de l'état de connexion à l'initialisation
export { checkTokenLogin, initLoginForm };
