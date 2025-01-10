//*********************************************************
// Gestion des données depuis l'API et avec le localStorage
//*********************************************************

// récupération des éventuels works en localStorage
let works = window.localStorage.getItem('works');
// si rien en local on charge sur l'API et on stocke en local
if (works === null) {
    // chargement des données des works sur l'API
    works = await fetch("http://localhost:5678/api/works").then(works=>works.json());
    // Transformation  en JSON
   const jsonWorks = JSON.stringify(works);
   // Stockage des informations dans le localStorage
   window.localStorage.setItem("works", jsonWorks);
}
// si c'est en local on transforme en JSON
else {
    works = JSON.parse(works);
}

//*********************************************************
// Fonction d'affichage des works
//*********************************************************
function affichageWorks(worksFiltres) {
    // récupération de la balise concernée
    const gallery = document.querySelector(".gallery");
    // pour chaque élément du works
    if (worksFiltres === "Tous") {
        worksFiltres = works;
    }
    for (let i = 0 ; i < worksFiltres.length ; i++){
        // on crée les éléments figure img et figcaption
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = worksFiltres[i].imageUrl;
        imageElement.alt = `image ${imageElement.src}`;
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = worksFiltres[i].title;
        // on affiche les éléments
        gallery.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titreElement);
    }
}

//*********************************************************
// Fonction d'affichage des boutons filtres
//*********************************************************
function affichageFiltres(){
    // récupération de la balise concernée
    const portfolio = document.querySelector(".portfolio");
    // on vérifie le nombre de catégories définies
    let categories = works.map(works => works.category.name);
    categories = new Set(categories);
    let nombreCategories = categories.size;
    // on crée les éléments boutonsFiltres
    // création de la balise bouton "tous"
    const boutonTous = document.createElement("button");
    boutonTous.id = "boutonTous";
    boutonTous.innerText = "Tous";
    // récupération de la balise concernée
    const filtres = document.querySelector(".filters");
    // affichage du bouton "tous"
    filtres.appendChild(boutonTous);
    // on récupère le tableau des catégories
    const categoriesTAbleau = Array.from(categories);
    // boutons de chaque catégorie
    for (let i = 0 ; i < nombreCategories ; i++) {
        // création des balises
        const boutonCategorie = document.createElement("button");
        boutonCategorie.id = i+1;
        boutonCategorie.innerText = categoriesTAbleau[i];
        // affichage des boutons filtres
        filtres.appendChild(boutonCategorie);
    }
}

//*********************************************************
// Fonction de filtre des catégories
//*********************************************************
function ecouteBoutonsFiltres(){
    const boutons = document.querySelectorAll(".filters button");
    // pour chaque boutons filtres
    for (const boutonFiltrer of boutons) {
        // on écoute l'évènement
        boutonFiltrer.addEventListener("click", function(event) {
            event.preventDefault();
            // on filtre les works
            const worksFiltres = works.filter(function (work) {
                const categorie = boutonFiltrer.id;
                // si c'est le bouton "Tous" on retourne tous les works
                if (categorie === "boutonTous"){
                    return true;
                }
                // sinon on retourne les works de la catégorie
                else {
                    return work.categoryId === parseInt(categorie);
                }
            });
            // on nettoie la page html et on affiche les works filtrés
            document.querySelector(".gallery").innerHTML = "";
            affichageWorks(worksFiltres);
         });
    }
}

//*********************************************************
// Fonction des boutons li de nav : login ou projets
//*********************************************************
export function ecouteLiBouton(bouton) {
    const liItem = document.getElementById(bouton);
    liItem.addEventListener("click", function(event) {
        event.preventDefault();
        // selon le li cliqué si login on vide la page html
        if (liItem.id === "loginItem") {
            if (liItem.innerText === "login"){
                affichageHeader("login");
                affichageLogin();
            }
            else if (liItem.innerText === "logout") {
                sessionStorage.clear();
                affichageHeader("logout");
                affichageMain();
            }
        }
        else if (liItem.id === "projectsItem") {
            affichageHeader("logout");
            affichageMain();
        }
    });
}

