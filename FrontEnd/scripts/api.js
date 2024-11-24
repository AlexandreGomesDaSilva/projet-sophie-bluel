// Fichier qui centralise le code pour les appels API
const apiUrl = "http://localhost:5678/api";

// Fonction pour récupérer les travaux (renommée pour correspondre à votre code)
async function getWorksFromApi() {
    console.log("Début récupération des travaux");
    try {
        const response = await fetch(`${apiUrl}/works`);
        console.log("Réponse reçue:", response);

        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const works = await response.json();
        console.log("Travaux récupérés:", works);
        return works;

    } catch (error) {
        console.error("Erreur lors de la récupération des travaux:", error);
        return []; // Je retourne un tableau vide en cas d'erreur
    }
}

// Fonction pour récupérer les catégories
async function getCategories() {
    console.log("Début récupération des catégories");
    try {
        const response = await fetch(`${apiUrl}/categories`);
        
        if (!response.ok) {
            throw new Error(`Erreur HTTP: ${response.status}`);
        }

        const categories = await response.json();
        console.log("Catégories récupérées:", categories);
        return categories;

    } catch (error) {
        console.error("Erreur catégories:", error);
        return [];
    }
}

// Fonction pour la connexion utilisateur
async function loginUser(email, password) {
    console.log("Tentative de connexion...");
    try {
        const response = await fetch(`${apiUrl}/users/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        if (!response.ok) {
            throw new Error('Identifiants incorrects');
        }
        
        const data = await response.json();
        console.log("Connexion réussie");
        return data;

    } catch (error) {
        console.error("Erreur connexion:", error);
        throw error;
    }
}

// Fonction pour supprimer un travail
async function deleteWork(workId) {
    console.log("Suppression du travail:", workId);
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch(`${apiUrl}/works/${workId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Erreur suppression');
        }

        console.log("Travail supprimé avec succès");
        return true;

    } catch (error) {
        console.error("Erreur suppression:", error);
        return false;
    }
}

// Fonction pour ajouter un nouveau travail
async function addWork(formData) {
    console.log("Ajout d'un nouveau travail");
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${apiUrl}/works`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData // On utilise FormData pour pouvoir envoyer l'image
        });
        
        if (!response.ok) {
            throw new Error('Erreur ajout projet');
        }
        
        const newWork = await response.json();
        console.log("Nouveau travail ajouté:", newWork);
        return newWork;

    } catch (error) {
        console.error("Erreur lors de l'ajout:", error);
        throw error;
    }
}