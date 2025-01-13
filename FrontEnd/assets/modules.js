//*********************************************************
//*********************************************************
//  gestion des works de l'architecte et de leurs filtres


//*********************************************************
// Fonction de récupération des works de l'architecte
async function fetchWorks() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const works = await reponse.json();
        return works;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

//*********************************************************
// Fonction d'affichage des works
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
// Fonction d'extraction des catégories
function extraitCategories() {
    let categories = new Array();
    for (let i = 0 ; i < works.length ; i++) {
        let categorie = works[i].category.name;
        categories.push(categorie);
    }
    categories = [...new Set(categories)];
    return categories;
}

//*********************************************************
// Fonction d'affichage des boutons filtres
function affichageFiltres(){
    // const portfolio = document.querySelector(".portfolio");
    // on vérifie le nombre de catégories définies
    // Extrait les catégories
    const categories = extraitCategories();
    const nombreCategories = categories.length;
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
// Fonction d'écoute des boutons filtres des catégories
function ecouteBoutonsFiltres(){
    const boutons = document.querySelectorAll(".filters button");
    // pour chaque boutons filtres
    for (const boutonFiltrer of boutons) {
        // on écoute l'évènement
        boutonFiltrer.addEventListener("click", function() {
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
//*********************************************************
//  gestion des boutons du navigateur


//*********************************************************
// Fonction d'écoute des boutons li de nav : login ou projets
function ecouteLiBouton(bouton) {
    const liItem = document.getElementById(bouton);
    const boutonLogin = document.getElementById("loginItem");
    liItem.addEventListener("click", function() {
        // selon le li cliqué
        if (liItem.id === "loginItem") {
            // si le li est le bouton pour se login
            if (liItem.innerText === "login"){
                boutonLogin.classList.add("boldElement");
                affichageLogin();
            }
            // sinon (si c'est le bouton pour se logout)
            else {
                const editionElement = document.querySelector(".edition");
                editionElement.classList.remove("editionVisible");
                boutonLogin.classList.remove("boldElement");
                boutonLogin.innerText = "login";
                sessionStorage.clear();
                affichageMain();
            }
        }
        // sinon si c'est le bouton vers les projets
        else if (liItem.id === "projectsItem") {
            boutonLogin.classList.remove("boldElement");
            affichageMain();
        }
        else {}
    });
}


//*********************************************************
//*********************************************************
//  gestion de la connexion


//*********************************************************
// Fonction affichage du formulaire de login
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
// Fonction d'écoute de tentative de connexion
function connexion() {
    document.getElementById("connexion").addEventListener("click", async function(event) {
        event.preventDefault();
        // récupération des valeurs du formulaire
        const email = document.getElementById("connexionEmail").value;
        const password = document.getElementById("connexionPassword").value;
        // on crée une balise pour afficher la non-validation de la connexion
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
                    // on affiche la page complète avec le mode edition
                    const boutonLogin = document.getElementById("loginItem");
                    boutonLogin.classList.remove("boldElement");
                    boutonLogin.innerText = "logout";
                    const editionElement = document.getElementById("edition");
                    editionElement.classList.add("editionVisible");
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
//*********************************************************
//  gestion de l'affichage des pages


//*********************************************************
// Fonction affichage du header
function affichageHeader() {
    // on récupère l'état de connexion grace au token
    const token = verifierToken();
    // on initialise le header
    const header = document.querySelector("header");
    header.innerHTML = "";
    // on prépare les éléments pour le mode édition
    const editionElement = document.createElement("div");
    editionElement.id = "edition";
    editionElement.classList.add("edition");
    const editionIElement = document.createElement("i");
    editionIElement.classList.add("fa-solid", "fa-pen-to-square");
    const editionTexteElement = document.createElement("p");
    editionTexteElement.innerText = "Mode édition";
    editionElement.appendChild(editionIElement);
    editionElement.appendChild(editionTexteElement);
    // on prépare le contenu (en plus du mode édition) du header
    const contenuHeader = document.createElement("div");
    contenuHeader.id = "contenuHeader";
    // on modifie le header
    const headerListe = document.createElement("ul");
    headerListe.id = "listeBoutons";
    // on ajoute tous les éléments
    const h1 = document.createElement("h1");
    h1.innerHTML = "Sophie Bluel <span>Architecte d'intérieur</span>";
    const navigateur =  document.createElement("nav");
    const projectsElement= document.createElement ("li");
    projectsElement.id = "projectsItem";
    projectsElement.innerText = "projets";
    const contactElement = document.createElement ("li");
    contactElement.innerText = "contact";
    const loginElement = document.createElement("li");
    loginElement.id = "loginItem";
    const imageElement = document.createElement ("li");
    const image = document.createElement ("img");
    image.src = "./assets/icons/instagram.png";
    image.alt = "Instagram";
    // on affiche les éléments
    header.appendChild(editionElement);
    if (token !== false) {
        editionElement.classList.add("editionVisible");
        loginElement.innerText = "logout";
    }
    else {
        loginElement.innerText = "login";
    }
    imageElement.appendChild(image);
    headerListe.appendChild(projectsElement);
    headerListe.appendChild(contactElement);
    headerListe.appendChild(loginElement);
    headerListe.appendChild(imageElement);
    navigateur.appendChild(headerListe);
    contenuHeader.appendChild(h1);
    contenuHeader.appendChild(navigateur);
    // on construit le header
    header.appendChild(contenuHeader);
    // on écoute les boutons
    ecouteLiBouton("projectsItem");
    ecouteLiBouton("loginItem");
}

//*********************************************************
// Fonction affichage du main
function affichageMain() {
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
                <div id="modifier" class="modifier">
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
//*********************************************************
//  gestion de la modale


//*********************************************************
// Fonction d'écoute du bouton modifier vers modale
function ecouteModifierBouton() {
    const modifier = document.getElementById("modifier");
    modifier.addEventListener("click", function() {
        // on affiche la modale
        modale.classList.add("flex");
        // avec les éléments de base seulement
        retourModale();
    });
}

//*********************************************************
// Fonction d'écoute pour quitter la modale / ou retour en arrière
function ecouteQuitterModale() {
    const croixElement = document.getElementById("croixModaleI");
    const modaleElement = document.getElementById("modale");
    const retourElement = document.getElementById("retourModaleI");
    document.addEventListener("click", (event) => {
        if (event.target.id === croixElement.id || event.target.id === modaleElement.id) {
            modale.classList.remove("flex");
        }
        else if (event.target.id === retourElement.id) {
            retourModale();
        }
    });
}

//*********************************************************
// Fonction de remise en forme de la modale / réinitialisation de l'affichage
function retourModale() {
    document.getElementById("titreModale").innerText = "Galerie photo";
    document.getElementById("retourModaleI").classList.remove("flex");
    document.getElementById("modalForm").classList.remove("flex");
    document.getElementById("boutonsModale").classList.remove("boutonModale2");
    document.getElementById("modaleListe").classList.add("flex");
    document.getElementById("boutonAjout").classList.add("flex");
    document.getElementById("fileImage").classList.add("flex");
    document.getElementById("fileTexte").classList.add("flex");
    document.getElementById("fileBouton").classList.add("flex");
    document.getElementById("imageEnvoyee").src = "";
    document.getElementById("imageEnvoyee").alt = "";
    document.getElementById("imageEnvoyee").classList.remove("flex");
}

//*********************************************************
// Fonction pour construire la modale "galerie photo" et "ajouter photo"
function construireModale() {
    // création de la modale
    const modale = document.createElement("aside");
    modale.id = "modale";
    // modale.setAttribute("aria-hidden", "true");
    modale.role = "dialog";
    modale.setAttribute("aria-modal", "false");
    modale.setAttribute("aria-labbelledby", "titreModale");
    // les boutons en haut de la modale
    const boutonsModale = document.createElement("div");
    boutonsModale.id = "boutonsModale";
    // on crée un bouton retour qu'on n'affiche pas
    const retourI = document.createElement("i");
    retourI.id = "retourModaleI";
    retourI.classList.add("fa-solid", "fa-arrow-left");
    boutonsModale.appendChild(retourI);
    retourI.classList.add("none");
    boutonsModale.classList.add("boutonModale");
    // la croix pour quitter la modale
    const croixQuitter = document.createElement("i");
    croixQuitter.id = "croixModaleI";
    croixQuitter.classList.add("fa-solid", "fa-xmark");
    boutonsModale.appendChild(croixQuitter);
    // le titre de la modale
    const titre = document.createElement("h1");
    titre.id = "titreModale";
    titre.innerText = "Galerie photo";
    // l'élément de la modale de base
    const fenetreModaleElement = document.createElement("div");
    fenetreModaleElement.id = "fenetreModale";
    fenetreModaleElement.appendChild(boutonsModale);
    fenetreModaleElement.appendChild(titre);
    // la liste des works
    const modaleListe = document.createElement("div");
    modaleListe.id = "modaleListe";
    modaleListe.classList.add("none", "flex");
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
    // on ajoute le formulaire d'ajout qu'on n'affiche pas
    const modaleFormulaire = document.createElement("form");
    modaleFormulaire.id = "modalForm";
    modaleFormulaire.classList.add("none");
    // dans le formulaire : le file
    const fileLabel = document.createElement("div");
    fileLabel.id = "fileLabel";
    const fileImage = document.createElement("i");
    fileImage.id = "fileImage";
    fileImage.classList.add("fa-regular", "fa-image");
    fileImage.classList.add("none", "flex");
    const fileBouton = document.createElement("button");
    fileBouton.id = "fileBouton";
    fileBouton.innerText = "+ Ajouter photo";
    fileBouton.type = "submit";
    fileBouton.classList.add("none", "flex");
    const fileTexte = document.createElement("p");
    fileTexte.id = "fileTexte";
    fileTexte.innerText = "jpg, png : 4mo max";
    fileTexte.classList.add("none", "flex");
    fileLabel.appendChild(fileImage);
    fileLabel.appendChild(fileBouton);
    fileLabel.appendChild(fileTexte);
    const fileInput = document.createElement("input");
    fileInput.id = "fileInput";
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png";
    fileInput.required = true;
    fileInput.style.display = "none";
    // dans le formulaire : le titre de l'image
    const titreLabel = document.createElement("label");
    titreLabel.htmlFor = "titreInput";
    titreLabel.innerText = "Titre";
    const titreInput = document.createElement("input");
    titreInput.id = "titreInput";
    titreInput.type = "text";
    titreInput.required = true;
    // dans le formulaire : la catégorie de l'image
    const categorieLabel = document.createElement("label");
    categorieLabel.htmlFor = "categorieInput";
    categorieLabel.innerText = "Catégorie";
    const categorieInput = document.createElement("select");
    categorieInput.id = "categorieInput";
    categorieInput.required = true;
    // on récupère les catégories
    const categories = extraitCategories();
    // dans le formulaire : dans les catégories les options
    const categorieForm = document.createElement("option");
    categorieForm.value = "";
    categorieForm.innerText = "";
    categorieInput.appendChild(categorieForm);
    for (let categorie of categories) {
        const categorieFormulaire = document.createElement("option");
        categorieFormulaire.value = categorie;
        categorieFormulaire.innerText = categorie;
        categorieInput.appendChild(categorieFormulaire);
    }
    // dans le formulaire : le bouton
    const boutonForm = document.createElement("button");
    boutonForm.id = "boutonValider";
    boutonForm.type = "submit";
    boutonForm.innerText = "Valider";
    // dans le formulaire : l'image envoyée
    const imageEnvoyee = document.createElement("img");
    imageEnvoyee.id = "imageEnvoyee";
    imageEnvoyee.classList.add("none");
    fileLabel.appendChild(imageEnvoyee);
    // on construit le formulaire
    modaleFormulaire.appendChild(fileLabel);
    modaleFormulaire.appendChild(fileInput);
    modaleFormulaire.appendChild(titreLabel);
    modaleFormulaire.appendChild(titreInput);
    modaleFormulaire.appendChild(categorieLabel);
    modaleFormulaire.appendChild(categorieInput);
    modaleFormulaire.appendChild(boutonForm);
    // création du bouton ajouter un work
    const boutonAjout = document.createElement("button");
    boutonAjout.id = "boutonAjout";
    boutonAjout.innerText = "Ajouter une photo";
    boutonAjout.classList.add("none", "flex");
    // on met la modale dans le main
    fenetreModaleElement.appendChild(modaleListe);
    fenetreModaleElement.appendChild(modaleFormulaire);
    fenetreModaleElement.appendChild(boutonAjout);
    const main = document.querySelector("body");
    modale.appendChild(fenetreModaleElement);
    main.appendChild(modale);
    // on cache la modale
    modale.classList.add("none");
    ecouteAjoutImage();
    ecouteQuitterModale();
    ecouteAjout();
}

//*********************************************************
// Fonction bouton ajout image
function ecouteAjoutImage() {
    const fileBouton = document.getElementById("fileBouton");
    const fileInput = document.getElementById("fileInput");
    const fileImage = document.getElementById("fileImage");
    const fileTexte = document.getElementById("fileTexte");
    const imageEnvoyee = document.getElementById("imageEnvoyee");
    fileBouton.addEventListener("click", function(event) {
        event.preventDefault();
        fileInput.click();
        fileInput.addEventListener("change", function() {
            // on récupère le fichier sélectionné
            const file = this.files[0];
            if (file) {
                fileImage.classList.remove("flex");
                fileTexte.classList.remove("flex");
                fileBouton.classList.remove("flex");
                // on crée un objet FileReader
                const reader = new FileReader();
                // s'exécute une fois que le fichier est lu
                reader.onload = function(e) {
                    // on met à jour la source de l'image avec l'image choisie
                    imageEnvoyee.src = e.target.result;
                    // on ajoute le nom du fichier à l'attribut alt
                    imageEnvoyee.alt = file.name;
                };
                // on lit l'image sous forme de Data URL (binaire codé en base64)
                reader.readAsDataURL(file);
                imageEnvoyee.classList.add("flex");
                // on réinitialise la valeur de fileImput pour détecter à nouveau le changement
                fileInput.value = "";
            } else {
            }
        });
    });
}

//*********************************************************
// Fonction écoute du bouton Ajout
function ecouteAjout(){
    const ajoutElement = document.getElementById("boutonAjout");
    ajoutElement.addEventListener('click', () => {
        // on réaffiche la modale différemment
        document.getElementById("titreModale").innerText = "Ajout photo";
        document.getElementById("retourModaleI").classList.add("flex");
        document.getElementById("modalForm").classList.add("flex");
        document.getElementById("boutonsModale").classList.add("boutonModale2");
        document.getElementById("modaleListe").classList.remove("flex");
        document.getElementById("boutonAjout").classList.remove("flex");
    });
}


//*********************************************************
//*********************************************************
//  gestion du token


//*********************************************************
// Fonction vérifier le token
function verifierToken(token) {
    const tokenVerifie = sessionStorage.getItem("authToken");
    if (tokenVerifie !== null) {
        return tokenVerifie;
    }
    else {
        return false;
    }
}