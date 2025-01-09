import { ecouteLiBouton, affichageMain, affichageHeader} from "./modules.js";
// on affiche une première fois la page
affichageHeader("");
affichageMain();
// on écoute du bouton de login
ecouteLiBouton("loginItem");