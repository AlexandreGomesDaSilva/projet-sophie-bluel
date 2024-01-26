

//EventListener du login
let login = document.querySelector("#loginForm");
login.addEventListener("submit", (event) =>{
    event.preventDefault();
    loginGestion();
});

// Gestion du login
async function loginGestion() {
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    // Envoi des id avec la fonction fetch
    const reponse = await fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    });
    const dataReponse = await reponse.json();
    console.log(reponse.ok);
    if (reponse.ok){
        //  
        //
        // Enregistrer le token !!! S'en servir ensuite pour faire apparaitre le bouton modifier !!!
        // 
        //
        document.location.href="index.html";
    }else{
        messageErreur();
    }
    console.log(dataReponse);
}
            
  


// Affichage d'un message d'erreur (une seule fois)
function messageErreur() {
    let spanErreurMessage = document.getElementById("erreurMessage");
    if (!spanErreurMessage){
        let popup = document.querySelector("#login form");
        spanErreurMessage = document.createElement("p");
        spanErreurMessage.id = "erreurMessage";
        popup.prepend(spanErreurMessage);
    }
    spanErreurMessage.innerText = "L'email ou le mot de passe n'est pas valide.";
}



// a lancer dans photos si token ok !!!

export function ajouterBouton(){
    let boutonModifier = document.querySelector(".gallery h2");
    //boutonModifier = document.createElement("p");
    boutonModifier.innerHTML="Modifier";
    console.log("fonction ok");
}










//email: sophie.bluel@test.tld
//password: S0phie 