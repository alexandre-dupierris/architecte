// ********** gestion des works de l'architecte et de leurs filtres

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
        alert("Erreur lors de la récupération des données");
    }
}

// Fonction de traitement des works y compris ceux ajoutés
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

// Fonction d'affichage des works selon le filtre
function affichageWorks(worksFiltres) {
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    if (worksFiltres === "Tous") {
        worksFiltres = works;
    }
    for (let i = 0 ; i < worksFiltres.length ; i++){
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        imageElement.src = worksFiltres[i].imageUrl;
        imageElement.alt = `image ${imageElement.src}`;
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = worksFiltres[i].title;
        gallery.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titreElement);
    }
}

// Fonction d'extraction des catégories par nom
function extraitCategories() {
    let categories = new Array();
    for (let i = 0 ; i < works.length ; i++) {
        const categorie = works[i].category.name;
        categories.push(categorie);
    }
    categories = [...new Set(categories)];
    return categories;
}

// Fonction d'affichage des boutons filtres
function affichageFiltres(){
    const categories = extraitCategories();
    const boutonTous = document.createElement("button");
    boutonTous.id = "boutonTous";
    boutonTous.innerText = "Tous";
    const filtres = document.querySelector(".filters");
    filtres.appendChild(boutonTous);
    for (let i = 0 ; i < categories.length ; i++) {
        const boutonCategorie = document.createElement("button");
        boutonCategorie.id = `filtreCategorie${i+1}`;
        boutonCategorie.innerText = categories[i];
        filtres.appendChild(boutonCategorie);
    }
}

// Fonction d'écoute des boutons filtres des catégories
function ecouteBoutonsFiltres(){
    const boutons = document.querySelectorAll(".filters button");
    for (const boutonFiltrer of boutons) {
        boutonFiltrer.addEventListener("click", function() {
            const worksFiltres = works.filter(function (work) {
                const categorie = boutonFiltrer.id;
                if (categorie === "boutonTous"){
                    return true;
                }
                else {
                    return work.category.id === parseInt(categorie.replace(/[a-zA-Z]/g, ''));
                }
            });
            document.querySelector(".gallery").innerHTML = "";
            affichageWorks(worksFiltres);
         });
    }
}

// ********** gestion des boutons du navigateur

// Fonction d'écoute des boutons li de nav : login ou projets
function ecouteLiBouton(bouton) {
    const liItem = document.getElementById(bouton);
    const boutonLogin = document.getElementById("loginItem");
    liItem.addEventListener("click", function() {
        if (liItem.id === "loginItem") {
            if (liItem.innerText === "login"){
                boutonLogin.classList.add("boldElement");
                affichageLogin();
            }
            else {
                const editionElement = document.querySelector(".edition");
                editionElement.classList.remove("flex");
                boutonLogin.classList.remove("boldElement");
                boutonLogin.innerText = "login";
                sessionStorage.clear();
                affichageMain();
            }
        }
        else if (liItem.id === "projectsItem") {
            boutonLogin.classList.remove("boldElement");
            affichageMain();
        }
        else {}
    });
}

// ********** gestion de la connexion

// Fonction affichage du formulaire de login
function affichageLogin() {
    const main = document.querySelector("main");
    const formulaire = document.createElement("form");
    formulaire.id = "loginForm";
    formulaire.action = "";
    formulaire.method = "POST";
    const fieldset = document.createElement("fieldset");
    const legend = document.createElement("legend");
    legend.innerText = "Log In";
    const labelEmail = document.createElement("label");
    labelEmail.setAttribute("for", "connexionEmail");
    labelEmail.innerText = "E-mail";
    const inputEmail = document.createElement("input");
    inputEmail.type = "email";
    inputEmail.id = "connexionEmail";
    inputEmail.required = true;
    const labelPassword = document.createElement("label");
    labelPassword.setAttribute("for", "connexionPassword");
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
    main.innerHTML = "";
    fieldset.appendChild(legend);
    fieldset.appendChild(labelEmail);
    fieldset.appendChild(inputEmail);
    fieldset.appendChild(labelPassword);
    fieldset.appendChild(inputPassword);
    formulaire.appendChild(fieldset);
    formulaire.appendChild(submitButton);
    formulaire.appendChild(mdpoublie);
    main.appendChild(formulaire);
    connexion();
}

