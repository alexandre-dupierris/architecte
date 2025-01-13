// déclaration de la variable qui accueille les données de l'API
let works;
// fonction main() attends qu'on récupère les données
async function main() {
    // on récupère les données
    works = await fetchWorks();
    // on affiche la page
    affichageHeader();
    affichageMain();
    // on construit la modale
    construireModale();
}

main();