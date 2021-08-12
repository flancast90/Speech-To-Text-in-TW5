/*\
title: $:/plugins/flancast90/speech-to-text/modules/startup/speech-to-text.js
type: application/javascript
module-type: startup

Speech to Text handling

\*/
(function(){

/*jslint node: true, browser: true */
/*global $tw: false */
"use strict";

// Export name and synchronous status
exports.name = "speech-to-text";
exports.platforms = ["browser"];
exports.after = ["startup"];
exports.synchronous = true;

exports.startup = function() {
	if(!window.SpeechRecognition && !window.webkitSpeechRecognition) {
		return;
	}
	var isRecording = false;
	var fullTranscript = "";
	var transcriptCounter = 0;
	var isLanguageChange = false;
	var isContinuousListening = false;
	var isRestartContinuousListening = false;

	var userCommandsList = [];
	var userCommandsActionList = [];

	var userKeywordsOk,
		userKeywordsWiki;

	// required for API to initialise
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

	// here we handle all speech web api specific settings. The names are
	// a solid indicator of what they do.
	var recognition = new SpeechRecognition();
	recognition.continuous = true;
	// WE SHOULDN'T SET THE LANGUAGE BY DEFAULT
	// default is what the HTML 'lang' attribute defines or what the user system defines
	//recognition.lang = 'en-US';

	var getVoiceCommandTiddlerList = function() {
		return $tw.wiki.getTiddlersWithTag("$:/tags/VoiceCommand");
	};

	var updateVoiceCommandLists = function(tiddlerList) {
		var voiceCommandTiddlers = tiddlerList;
		for(var i=0; i<tiddlerList.length; i++) {
			var title = tiddlerList[i],
				tiddlerFields = $tw.wiki.getTiddler(title).fields;
			var userCommands = $tw.wiki.getTiddlerList(title,"voice-commands");
			for(var k=0; k<userCommands.length; k++) {
				userCommandsList[i + k] = userCommands[k];//tiddlerFields["voice-command"] !== undefined ? tiddlerFields["voice-command"] : undefined;
				userCommandsActionList[i + k] = tiddlerFields.text;
			}
		}
	};

	// This runs when the speech recognition service starts
	recognition.onstart = function() {
		isRecording = true;
		// What is the best way to alert the user of 
		// Mic recording? Put either dropdown, alert, etc.
		// here for that functionality.
		if(!isLanguageChange && !isRestartContinuousListening) {
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-started");

			// do something when recording starts
			
			$tw.wiki.setText("$:/state/speech-to-text/recording/ongoing","text",undefined,"yes");
		} else {
			isRestartContinuousListening = false;
			isLanguageChange = false;
		}
	};

	recognition.onspeechend = function() {
		if(!isLanguageChange && !isCommand) {
			isRecording = false;
			// when user is done speaking
			recognition.stop();

			// What is the best way to alert the user of 
			// Mic-stopped recording? Use that method here.
			//$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");
			
			// WE WANT TO CHANGE BUTTON COLOUR BACK TO BLACK HERE
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording");
		}
	}

	recognition.onend = function() {
		if(!isLanguageChange && !isContinuousListening) {
			isRecording = false;
			transcriptCounter = 0;
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");

			// WE WANT TO DISPLAY THE OUTPUT (saved in var transcript) IN TW5
			var creationFields = $tw.wiki.getCreationFields();
			var modificationFields = $tw.wiki.getModificationFields();
			var title = $tw.wiki.generateNewTitle("New Transcript");
			if(fullTranscript && fullTranscript.replace(/\s+$/, '') !== "") {
				$tw.wiki.addTiddler(new $tw.Tiddler(creationFields,modificationFields,{ title: title, text: fullTranscript.replace(/\s+$/, '') }));
				$tw.rootWidget.invokeActionString('<$navigator story="$:/StoryList" history="$:/HistoryList"><$action-sendmessage $message="tm-edit-tiddler" $param="' + title + '"/></$navigator>');
			}
			
			fullTranscript = "";
			
			// WE WANT TO CHANGE BUTTON COLOUR BACK TO BLACK HERE
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording");
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/transcript");
		} else if(isLanguageChange) {
			transcriptCounter = 0;
			recognition.start();
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/language-switch",{variables: {language: recognition.lang}})
		} else if(isContinuousListening) {
			transcriptCounter = 0;
			isRestartContinuousListening = true;
			recognition.start();
		}
	}

	recognition.onresult = function(event) {
		var transcript = event.results[transcriptCounter][0].transcript;
		var confidence = event.results[transcriptCounter][0].confidence;
		var stopRecognizing = false;

		if(transcriptCounter === 0) {
			transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
		}

		fullTranscript = fullTranscript + transcript;

		//var transcriptChunk;
		// WE CAN ADD COMMANDS IN THE BELOW IF STATEMENT, AS WELL AS WHAT THEY SHOULD DO.

		var keyWordsOk = ["OK","ok","Ok","Okay","okay","Oké","oké"];
		var keyWordsWiki = ["Wiki","wiki","Wikis","wikis","Vicky","vicky","Vichi","vichi","Vicchi","vicchi","WC","Wc","wc","Vichy","vichy","Witchy","witchy","VC","vc","Vecchi","vecchi"];
		if(userKeywordsOk.length > 0) {
			keyWordsOk = keyWordsOk.concat(userKeywordsOk);
		}
		if(userKeywordsWiki.length > 0) {
			keyWordsWiki = keyWordsWiki.concat(userKeywordsWiki);
		}
		var keyWordsCommands = ["switch language to", "Switch language to", "stop listening", "Stop listening"];

		keyWordsCommands = keyWordsCommands.concat(userCommandsList);

		var languageNames = ["africaans", "indonesian", "malaysian", "catalonian", "german", "english", "spanish", "basque", "french", "croatian", "icelandic", "italian", "hungarian", "netherlandic", "norwegian", "polish", "portuguese", "romanian", "slavic", "finish", "finnish", "swedish", "turkish", "bulgarian", "russian", "serbian", "korean", "chinese", "japanese", "persian", "latin"];
		var languageIdentifiers = ["af-ZA", "id-ID", "ms-MY", "ca-ES", "de-DE", "en-US", "es-ES", "eu-ES", "fr-FR", "hr-HR", "is-IS", "it-IT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-PT", "ro-RO", "sk-SK", "fi-FI", "fi-FI", "sv-SE", "tr-TR", "bg-BG", "ru-RU", "sr-RS", "ko-KR", "cmn-Hans-CN", "ja-JP", "fa-IR", "la"];

		var executeTranscriptCommands = function(command,chunk,replaceString) {
			if(command.toLowerCase() === "switch language to") {
				var language = chunk.split(" ")[0];
				var userSpecifiedLanguage = languageNames.indexOf(language.toLowerCase());
				if (userSpecifiedLanguage === -1) {
					isLanguageChange = false;
					fullTranscript = fullTranscript.replace(replaceString + " " + language,"");
					$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/error-finding-lang",{variables:{language:language}});
				} else {
					recognition.lang = languageIdentifiers[userSpecifiedLanguage];
					isLanguageChange = true;
					recognition.stop();
					fullTranscript = fullTranscript.replace(replaceString + " " + language,"");
				}
			} else if(command.toLowerCase() === "stop listening") {
				stopRecognizing = true;
				fullTranscript = fullTranscript.replace(replaceString,"");
			} else if(userCommandsList.indexOf(command) !== -1) {
				var index = userCommandsList.indexOf(command);
				var action = userCommandsActionList[index];
				fullTranscript = fullTranscript.replace(replaceString,"");
				$tw.rootWidget.invokeActionString(action);
			}
		};

		var getTranscriptCommands = function(transcriptChunk) {
			var reducedTranscriptChunk = transcriptChunk;
			for(var i=0; i<keyWordsOk.length; i++) {
				if(transcriptChunk.includes(keyWordsOk[i])) {
					var okKeyWordLength = keyWordsOk[i].length;
					var slicedChunk = transcriptChunk.slice(transcriptChunk.indexOf(keyWordsOk[i]) + okKeyWordLength + 1);
					for(var k=0; k<keyWordsWiki.length; k++) {
						if(slicedChunk.indexOf(keyWordsWiki[k]) !== -1) {
							var wikiKeyWordLength = keyWordsWiki[k].length;
							var slicedWikiWordChunk = slicedChunk.slice(wikiKeyWordLength + 1);
							for(var n=0; n<keyWordsCommands.length; n++) {
								var commandKeyWordLength = keyWordsCommands[n].length;
								var commandKeyWordSubstring = slicedWikiWordChunk.substring(0,commandKeyWordLength);
								var slicedCommandChunk = slicedWikiWordChunk.slice(commandKeyWordLength + 1);
								if(commandKeyWordSubstring === keyWordsCommands[n]) {
									if(reducedTranscriptChunk) {
										reducedTranscriptChunk = reducedTranscriptChunk.replace(keyWordsOk[i] + " " + keyWordsWiki[k] + " " + keyWordsCommands[n],"");
									}
									var replaceString = keyWordsOk[i] + " " + keyWordsWiki[k] + " " + keyWordsCommands[n];
									reducedTranscriptChunk = executeTranscriptCommands(keyWordsCommands[n],slicedCommandChunk,replaceString);
								}
							}
							for(var m=0; m<keyWordsOk.length; m++) {
								if(slicedWikiWordChunk.includes(keyWordsOk[m])) {
									getTranscriptCommands(slicedWikiWordChunk);
								}
							}
						}
					}
				}
			}
		};

		getTranscriptCommands(fullTranscript);

		transcriptCounter += 1;
		$tw.wiki.setText("$:/state/speech-to-text/transcript","text",undefined,fullTranscript);
		if(stopRecognizing) {
			recognition.stop();
		}
	};

	$tw.wiki.addEventListener("change",function(changes) {
		if(changes["$:/state/speech-to-text/recording"]) {
			var recordingState = $tw.wiki.getTiddlerText("$:/state/speech-to-text/recording") === "yes";
			if(!isRecording && recordingState) {
				recognition.start();
			} else if(isRecording) {
				isContinuousListening = false;
				recognition.stop();
				isRecording = false;
				//$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");
				$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			}
		}
		var newList = getVoiceCommandTiddlerList();
		var hasChanged = $tw.utils.hopArray(changes,newList);
		if(hasChanged) {
			updateVoiceCommandLists(newList);
		}
		if(changes["$:/config/speech-to-text/keywords"]) {
			userKeywordsOk = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","ok-keywords");
			userKeywordsWiki = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","wiki-keywords");
		}
		if(changes["$:/config/speech-to-text/language"]) {
			var lang = $tw.wiki.getTiddlerText("$:/config/speech-to-text/language") || document.documentElement.lang;
			if(lang && lang !== recognition.lang) {
				recognition.lang = lang;
				isLanguageChange = true;
				recognition.stop();
			}
		}
		if(changes["$:/config/speech-to-text/continuous"]) {
			isContinuousListening = $tw.wiki.getTiddlerText("$:/config/speech-to-text/continuous") === "yes";
		}
	});

	updateVoiceCommandLists(getVoiceCommandTiddlerList());
	userKeywordsOk = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","ok-keywords");
	userKeywordsWiki = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","wiki-keywords");
	isContinuousListening = $tw.wiki.getTiddlerText("$:/config/speech-to-text/continuous") === "yes";
	var lang = $tw.wiki.getTiddlerText("$:/config/speech-to-text/language") || document.documentElement.lang;
	if(lang && lang !== recognition.lang) {
		recognition.lang = lang;
	}
};

})();
