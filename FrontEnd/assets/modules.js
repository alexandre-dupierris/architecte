//*********************************************************
//*********************************************************
//  gestion des works de l'architecte et de leurs filtres


//*********************************************************
// Fonction de récupération des works via l'API
async function fetchWorks() {
    try {
        const reponse = await fetch("http://localhost:5678/api/works");
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP : ${reponse.status}`);
        }
        const works = await reponse.json();
        const worksSimples = traitementWorks(works, null);
        return worksSimples;
    } catch (error) {
        console.error("Erreur lors de la récupération des données :", error);
    }
}

//*********************************************************
// Fonction de traitement des works
function traitementWorks(works, nouvelleImage){
    let worksSimples = [];
    for (let i = 0 ; i < works.length ; i++) {
        worksSimples[i] = {
            "id": works[i].id,
            "imageUrl": works[i].imageUrl,
            "title": works[i].title,
            "category": works[i].category,
        }
    }
    if (nouvelleImage !== null) {
        worksSimples.push( {
            "id": nouvelleImage.id,
            "imageUrl": nouvelleImage.imageUrl,
            "title": nouvelleImage.title,
            "category": nouvelleImage.category
        });
    }
    return worksSimples;
}

//*********************************************************
// Fonction d'affichage des works
function affichageWorks(worksFiltres) {
    // récupération de la balise concernée
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
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
// Fonction d'extraction des catégories par nom
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
        boutonCategorie.id = `filtreCategorie${i+1}`;
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
                    return work.category.id === parseInt(categorie.replace(/[a-zA-Z]/g, ''));
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
    // const modale = document.getElementById("modale");
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
    document.addEventListener("click", function(event) {
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
    document.getElementById("divI").classList.remove("flex");
    document.getElementById("modalForm").classList.remove("flex");
    document.getElementById("boutonsModale").classList.remove("boutonModale2");
    document.getElementById("modaleListe").classList.add("flex");
    document.getElementById("boutonAjout").classList.add("flex");
    document.getElementById("fileElement").classList.add("flex");
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
    modale.setAttribute("aria-hidden", "true");
    modale.role = "dialog";
    modale.setAttribute("aria-modal", "false");
    modale.setAttribute("aria-labbelledby", "titreModale");
    // les boutons en haut de la modale
    const boutonsModale = document.createElement("div");
    boutonsModale.id = "boutonsModale";
    // on crée un bouton retour qu'on n'affiche pas
    const divI = document.createElement("div");
    divI.id = "divI";
    divI.classList.add("none");
    const retourI = document.createElement("i");
    retourI.id = "retourModaleI";
    retourI.classList.add("fa-solid", "fa-arrow-left");
    divI.appendChild(retourI);
    boutonsModale.appendChild(divI);
    boutonsModale.classList.add("boutonModale");
    // la croix pour quitter la modale
    const divI2 = document.createElement("div");
    const croixQuitter = document.createElement("i");
    croixQuitter.id = "croixModaleI";
    croixQuitter.classList.add("fa-solid", "fa-xmark");
    divI2.appendChild(croixQuitter);
    boutonsModale.appendChild(divI2);
    // le titre de la modale
    const titre = document.createElement("h1");
    titre.id = "titreModale";
    titre.innerText = "Galerie photo";
    // l'élément de la modale de base
    const fenetreModaleElement = document.createElement("div");
    fenetreModaleElement.id = "fenetreModale";
    fenetreModaleElement.appendChild(boutonsModale);
    fenetreModaleElement.appendChild(titre);
    modale.appendChild(fenetreModaleElement);
    // on met la modale dans le main
    const main = document.querySelector("body");
    main.appendChild(modale);
    // la liste des works
    const modaleListe = document.createElement("div");
    modaleListe.id = "modaleListe";
    modaleListe.classList.add("none", "flex");
    // pour chaque work on va afficher son image et un logo de poubelle pour la supprimer
    fenetreModaleElement.appendChild(modaleListe);
    affichageWorksModale();
    // on ajoute le formulaire d'ajout qu'on n'affiche pas
    const modaleFormulaire = document.createElement("form");
    modaleFormulaire.id = "modalForm";
    modaleFormulaire.classList.add("none");
    // dans le formulaire : le file
    const fileLabel = document.createElement("div");
    fileLabel.id = "fileLabel";
    const fileElement = document.createElement("div");
    fileElement.id = "fileElement";
    const fileImage = document.createElement("i");
    fileImage.id = "fileImage";
    fileImage.classList.add("fa-regular", "fa-image");
    fileElement.classList.add("none", "flex");
    const fileBouton = document.createElement("button");
    fileBouton.id = "fileBouton";
    fileBouton.innerText = "+ Ajouter photo";
    fileBouton.type = "submit";
    fileBouton.classList.add("none", "flex");
    const fileTexte = document.createElement("p");
    fileTexte.id = "fileTexte";
    fileTexte.innerText = "jpg, png : 4mo max";
    fileTexte.classList.add("none", "flex");
    fileElement.appendChild(fileImage);
    fileLabel.appendChild(fileElement);
    fileLabel.appendChild(fileBouton);
    fileLabel.appendChild(fileTexte);
    const fileInput = document.createElement("input");
    fileInput.id = "fileInput";
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png";
    fileInput.required = true;
    fileInput.value = "";
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
    fenetreModaleElement.appendChild(modaleFormulaire);
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
    fenetreModaleElement.appendChild(boutonAjout);
    // on cache la modale
    modale.classList.add("none");
    ecouteAjoutImage();
    ecouteQuitterModale();
    ecouteAjout();
    ecouteValider();
    ecoutePoubelle();
}

//*********************************************************
// Fonction d'affichage des works dans la modale
function affichageWorksModale(){
    const modaleListe = document.getElementById("modaleListe");
    modaleListe.innerHTML = "";
    for (let work of works){
        // création des balises 
        const divElement = document.createElement("div");
        // divElement.id = `fiche${work.id}`;
        divElement.classList.add("fiche");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        const poubelle = document.createElement("i");
        poubelle.id = work.id;
        poubelle.classList.add("fa-solid", "fa-trash-can");
        poubelle.classList.add("poubelle");
        // encrage des balises dans la modale
        divElement.appendChild(imageElement);
        divElement.appendChild(poubelle);
        modaleListe.appendChild(divElement);
    }
}

//*********************************************************
// Fonction d'écoute pour la suppression d'un work
function ecoutePoubelle() {
    const poubelles = document.querySelectorAll(".poubelle");
    for (let poubelle of poubelles) {
        poubelle.addEventListener("click", async function() {
            // Envoi de la requête DELETE
            try {
                const reponse = await fetch(`http://localhost:5678/api/works/${this.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
                    },
                });
                // si la réponse n'est pas bonne on envoie l'erreur
                if (!reponse.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
                }
                // sinon, on met à jour l'affichage dans la liste des works et la modale
                else {
                    const modaleListe = document.getElementById("modaleListe");
                    for (let work of works) {
                        if (work.id === parseInt(this.id)) {
                            const index = works.findIndex(objet => objet.id === work.id);
                            works.splice(index, 1);
                            affichageWorksModale();
                            affichageWorks(works);
                            ecoutePoubelle();
                            // réinitialisation de la modale
                            retourModale();
                        }
                    }
                }
            } catch (erreur) {
                console.error("Une erreur s'est produite :", erreur);
            }
        });
    }
}


