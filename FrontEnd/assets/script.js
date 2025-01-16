let works;
async function main() {
    works = await fetchWorks();
    affichageHeader();
    construireModale();
    affichageMain();

}

main();