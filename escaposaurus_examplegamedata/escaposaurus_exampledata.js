<!--
/////////////////////////////////////////////////////////////
/// Escapausorus v1 (2020)
///	A quick and dirty framework to create small adventure game (certified vanilla JS)
/// Author: Stéphanie Mader (http://smader.interaction-project.net)
/// GitHub: https://github.com/RedNaK/escaposaurus
///	Licence: MIT
////////////////////////////////////////////////////////////
-->

	/*
		HERE IS THE CONFIGURATION OF THE GAME
	*/
		/*either online with VOD server and JSON load of data
		either local */
		var isLocal = true ;
 		var gameRoot = "./" ;
 		var gameDataRoot = gameRoot+"escaposaurus_examplegamedata/" ;
 		var videoRoot = gameDataRoot+"videos/" ;

 		/*caller app*/
		var contactVideoRoot = videoRoot+"contactVideo2/" ;

		/*full path to intro / outro video*/
		var missionVideoPath = videoRoot+"introVideo/intro1.mp4" ;
		var introVideoPath = videoRoot+"introVideo/intro2.mp4" ;
		var missingVideoPath = videoRoot+"contactVideo2/Isaac/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"arborescense/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/


		var udiskData =
		{"root":{
			"folders":
				[
				{"foldername":"Salon",
					"files":["Tableau cloche.png", "Tableau Louis XVI.png"],
					"folders":[	{"foldername":"Buffet", "files":["Reclamation des femmes.png"]}
				]
				},

				{"foldername":"Cabinet","password":"78443","sequence":0, "helptext":"Fermé par un cadenas 5 chiffres", //Pour l'instant c'est un mdp mais il faut que ça se dévérouille tout seul avec la clef
						"files":["Tableau piece.png"],
						"folders":[	{"foldername":"Bibliothèque", "files":["Article journal.png", "Affiche anti revolutionnaire.png"]},
									{"foldername":"Bureau", "files":["Cheque.png"]},
									{"foldername":"Coffre fort", "password":"110675","sequence":1,"helptext":"Fermé par un cadenas 6 chiffres", "files":["Agenda.png", "Carte Paris.png", "livre de compte.png", "LETTRE-GOURGUECHON.mp4", "Livre code.png"]}]
				},
				{"foldername" :"Aller chercher le tract","password":"EGLISE","sequence":2, "helptext" : "Où voulez vous partir ?","files":"","folders":""}
			   ],
			
			"files":""}
		} ;


		var gameTitle = "Jeanne ou l'indépendance de la femme" ;
		var gameDescriptionHome = "Cette histoire relate le meurtre de Jeanne et la disparition de la déclaration des droits de la femme et de la citoyenne.<br/>Le code source est téléchargeable sur <a href='https://github.com/RedNaK/escaposaurus' target='_blank'>GitHub</a>" ;
		var gameMissionCall = "Madeleine s'approche de vous, éplorée." ;
		var gameMissionAccept = "&raquo;&raquo; Commencer votre investigation en commençant par fouiller la pièce (JOUER) &laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>Tristan Badana<br/>Gaïa Broilliard<br/>Léa Docteur<br/>Frédéric Kukovicic<br/>Gabrielle Laty<br/>Margot Thetiot" ; 
		var gameThanks = "Remerciements : <br/> ;)" ;

		var OSName = "_" ;
		var explorerName = "MAISON DE JEANNE" ;
		var callerAppName = "AUTOUR DE VOUS" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "Vous interpellez quelqu'un." ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Vous observe sans bouger." ;
		var prompt = [] ;
		prompt[0] = "Souhaitent vous parler" ;
		prompt[1] = "Souhaitent vous parler" ;
		prompt[2] = "Souhaitent vous parler" ;
		prompt[3] = "Souhaitent vous parler" ;
		prompt[4] = "Souhaitent vous parler" ;

		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 3 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "Tableau%20Louis%20XVI.png" ;
		seqMainHint[1] = "Article%20journal.png" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
		seqMainHint[2] = "Agenda.png" ;
		seqMainHint[3] = "noHint" ;

		/*contact list, vid is the name of their folder in the videoContact folder, then the game autoload the video named seq%number of the current sequence%, e.g. seq0.MP4 for the first sequence (numbered 0 because computer science habits)
	their img need to be placed in their video folder, username is their displayed name
		*/
		var normalContacts = [] ;
		normalContacts[0] = {"vid" : "Madeleine", "vod_folder" : "", "username" : "Madeleine (club)", "canal" : "video", "avatar" : "Madeleine.jpg"} ;
		normalContacts[1] = {"vid" : "Marie", "vod_folder" : "", "username" : "Marie (club)", "canal" : "video", "avatar" : "Marie.jpg"} ;
		// normalContacts[2] = {"vid" : "Isaac", "vod_folder" : "", "username" : "Isaac (marie)", "canal" : "video", "avatar" : "Isaac.jpg"} ;
		
		// normalContacts[0] = {"vid" : "Denise", "vod_folder" : "", "username" : "Denise (guide)", "canal" : "video", "avatar" : "denise_avatar.jpg"} ;
		// normalContacts[1] = {"vid" : "Nathalie", "vod_folder" : "", "username" : "Nathalie (guide)", "canal" : "video", "avatar" : "nata_avatar.jpg"} ;

		/*second part of the list, contact that can help the player*/
		var helperContacts = [] ;
		helperContacts[0] = {"vid" : "Albert", "vod_folder" : "", "username" : "Pensées de Marguerite (pour avoir un indice)", "canal" : "txt", "avatar" : "albert.png", "bigAvatar" : "albertbig.png"} ;
		/*helperContacts[1] = {"vid" : "Lou", "username" : "Lou (pour avoir un deuxième indice) - par message", "canal" : "txt", "avatar" : "Lou_opt.jpg", "bigAvatar" : "avatarHelper2Big.gif"} ;*/


		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Vous allez à l'Eglise et retrouvez Isaac." ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "Isaac", "vod_folder" : "", "username" : "Mari de Jeanne (Isaac)", "canal" : "video", "avatar" : "Isaac.jpg"} ;

		/*Lou only send text message, they are stored here*/
		var tips = {} ;
		tips['Albert'] = [] ;
		tips['Albert'][0] = "Pourquoi avoir marqué S.O.N.N.E à côté du dessin de la boussole? Ces lettres ont-elles une autre signification ? On retrouve aussi la boussole sur le tableau de Louis XVI..." ;
		tips['Albert'][1] = "Isaac était visiblement contre la révolution. Cela veut dire qu'il a dû utiliser l'ancien calendrier commençant avec la naissance de Jesus Christ pour vérouiller ce coffre..." ;
		tips['Albert'][2] = "D'après son agenda, Isaac est censé rejoindre le Père Gourguechon aujourd'hui, mais il a chiffé l'endroit du rendez-vous... Mais quelle est la clé pour déchiffrer ce code..." ;
		tips['Albert'][3] = "" ; 


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé la lettre et résolu l'affaire." ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si vous résolvez le meurtre et que vous retrouvez le document de Jeanne, le jeu est fini bravo." ;
		solutionText.lackMainHint = "Vous devez inspecter l'objet <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller l'élément <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;