//*********************************************************
// Fonction affichage du formulaire de login
//*********************************************************
function affichageLogin() {
    // on récupère le main
    const main = document.querySelector("main");
    // on crée le formulaire
    const formulaire = document.createElement("form");
    formulaire.id = "loginForm";
    formulaire.action = "";
    formulaire.method = "POST";
    // avec le fieldset, legend, labels, inputs, et button valider
    const fieldset = document.createElement("fieldset");

    const legend = document.createElement("legend");
    legend.innerText = "Log In";

    const labelEmail = document.createElement("label");
    labelEmail.setAttribute("for", "email");
    labelEmail.innerText = "E-mail";

    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "connexionEmail";
    inputEmail.required = true;

    const labelPassword = document.createElement("label");
    labelPassword.setAttribute("for", "password");
    labelPassword.innerText = "Mot de passe";

    const inputPassword = document.createElement("input");
    inputPassword.type = "password";
    inputPassword.id = "connexionPassword";
    inputPassword.required = true;

    const submitButton = document.createElement("input");
    submitButton.type = "submit";
    submitButton.value = "Se connecter";
    submitButton.id = "connexion"

    const mdpoublie = document.createElement("a");
    mdpoublie.href = "#";
    mdpoublie.innerText = "Mot de passe oublié";
    // on affiche toutes les balises
    document.querySelector("main").innerHTML = "";
    fieldset.appendChild(legend);
    fieldset.appendChild(labelEmail);
    fieldset.appendChild(inputEmail);
    fieldset.appendChild(labelPassword);
    fieldset.appendChild(inputPassword);
    formulaire.appendChild(fieldset);
    formulaire.appendChild(submitButton);
    formulaire.appendChild(mdpoublie);
    main.appendChild(formulaire);
    // on écoute la tentative de connexion
    connexion();
}

//*********************************************************
// Fonction tentative de connexion
//*********************************************************
function connexion() {
    document.getElementById("connexion").addEventListener("click", async function(event) {
        event.preventDefault();
        // récupération des valeurs du formulaire
        const email = document.getElementById("connexionEmail").value;
        const password = document.getElementById("connexionPassword").value;
        // on crée une balise pour afficher la validation ou non de la connexion
        const formulaire = document.getElementById("loginForm");
        const validationErreur = document.createElement("p");
        validationErreur.id = "reponseMessage";
        formulaire.appendChild(validationErreur);
        // si les champs sont vides on demande à les remplir, le mail doit ressembler à un mail
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email === "") {
            document.getElementById("reponseMessage").innerText = "le champ \"email\" doit être renseigné";
        }
        else if (!regex.test(email)){
            document.getElementById("reponseMessage").innerText = "le champ \"email\" n'est pas valide";
        }
        else if (password === "") {
            document.getElementById("reponseMessage").innerText = "le champ \"mot de passe\" doit être renseigné";
        }
        // sinon on fait la requête
        else {
            // construction de la requête
            const requeteBody = {
                email: email,
                password: password
            };
            // on test
            try {
                // on récupère les données sur l'API
                const reponse = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requeteBody)
                });
                // on transforme les données en JSON
                const donnees = await reponse.json();
                // si la réponse est OK
                if (reponse.ok) {
                    // on enregistre le token en sessionStorage
                    sessionStorage.setItem("authToken", donnees.token);
                    // on affiche la page complète
                    affichageHeader();
                    affichageMain();
                }
                // si la réponse n'est pas OK
                else {
                    if (donnees.message === undefined) {
                        document.getElementById("reponseMessage").innerText = "Echec de la connexion : Connexion non autorisée";
                    }
                    else {
                        if (donnees.message === "user not found"){
                            document.getElementById("reponseMessage").innerText = "Echec de la connexion : Utilisateur inconnu";
                        }
                    }
                }
            // si le test renvoie une erreur
            } catch (erreur) {
                // gestion des erreurs réseau ou autres
                document.getElementById("reponseMessage").innerText = "Erreur : " + erreur.message;
            }
        }          
    });
}

