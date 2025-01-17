let works;
let toutesCategories;
async function main() {
    works = await fetchWorks();
    toutesCategories = await fetchCategories();
    affichageHeader();
    construireModale();
    affichageMain();
}
main();