//*********************************************************
// Fonction écoute du changement d'image
function ecouteAjoutImage() {
    const fileBouton = document.getElementById("fileBouton");
    const fileInput = document.getElementById("fileInput");
    const fileImage = document.getElementById("fileElement");
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
            } else {
            }
        });
    });
}

//*********************************************************
// Fonction écoute du bouton Ajout
function ecouteAjout(){
    const ajoutElement = document.getElementById("boutonAjout");
    ajoutElement.addEventListener("click", function() {
        // on réaffiche la modale différemment
        document.getElementById("titreModale").innerText = "Ajout photo";
        document.getElementById("divI").classList.add("flex");
        document.getElementById("modalForm").classList.add("flex");
        document.getElementById("boutonsModale").classList.add("boutonModale2");
        document.getElementById("modaleListe").classList.remove("flex");
        document.getElementById("boutonAjout").classList.remove("flex");
    });
}

//*********************************************************
// Fonction écoute du bouton Valider l'ajout
function ecouteValider(){
    const validerElement = document.getElementById("boutonValider");
    validerElement.addEventListener("click", async function(event) {
        event.preventDefault();
        const fichierSource = document.getElementById("fileInput");
        const titre = document.getElementById("titreInput");
        const categorie = document.getElementById("categorieInput").value;
        const categories = extraitCategories();
        let categorieId = 0;
        for (let i = 0 ; i < categories.length ; i++) {
            if (categories[i] === categorie) {
                categorieId = (i + 1);
            }
        }
        // création du fichier json
        const donnees = new FormData();
        donnees.append("image", fichierSource.files[0]);
        donnees.append("title", titre.value);
        donnees.append("category", categorieId);

        // Envoi de la requête POST à l'API
        try {
            const reponse = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
                },
                body: donnees
            });
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
            }
            const data = await reponse.json();
            // ajout de l'image au DOM
            // actualise l'affichage des works avec la nouvelle image
            const nouvelleImage = {
                "id": parseInt(data.id),
                "imageUrl": data.imageUrl,
                "title": data.title,
                "category": {
                    "id": parseInt(data.categoryId),
                    "name": categorie
                }
            }
            works = traitementWorks(works, nouvelleImage);
            // affichage des nouveaux works
            affichageWorks(works);
            // affichage de la nouvelle modale
            affichageWorksModale();
            // écoute de la nouvelle poubelle
            ecoutePoubelle();
            // fermeture et réinitialisation de la modale
            const modale = document.getElementById("modale");
            modale.classList.remove("flex");
            retourModale();

        } catch (erreur) {
            console.error("Une erreur s'est produite :", erreur);
        }
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