//*********************************************************
// Fonction affichage du header
//*********************************************************
export function affichageHeader(loginStatus) {
    // on récupère l'état de connexion grace au token et au texte contenu dans loginItem
    const loginElement = document.getElementById("loginItem");
    const token = verifierToken();
    // on prépare les éléments pour le mode édition
    const editionElement = document.createElement("div");
    editionElement.classList.add("edition");
    const contenuHeader = document.createElement("div");
    contenuHeader.id = "contenuHeader";
    // on modifie le header
    const headerListe = document.getElementById("listeBoutons");
    headerListe.innerHTML = "";
    // si connecté
    if (token !== false) {
        // on affiche le logout
        loginElement.innerText = "logout";
        // on crée les balises du mode édition
        editionElement.classList.add("editionVisible");
        const editionIElement = document.createElement("i");
        editionIElement.classList.add("fa-solid", "fa-pen-to-square");
        const editionTexteElement = document.createElement("p");
        editionTexteElement.innerText = "Mode édition";
        editionElement.appendChild(editionIElement);
        editionElement.appendChild(editionTexteElement);
    }
    // si non connecté
    else {
        // on cache le mode édition
        editionElement.classList.remove("editionVisible");
        // on affiche login
        loginElement.innerText = "login";

    }
    // si page de login, login en gras
    if (loginStatus === "login") {
        loginElement.classList.add("boldElement");
    }
    // sinon pas en gras
    else {
        loginElement.classList.remove("boldElement");
    }
    // on ajoute les éléments
    const h1 = document.createElement("h1");
    h1.innerHTML = "Sophie Bluel <span>Architecte d'intérieur</span>";
    const navigateur =  document.createElement("nav");
    const projectsElement= document.createElement ("li");
    projectsElement.id = "projectsItem";
    projectsElement.innerText = "projets";
    const contactElement = document.createElement ("li");
    contactElement.innerText = "contact";
    const imageElement = document.createElement ("li");
    const image = document.createElement ("img");
    image.src = "./assets/icons/instagram.png";
    image.alt = "Instagram";
    // on affiche les éléments
    imageElement.appendChild(image);
    headerListe.appendChild(projectsElement);
    headerListe.appendChild(contactElement);
    headerListe.appendChild(loginElement);
    headerListe.appendChild(imageElement);
    navigateur.appendChild(headerListe);
    // on construit le header
    const header = document.querySelector("header");
    header.innerHTML = "";
    if (editionElement !== null) {
        header.appendChild(editionElement);
    }
    contenuHeader.appendChild(h1);
    contenuHeader.appendChild(navigateur);
    header.appendChild(contenuHeader);
    // on écoute le bouton vers projets
    ecouteLiBouton("projectsItem");
}

//*********************************************************
// Fonction affichage du main
//*********************************************************
export function affichageMain() {
    // on balance le contenu de la page de base
    document.querySelector("main").innerHTML = `<section id="introduction">
			<figure>
				<img src="./assets/images/sophie-bluel.png" alt="">
			</figure>
			<article>
				<h2>Designer d'espace</h2>
				<p>Je raconte votre histoire, je valorise vos idées. Je vous accompagne de la conception à la livraison finale du chantier.</p>
				<p>Chaque projet sera étudié en commun, de façon à mettre en valeur les volumes, les matières et les couleurs dans le respect de l’esprit des lieux et le choix adapté des matériaux. Le suivi du chantier sera assuré dans le souci du détail, le respect du planning et du budget.</p>
				<p>En cas de besoin, une équipe pluridisciplinaire peut-être constituée : architecte DPLG, décorateur(trice)</p>
			</article>
		</section>
		<section id="portfolio">
			<div>
                <h2>Mes Projets</h2>
                <div id="modifier">
                </div>
            </div>
			<div class="filters">
			</div>
			<div class="gallery">
			</div>
		</section>
		<section id="contact">
			<h2>Contact</h2>
			<p>Vous avez un projet ? Discutons-en !</p>
			<form action="#" method="post">
				<label for="name">Nom</label>
				<input type="text" name="name" id="name">
				<label for="email">Email</label>
				<input type="email" name="email" id="email">
				<label for="message">Message</label>
				<textarea name="message" id="message" cols="30" rows="10"></textarea>
				<input type="submit" value="Envoyer">
			</form>
		</section>
    `;
    // selon la connexion
    const token = verifierToken();
    const mesProjetElement = document.querySelector(".gallery");
    const modifierElement = document.getElementById("modifier");
    // si non connecté
    if (token === false) {
        // on affiche et écoute les boutons filtres
        affichageFiltres();
        mesProjetElement.classList.remove("margin");
        modifierElement.classList.remove("modifierVisible");
        ecouteBoutonsFiltres();
    }
    // si connecté
    else {
        // on affiche et écoute le bouton modifier
        modifierElement.classList.add("modifierVisible");
        const modifierIElement = document.createElement("i");
        modifierIElement.classList.add("fa-solid", "fa-pen-to-square");
        const modifierTexteElement = document.createElement("p");
        modifierTexteElement.innerText = "modifier";
        modifierElement.appendChild(modifierIElement);
        modifierElement.appendChild(modifierTexteElement);
        ecouteModifierBouton();
        mesProjetElement.classList.add("margin");
    }
    // on affiche les works
    affichageWorks("Tous");
}