// Fonction d'écoute de tentative de connexion
function connexion() {
    document.getElementById("connexion").addEventListener("click", async function(event) {
        event.preventDefault();
        const email = document.getElementById("connexionEmail").value;
        const password = document.getElementById("connexionPassword").value;
        const formulaire = document.getElementById("loginForm");
        const validationErreur = document.createElement("p");
        validationErreur.id = "reponseMessage";
        formulaire.appendChild(validationErreur);
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (email === "") {
            validationErreur.innerText = "le champ \"email\" doit être renseigné";
        }
        else if (!regex.test(email)){
            validationErreur.innerText = "le champ \"email\" n'est pas valide";
        }
        else if (password === "") {
            validationErreur.innerText = "le champ \"mot de passe\" doit être renseigné";
        }
        else {
            const requeteBody = {
                email: email,
                password: password
            };
            try {
                const reponse = await fetch("http://localhost:5678/api/users/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requeteBody)
                });
                const donnees = await reponse.json();
                if (reponse.ok) {
                    sessionStorage.setItem("authToken", donnees.token);
                    const boutonLogin = document.getElementById("loginItem");
                    boutonLogin.classList.remove("boldElement");
                    boutonLogin.innerText = "logout";
                    const editionElement = document.getElementById("edition");
                    editionElement.classList.add("flex");
                    affichageMain();
                }
                else {
                    if (donnees.message === undefined) {
                        validationErreur.innerText = "Echec de la connexion : Connexion non autorisée";
                    }
                    else {
                        if (donnees.message === "user not found"){
                            validationErreur.innerText = "Echec de la connexion : Utilisateur inconnu";
                        }
                    }
                }
            } catch (erreur) {
                validationErreur.innerText = "Erreur : " + erreur.message;
            }
        }          
    });
}

// ********** gestion de l'affichage des pages

