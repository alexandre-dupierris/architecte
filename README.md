# Portfolio-architecte-sophie-bluel

Projet développeur web / web mobile

--------------------------------------------------------------------
Le back-end n'a pas été touché, il est fourni pour l'exercice.

--------------------------------------------------------------------
Le front-end :

fichiers javascript décomposés en plusieurs fonctions :

* dans le fichier script.js :
	- déclaration des variables globales accueillant les données de l'API
	- puis attribution des valeurs à la variable
	- puis appel des fonctions d'affichage des header et main
	- appel enfin de la fonction qui construit la modale

* dans le fichier modules.js :

	- partie gestion des works de l'architecte et de leurs filtres :
		- fonction qui récupère les catégories sur le serveur via l'API,
		appelée une seule fois dès l'arrivée sur la page
		- fonction qui récupère les works de l'architecte sur le serveur via l'API,
		appelée une seule fois dès l'arrivée sur la page
		elle appelle la fonction de traitement des works
		- fonction qui traite les works,
		appelée lors de l'attribution des valeurs à la variable globale
		appelée lors de la modification de la variable globale (ajout d'un work)
		- fonction qui affiche les works selon le filtre en entrée,
		sera appelée à l'écoute des boutons filtres
		- fonction qui extrait les catégories en retirant les doublons,
		appelée pour l'affichage des boutons filtres
		- fonction qui affiche les boutons filtres
		en appelant la fonction d'extraction des catégories
		- fonction d'écoute des boutons filtres qui sera appelée lors de l'affichage du main,
		et qui appelle la fonction d'affichage des works

	- partie gestion des boutons du navigateur :
		- fonction d'écoute des boutons du navigateur qui sera appelée lors de l'affichage du header,
		selon le click, on affiche le main ou la page de login, avec un état de connexion selon nécessaire

	- partie gestion de la connexion :
		- fonction d'affichage de la page du formulaire pour se loguer
		appelle la fonction écoutant si on se logue
		- fonction d'écoute de la tentative de connexion par click, appelée par la page de login
		elle finit par appeler l'affichage du main si la connexion est validée, sinon affichage d'erreurs

	- partie gestion de l'affichage des pages :
		- fonction qui affiche le header, appelée lors de l'arrivée sur la page
		affiche le mode édition lorsque connecté,
		appelle la fonction d'écoute des boutons du navigateur
		- fonction qui affiche le main,
		affiche le contenu principal de la page, selon l'état de la connexion,
		si connecté, appelle la fonction d'écoute du bouton "modifier"
		si non connecté, appelle la fonction d'écoute des filtres des works de l'architecte
		dans tous les cas appelle la fonction d'affichage des works

	- partie gestion de la modale :
		- fonction d'écoute du bouton "modifier" qui affiche la modale
		appelle la fonction qui initialise la modale à l'état 1 (affichage de la bibliothèque d'images)
		- fonction d'écoute des boutons pour quitter la modale ou revenir en arrière sur l'état 1 de la modale
		appelle aussi la fonction qui initialise la modale à l'état 1
		- fonction d'initialisation de la modale à l'état 1
		- fonction de construction de la modale
		appelée lors de l'arrivée sur la page
		elle appelle la fonction d'affichage des works pour la modale
		elle appelle les fonctions d'écoute du bouton "quitter la modale" et d'écoute d'ajout d'image
		- fonction d'affichage des works dans la modale
		appelée lors de la construction de la modale,
		appelée lorsqu'on écoute la poubelle pour actualiser les works de la modale
		appelée lorsqu'on valide l'ajout d'un work, pour actualiser les works encore une fois
		- fonction d'écoute du bouton pour supprimer un work,
		appelée par la construction de la modale
		appelle les mises à jour des works dans la modale et sur le main, si suppression
		se remet à jour elle-même si suppression d'un work
		- fonction d'écoute grace à un reader, du changement de l'image choisie par l'utilisateur
		appelée par la construction de la modale
		- fonction d'écoute qui réaffiche la modale à l'état 2 (ajout d'une image à la bibliothèque)
		appelée par la construction de la modale
		- fonction d'écoute du bouton d'ajouter une image, appelée par la construction de la modale
		- fonction d'écoute du bouton valider l'ajout dans la bibliothèque
		appelée dans la construction de la modale
		enregistre l'image dans la bibliothèque, réinitialise et ferme la modale
		appelle le nouvel affichage des works en main et dans la modale,
		appelle l'actualisation des boutons supprimer
		- fonction de vérification des champs, appelée avant l'affichage du bouton valider

	- partie gestion du token : 
		- fonction qui vérifie l'état du token, appelée lors des affichages des header et main