//*********************************************************
// Fonction écouter le bouton modifier
//*********************************************************
function ecouteModifierBouton() {
    const modifier = document.getElementById("modifier");
    modifier.addEventListener("click", function(event) {
        event.preventDefault();
        // si la modale n'existe pas on la construit
        if (!document.querySelector('#modale')) {
            construireModale();
            ecouteQuitterModale();
        }
        // on affiche la modale
        modale.classList.add("modaleFlex");
        modale.classList.remove("modaleNone");
        // et on écoute quand on la quitte
    });
}

//*********************************************************
// Fonction écouter pour quitter la modale
//*********************************************************
function ecouteQuitterModale() {
    const croixElement = document.getElementById("croixModale");
    const modaleElement = document.getElementById("modale");
    document.addEventListener('click', (event) => {
        event.preventDefault();
        console.log(event.target.id);
        if (event.target.id === croixElement.id || event.target.id === modaleElement.id) {
            modale.classList.remove("modaleFlex");
            modale.classList.add("modaleNone");
        }
    });
}

//*********************************************************
// Fonction construire la modale
//*********************************************************
function construireModale() {
    // création de la modale
    const modale = document.createElement("aside");
    modale.id = "modale";
    modale.setAttribute("aria-hidden", "true");
    modale.role = "dialog";
    modale.setAttribute("aria-modal", "false");
    modale.setAttribute("aria-labbelledby", "titreModal");
    // la croix pour quitter la modale
    const croix = document.createElement("div");
    croix.id = "croixModale";
    const croixQuitter = document.createElement("i");
    croixQuitter.classList.add("fa-solid", "fa-xmark");
    croix.appendChild(croixQuitter);
    // le titre de la modale
    const titre = document.createElement("h1");
    titre.id = "titreModal";
    titre.innerText = "Galerie photo";
    // l'élément de la modale
    const fenetreModaleElement = document.createElement("div");
    fenetreModaleElement.id = "fenetreModale";
    fenetreModaleElement.appendChild(croix);
    fenetreModaleElement.appendChild(titre);
    // la liste des works
    const modaleListe = document.createElement("div");
    modaleListe.id = "modaleListe";
    // pour chaque work on va afficher son image et un logo de poubelle pour la supprimer
    for (let work of works){
        // création des balises 
        const divElement = document.createElement("div");
        divElement.id = "fiche";
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const poubelle = document.createElement("i");
        poubelle.classList.add("fa-solid", "fa-trash-can");
        // encrage des balises dans la modale
        divElement.appendChild(imageElement);
        divElement.appendChild(poubelle);
        modaleListe.appendChild(divElement);
    }
    // création du bouton ajouter un work
    const boutonAjout = document.createElement("button");
    boutonAjout.id = "boutonAjout";
    boutonAjout.innerText = "Ajouter une photo";

    // on affiche la modale
    fenetreModaleElement.appendChild(modaleListe);
    fenetreModaleElement.appendChild(boutonAjout);
    const main = document.querySelector("body");
    modale.appendChild(fenetreModaleElement);
    main.appendChild(modale);
}

//*********************************************************
// Fonction vérifier le token
//*********************************************************
function verifierToken(token) {
    const tokenVerifie = sessionStorage.getItem("authToken");
    if (tokenVerifie !== null) {
        return tokenVerifie;
    }
    else {
        return false;
    }
}