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
		var missingVideoPath = videoRoot+"contactVideo/missing/final.mp4" ;
		var epilogueVideoPath = videoRoot+"epilogueVideo/epiloguecredit.mp4" ;

		/*udisk JSON path*/
		var udiskRoot = gameDataRoot+"arborescense/" ;

		/*for online use only*/
		/*var udiskJSONPath = gameRoot+"escaposaurus_gamedata/udisk.json" ;
		var udiskJSONPath = "/helper_scripts/accessJSON_udisk.php" ;*/


		// var udiskData =
	  	// {"root":{
	  	// 	"folders":
		//   		[
		//   		{"foldername":"gaming",
		// 		  	"files":["20190509_316504.mp4"]
		// 		},
		// 		{"foldername":"vieillescartespostales",
		// 				"files":["carte1.jpg", "carte2.jpg", "carte3.jpg", "carte4.jpg"]
		// 		},
		// 		{"foldername":"dcim","password":"forclaz","sequence":1,
		// 	  		"files":["20180807_103031.jpg", "20180807_114356.jpg", "20180807_123538.mp4"]
		// 	  	},
		// 	  	{"foldername":"itineraire2018",
		// 	  		"folders":[{"foldername":"perso", "files":["FXHT4438a.jpg","Screenshot20180701_Wanderplaner(1).jpg"],"password":"nata","sequence":0}]
		// 	  	},
		// 	  	{"foldername":"itineraire2019", "password":"trient","sequence":2,
		// 	  		"files":["fortnitescreen.png", "swisstopo-screen.png"],
		// 	  		"folders":[{"foldername":"GPS", "files":["idgps.png"],"password":"wandfluehorn","sequence":3}]
		// 	  	}
		//  		],
		// 	"files":[
		// 		"scan_memo.png"]}
		// } ;

		var udiskData =
		{"root":{
			"folders":
				[
				{"foldername":"Salon",
					"files":["Tableau cloche.png", "Tableau Louis XVI.png"],
					"folders":[	{"foldername":"Buffet", "files":["Tract Jeanne.png"]}
				]
				},


				{"foldername":"Cabinet","password":"78443","sequence":0, //Pour l'instant c'est un mdp mais il faut que ça se dévérouille tout seul avec la clef
						"files":["Tableau piece.png", "Tableau reunion.png", "tapis.png"],
						"folders":[	{"foldername":"Bibliothèque", "files":["Article journal.png", "Tract anti revolutionnaire.png"]},
									{"foldername":"Bureau", "files":["Cheque.png", "Livre code.png"]},
									{"foldername":"Coffre fort", "password":"110775","sequence":1, "files":["Agenda.png", "Carte Paris.png", "Coffre fort.jpg", "livre de compte.png", "LETTRE-GOURGUECHON.mp4"]}]
				},
				{"foldername" :"Sortie","password":"EGLISE","sequence":2, "files":"","folders":""}
			   ],
			
			"files":""}
		} ;


		var gameTitle = "Jeanne ou l'indépendance de la femme" ;
		var gameDescriptionHome = "Cette histoire relate le meurtre de Jeanne et la disparition de la déclaration des droits de la femme et de la citoyenne.<br/>Le code source est téléchargeable sur <a href='https://github.com/RedNaK/escaposaurus' target='_blank'>GitHub</a>" ;
		var gameMissionCall = "Madeleine s'approche de vous, éplorée." ;
		var gameMissionAccept = "&raquo;&raquo; Commencer votre investigation en commençant par fouiller la pièce (JOUER) &laquo;&laquo;" ;

		var gameCredit = "Un jeu conçu et réalisé par : <br/>Tristan Badana<br/>Gaïa Broilliard<br/>Léa Docteur<br/>Frédéric Kukovicic<br/>Gabrielle Laty<br/>Margot Thetiot" ; 
		var gameThanks = "Remerciements : <br/> ;)" ;

		var OSName = "Special InformaticienOS 3.11- diskloaded: Escaposaurus_Example" ;
		var explorerName = "USB DISK EXPLORER" ;
		var callerAppName = "CALL CONTACT" ;

		/*titles of video windows*/
		var titleData = {} ;
		titleData.introTitle = "INTRODUCTION" ;
		titleData.epilogueTitle = "EPILOGUE" ;
		titleData.callTitle = "Quelqu'un vous interpelle" ;

		/*change of caller app prompt for each sequence*/
		var promptDefault = "Vous observe sans bouger" ;
		var prompt = [] ;
		prompt[0] = "souhaitent vous parler" ;
		prompt[1] = "" ;
		prompt[2] = "" ;
		prompt[3] = "" ;
		prompt[4] = "" ;

		/*when the sequence number reach this, the player win, the missing contact is added and the player can call them*/
		var sequenceWin = 3 ;

		/*before being able to call the contacts, the player has to open the main clue of the sequence as indicated in this array*/
		/*if you put in the string "noHint", player will be able to immediatly call the contact at the beginning of the sequence*/
		/*if you put "none" or anything that is not an existing filename, the player will NOT be able to call the contacts during this sequence*/
		var seqMainHint = [] ;
		seqMainHint[0] = "noHint" ;
		seqMainHint[1] = "Article%20journal.png" ; /*if you put anything that is not an existing filename of the udisk, the player will never be able to call any contacts or get helps during this sequence*/
		seqMainHint[2] = "noHint" ;
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
		helperContacts[0] = {"vid" : "Albert", "vod_folder" : "", "username" : "Albert (pour avoir un indice)", "canal" : "txt", "avatar" : "albert.png", "bigAvatar" : "albertbig.png"} ;
		/*helperContacts[1] = {"vid" : "Lou", "username" : "Lou (pour avoir un deuxième indice) - par message", "canal" : "txt", "avatar" : "Lou_opt.jpg", "bigAvatar" : "avatarHelper2Big.gif"} ;*/


		/*ce qui apparait quand on trouve le dernier élément du disque dur*/
		finalStepAdded = "Vous allez à l'Eglise et retrouvez Isaac." ;

		/*the last call, it can be the person we find in the end or anyone else we call to end the quest, allows the game to know it is the final contact that is called and to proceed with the ending*/
		var missingContact = {"vid" : "Isaac", "vod_folder" : "", "username" : "Isaac (marie)", "canal" : "video", "avatar" : "Isaac.jpg"} ;

		/*Lou only send text message, they are stored here*/
		var tips = {} ;
		tips['Albert'] = [] ;
		tips['Albert'][0] = "Je peux pas répondre à votre appel. Mais je peux vous répondre par écrit. Donc vous cherchez le surnom d'un guide ? Je crois que les contacts sont des guides justement, essayez peut-être de les appeler." ;
		tips['Albert'][1] = "" ;
		tips['Albert'][2] = "" ;
		tips['Albert'][3] = "Ah zut, un dossier verouillé sans infos dans scan mémo ? Y'a forcément un truc mnémotechnique facile à retenir ou retrouver. Les guides en disent quoi ?" ;


		/*text for the instruction / solution windows*/
		var instructionText = {} ;
		instructionText.winState = "Vous avez retrouvé l'id GPS et vous pouvez appeler les secours du secteur." ;
		instructionText.lackMainHint = "" ;
		instructionText.password = "Vous devez trouver et entrer le mot de passe d'un des dossiers de la boite de droite. Vous pouvez trouver le mot de passe en appelant les contacts de la boite de gauche.<br/>Pour entrer un mot de passe, cliquez sur le nom d'un dossier et une fenêtre s'affichera pour que vous puissiez donner le mot de passe." ;

		/*please note the %s into the text that allow to automatically replace them with the right content according to which sequence the player is in*/
		var solutionText = {} ;
		solutionText.winState = "Si Sabine a été secourue, le jeu est fini bravo." ;
		solutionText.lackMainHint = "Vous devez ouvrir le fichier <b>%s</b><br/>" ;
		solutionText.password = "Vous devez déverouiller le dossier <b>%s1</b><br/>avec le mot de passe : <b>%s2</b><br/>" ;