// Fonction affichage du header
function affichageHeader() {
    const token = verifierToken();
    const header = document.querySelector("header");
    header.innerHTML = "";
    const editionElement = document.createElement("div");
    editionElement.id = "edition";
    editionElement.classList.add("edition");
    const editionIElement = document.createElement("i");
    editionIElement.classList.add("fa-solid", "fa-pen-to-square");
    const editionTexteElement = document.createElement("p");
    editionTexteElement.innerText = "Mode édition";
    editionElement.appendChild(editionIElement);
    editionElement.appendChild(editionTexteElement);
    const contenuHeader = document.createElement("div");
    contenuHeader.id = "contenuHeader";
    const headerListe = document.createElement("ul");
    headerListe.id = "listeBoutons";
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
    header.appendChild(editionElement);
    if (token !== false) {
        editionElement.classList.add("flex");
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
    header.appendChild(contenuHeader);
    ecouteLiBouton("projectsItem");
    ecouteLiBouton("loginItem");
}

// Fonction affichage du main
function affichageMain() {
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
				<input type="text" name="name" id="name" autocomplete="name">
				<label for="email">Email</label>
				<input type="email" name="email" id="email" autocomplete="email">
				<label for="message">Message</label>
				<textarea name="message" id="message" cols="30" rows="10"></textarea>
				<input type="submit" value="Envoyer">
			</form>
		</section>
    `;
    const token = verifierToken();
    const mesProjetElement = document.querySelector(".gallery");
    const modifierElement = document.getElementById("modifier");
    if (token === false) {
        affichageFiltres();
        mesProjetElement.classList.remove("margin");
        modifierElement.classList.remove("flex");
        ecouteBoutonsFiltres();
    }
    else {
        modifierElement.classList.add("flex");
        const modifierIElement = document.createElement("i");
        modifierIElement.classList.add("fa-solid", "fa-pen-to-square");
        const modifierTexteElement = document.createElement("p");
        modifierTexteElement.innerText = "modifier";
        modifierElement.appendChild(modifierIElement);
        modifierElement.appendChild(modifierTexteElement);
        ecouteModifierBouton();
        mesProjetElement.classList.add("margin");
    }
    affichageWorks("Tous");
}

// ********** gestion de la modale

// Fonction d'écoute du bouton modifier vers modale
function ecouteModifierBouton() {
    const modifier = document.getElementById("modifier");
    modifier.addEventListener("click", function() {
        document.getElementById("modale").classList.add("flex");
        retourModale();
    });
}

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

// Fonction pour construire la modale avec 2 états "galerie photo" et "ajouter photo"
function construireModale() {
    const modale = document.createElement("aside");
    modale.id = "modale";
    modale.role = "dialog";
    modale.setAttribute("aria-modal", "true");
    modale.setAttribute("aria-labbelledby", "titreModale");
    const main = document.querySelector("body");
    main.appendChild(modale);

    const boutonsModale = document.createElement("div");
    boutonsModale.id = "boutonsModale";
    boutonsModale.classList.add("boutonModale");
    const retourI = document.createElement("i");
    retourI.id = "retourModaleI";
    retourI.classList.add("fa-solid", "fa-arrow-left", "none");
    boutonsModale.appendChild(retourI);
    const croixQuitter = document.createElement("i");
    croixQuitter.id = "croixModaleI";
    croixQuitter.classList.add("fa-solid", "fa-xmark");
    boutonsModale.appendChild(croixQuitter);

    const titre = document.createElement("h1");
    titre.id = "titreModale";
    titre.innerText = "Galerie photo";

    const fenetreModaleElement = document.createElement("div");
    fenetreModaleElement.id = "fenetreModale";
    fenetreModaleElement.appendChild(boutonsModale);
    fenetreModaleElement.appendChild(titre);
    modale.appendChild(fenetreModaleElement);

    const modaleListe = document.createElement("div");
    modaleListe.id = "modaleListe";
    modaleListe.classList.add("none", "flex");
    fenetreModaleElement.appendChild(modaleListe);
    affichageWorksModale();

    const modaleFormulaire = document.createElement("form");
    modaleFormulaire.id = "modalForm";
    modaleFormulaire.classList.add("none");

    const fileContenu = document.createElement("div");
    fileContenu.id = "fileContenu";

    const fileImage = document.createElement("i");
    fileImage.id = "fileImage";
    fileImage.classList.add("fa-regular", "fa-image", "none", "flex");
    fileContenu.appendChild(fileImage);

    const fileBouton = document.createElement("button");
    fileBouton.id = "fileBouton";
    fileBouton.innerText = "+ Ajouter photo";
    fileBouton.type = "submit";
    fileBouton.classList.add("none", "flex");
    fileContenu.appendChild(fileBouton);

    const fileTexte = document.createElement("p");
    fileTexte.id = "fileTexte";
    fileTexte.innerText = "jpg, png : 4mo max";
    fileTexte.classList.add("none", "flex");
    fileContenu.appendChild(fileTexte);

    const fileInput = document.createElement("input");
    fileInput.id = "fileInput";
    fileInput.type = "file";
    fileInput.accept = "image/jpeg, image/png";
    fileInput.required = true;
    fileInput.value = "";
    fileInput.style.display = "none";

    const titreLabel = document.createElement("label");
    titreLabel.htmlFor = "titreInput";
    titreLabel.innerText = "Titre";
    const titreInput = document.createElement("input");
    titreInput.id = "titreInput";
    titreInput.type = "text";
    titreInput.required = true;

    const categorieLabel = document.createElement("label");
    categorieLabel.htmlFor = "categorieInput";
    categorieLabel.innerText = "Catégorie";
    const categorieInput = document.createElement("select");
    categorieInput.id = "categorieInput";
    categorieInput.required = true;
    const categories = extraitCategories();
    const categorieOptionVide = document.createElement("option");
    categorieOptionVide.value = "";
    categorieOptionVide.innerText = "";
    categorieInput.appendChild(categorieOptionVide);
    for (let categorie of categories) {
        const categorieOption = document.createElement("option");
        categorieOption.value = categorie;
        categorieOption.innerText = categorie;
        categorieInput.appendChild(categorieOption);
    }

    const boutonForm = document.createElement("button");
    boutonForm.id = "boutonValider";
    boutonForm.type = "submit";
    boutonForm.innerText = "Valider";
    titreInput.addEventListener("input", verifierChamps);
    categorieInput.addEventListener("input", verifierChamps);
    fileInput.addEventListener("change", verifierChamps);

    const imageEnvoyee = document.createElement("img");
    imageEnvoyee.id = "imageEnvoyee";
    imageEnvoyee.classList.add("none");
    fileContenu.appendChild(imageEnvoyee);

    fenetreModaleElement.appendChild(modaleFormulaire);
    modaleFormulaire.appendChild(fileContenu);
    modaleFormulaire.appendChild(fileInput);
    modaleFormulaire.appendChild(titreLabel);
    modaleFormulaire.appendChild(titreInput);
    modaleFormulaire.appendChild(categorieLabel);
    modaleFormulaire.appendChild(categorieInput);
    modaleFormulaire.appendChild(boutonForm);

    const boutonAjout = document.createElement("button");
    boutonAjout.id = "boutonAjout";
    boutonAjout.innerText = "Ajouter une photo";
    boutonAjout.classList.add("none", "flex");
    fenetreModaleElement.appendChild(boutonAjout);

    modale.classList.add("none");

    ecouteAjoutImage();
    ecouteQuitterModale();
    ecouteAjout();
    ecoutePoubelle();
    ecouteValider();
}

// Fonction d'affichage des works dans la modale
function affichageWorksModale(){
    const modaleListe = document.getElementById("modaleListe");
    modaleListe.innerHTML = "";
    for (let work of works){
        const ficheElement = document.createElement("div");
        ficheElement.classList.add("fiche");
        const imageElement = document.createElement("img");
        imageElement.src = work.imageUrl;
        imageElement.alt = work.title;
        ficheElement.appendChild(imageElement);
        const poubelle = document.createElement("i");
        poubelle.id = work.id;
        poubelle.classList.add("fa-solid", "fa-trash-can", "poubelle");
        ficheElement.appendChild(poubelle);
        modaleListe.appendChild(ficheElement);
    }
}

// Fonction d'écoute pour la suppression d'un work
function ecoutePoubelle() {
    const poubelles = document.querySelectorAll(".poubelle");
    for (let poubelle of poubelles) {
        poubelle.addEventListener("click", async function() {
            try {
                const reponse = await fetch(`http://localhost:5678/api/works/${this.id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
                    },
                });
                if (!reponse.ok) {
                    throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
                }
                else {
                    for (let work of works) {
                        if (work.id === parseInt(this.id)) {
                            const index = works.findIndex(objet => objet.id === work.id);
                            works.splice(index, 1);
                            affichageWorksModale();
                            affichageWorks(works);
                            ecoutePoubelle();
                            retourModale();
                        }
                    }
                }
            } catch (erreur) {
                alert("Une erreur s'est produite");
            }
        });
    }
}

