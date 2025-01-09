import { affichageWorks, affichageFiltres, ecouteBoutonsFiltres, ecouteLiBouton, affichageMain, affichageHeader} from "./modules.js";
// on affiche une première fois la page
affichageHeader("");
affichageMain();
// on écoute les boutons
ecouteLiBouton("loginItem");