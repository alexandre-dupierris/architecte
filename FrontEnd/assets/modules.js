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

// fonction d'affichage des works
export function affichageWorks(worksFiltres) {
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
        const titreElement = document.createElement("figcaption");
        titreElement.innerText = worksFiltres[i].title;
        // on affiche les éléments
        gallery.appendChild(figureElement);
        figureElement.appendChild(imageElement);
        figureElement.appendChild(titreElement);
    }
}

// fonction d'affichage des boutons filtres
export function affichageFiltres(){
    // récupération de la balise concernée
    const portfolio = document.querySelector(".portfolio");
    // on vérifie le nombre de catégories définies
    let categories = works.map(works => works.category.name);
    categories = new Set(categories);
    console.log(categories);
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

// fonction de tri des catégories
export function ecouteBoutons(){
    const boutons = document.querySelectorAll(".filters button");
    for (const boutonFiltrer of boutons) {
        boutonFiltrer.addEventListener("click", function () {
            const worksFiltres = works.filter(function (work) {
                const categorie = boutonFiltrer.id;
                if (categorie === "boutonTous"){
                    return true;
                }
                else {
                    return work.categoryId === parseInt(categorie);
                }
            });
            document.querySelector(".gallery").innerHTML = "";
            affichageWorks(worksFiltres);
         });
    }
}