// Fonction écoute du changement d'image
function ecouteAjoutImage() {
    const fileBouton = document.getElementById("fileBouton");
    const fileInput = document.getElementById("fileInput");
    const fileImage = document.getElementById("fileImage");
    const fileTexte = document.getElementById("fileTexte");
    const imageEnvoyee = document.getElementById("imageEnvoyee");
    fileBouton.addEventListener("click", function(event) {
        event.preventDefault();
        fileInput.value = "";
        fileInput.click();
        fileInput.addEventListener("change", function() {
            const file = this.files[0];
            if (file) {
                const typesValides = ["image/jpeg", "image/png"];
                if (!typesValides.includes(file.type)) {
                    alert("Seuls les fichiers JPG et PNG sont autorisés.");
                    fileInput.value = "";
                }
                else {
                    fileImage.classList.remove("flex");
                    fileTexte.classList.remove("flex");
                    fileBouton.classList.remove("flex");
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        imageEnvoyee.src = e.target.result;
                        imageEnvoyee.alt = file.name;
                    };
                    reader.readAsDataURL(file);
                    imageEnvoyee.classList.add("flex");
                }
            }
        });
    });
}

// Fonction écoute du bouton Ajout vers état 2 de la modale
function ecouteAjout(){
    const ajoutElement = document.getElementById("boutonAjout");
    ajoutElement.addEventListener("click", function() {
        document.getElementById("titreModale").innerText = "Ajout photo";
        document.getElementById("retourModaleI").classList.add("flex");
        document.getElementById("modalForm").classList.add("flex");
        document.getElementById("boutonsModale").classList.add("boutonModale2");
        document.getElementById("modaleListe").classList.remove("flex");
        document.getElementById("boutonAjout").classList.remove("flex");
        document.getElementById("modalForm").reset();
        verifierChamps();
    });
}

// Fonction écoute du bouton Valider l'ajout
function ecouteValider(){
    const validerElement = document.getElementById("boutonValider");
    validerElement.addEventListener("click", async function(event) {
        event.preventDefault();
        const categorie = document.getElementById("categorieInput").value;
        const categories = extraitCategories();
        let categorieId = 0;
        for (let i = 0 ; i < categories.length ; i++) {
            if (categories[i] === categorie) {
                categorieId = (i + 1);
            }
        }
        const corps = new FormData();
        corps.append("image", document.getElementById("fileInput").files[0]);
        corps.append("title", document.getElementById("titreInput").value);
        corps.append("category", categorieId);
        try {
            const reponse = await fetch("http://localhost:5678/api/works", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${sessionStorage.getItem("authToken")}`
                },
                body: corps
            });
            if (!reponse.ok) {
                throw new Error(`Erreur HTTP ! Statut : ${reponse.status}`);
            }
            const donnees = await reponse.json();
            const nouvelleImage = {
                "id": parseInt(donnees.id),
                "imageUrl": donnees.imageUrl,
                "title": donnees.title,
                "category": {
                    "id": parseInt(donnees.categoryId),
                    "name": categorie
                }
            }
            works = traitementWorks(works, nouvelleImage);
            affichageWorks(works);
            affichageWorksModale();
            ecoutePoubelle();
            document.getElementById("modale").classList.remove("flex");
            retourModale();

        } catch (erreur) {
            alert("Les champs ne sont pas remplis correctement");
        }
    });
}

// Fonction pour vérifier si tous les champs sont remplis
function verifierChamps() {
    const titreRempli = titreInput.value.trim() !== "";
    const categorieRemplie = categorieInput.value.trim() !== "";
    const fichierChoisi = fileInput.files.length > 0;
    document.getElementById("boutonValider").disabled = !(titreRempli && categorieRemplie && fichierChoisi);
}

// ********** gestion du token

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