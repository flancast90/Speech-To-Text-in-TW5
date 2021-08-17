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
	// we can change this to "true" when user opts-in
	var autochangeLang = false;
	
	var isRecording = false;
	var fullTranscript = "";
	var transcriptCounter = 0;
	var fullTranscriptCounter = 0;
	var isLanguageChange = false;
	var isContinuousListening = false;
	var isRestartContinuousListening = false;
	var hasBeenContinuouslyListening = false;
	var isUserLanguageChange = false;
	var isCommand = false;
	var isPiping = false;
	var isLanguageChangeLanguage;

	var userCommandsList = [];
	var userCommandsActionList = [];

	var commandsTranscript = "";

	var userKeywordsOk,
		userKeywordsWiki,
		userKeywordsPipe;

	// required for API to initialise
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

	// here we handle all speech web api specific settings. The names are
	// a solid indicator of what they do.
	var recognition = new SpeechRecognition();
	recognition.continuous = true;

	var getVoiceCommandTiddlerList = function() {
		return $tw.wiki.getTiddlersWithTag("$:/tags/VoiceCommand");
	};

	var updateVoiceCommandLists = function(tiddlerList) {
		userCommandsList = [];
		userCommandsActionList = [];
		for(var i=0; i<tiddlerList.length; i++) {
			var title = tiddlerList[i],
				tiddlerFields = $tw.wiki.getTiddler(title).fields;
			var userCommands = $tw.wiki.getTiddlerList(title,"voice-commands");
			for(var k=0; k<userCommands.length; k++) {
				userCommandsList.push(userCommands[k]);
				userCommandsActionList.push(tiddlerFields.text);
			}
		}
	};

	// This runs when the speech recognition service starts
	recognition.onstart = function() {
		isRecording = true;
		if(!isLanguageChange && !isRestartContinuousListening) {
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-started");
			$tw.wiki.setText("$:/state/speech-to-text/recording/ongoing","text",undefined,"yes");
		} else if(isUserLanguageChange) {
			$tw.wiki.setText("$:/state/speech-to-text/recording/ongoing","text",undefined,"yes");
			isUserLanguageChange = false;
		} else {
			isRestartContinuousListening = false;
			isLanguageChange = false;
		}
	};

	recognition.onspeechend = function() {
		if(!isLanguageChange && !isCommand && !isContinuousListening) {
			isRecording = false;
			recognition.stop();
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording");
		} else if(isCommand) {
			isCommand = false;
		}
	}

	recognition.onend = function() {
		if(!isLanguageChange && !isContinuousListening) {
			isRecording = false;
			transcriptCounter = 0;
			fullTranscriptCounter = 0;
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");

			// WE WANT TO DISPLAY THE OUTPUT (saved in var transcript) IN TW5
			var creationFields = $tw.wiki.getCreationFields();
			var modificationFields = $tw.wiki.getModificationFields();
			var title = $tw.wiki.generateNewTitle("New Transcript");
			if(fullTranscript && fullTranscript.replace(/\s+$/, '') !== "") {
				$tw.wiki.addTiddler(new $tw.Tiddler(creationFields,modificationFields,{ title: title, tags: "$:/tags/Transcript", text: fullTranscript.replace(/\s+$/, "").replace(/\s+/g, " ").replace(/^\s+/g, "") }));
				$tw.rootWidget.invokeActionString('<$navigator story="$:/StoryList" history="$:/HistoryList"><$action-sendmessage $message="tm-edit-tiddler" $param="' + title + '"/></$navigator>');
			}
			
			fullTranscript = "";
			commandsTranscript = "";
			
			// WE WANT TO CHANGE BUTTON COLOUR BACK TO BLACK HERE
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording");
			if(hasBeenContinuouslyListening) {
				isContinuousListening = true;
			}
		} else if(isLanguageChange && !isContinuousListening) {
			transcriptCounter = 0;
			recognition.start();
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/language-switch",{variables: {language: recognition.lang}});
		} else if(isContinuousListening) {
			transcriptCounter = 0;
			if(isLanguageChange) {
				$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/language-switch",{variables: {language: recognition.lang}});
			}
			isRestartContinuousListening = true;
			recognition.start();
		}
	}

	recognition.onresult = function(event) {
		var transcript = event.results[transcriptCounter][0].transcript;
		var confidence = event.results[transcriptCounter][0].confidence;

		var stopRecognizing = false;

		if(fullTranscriptCounter === 0) {
			transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
		}

		fullTranscript = fullTranscript + transcript;
		commandsTranscript = commandsTranscript + transcript;

		var keyWordsOk = ["OK","ok","Ok","Okay","okay","Oké","oké"];
		var keyWordsWiki = ["Wiki","wiki","Wikis","wikis","Vicky","Vicki","vicki","vicky","Vichi","vichi","Vicchi","vicchi","WC","Wc","wc","Vichy","vichy","Witchy","witchy","VC","vc","Vecchi","vecchi"];
		var keyWordsPipe = ["Pipe","pipe","Insert","insert"];
		if(userKeywordsOk.length > 0) {
			keyWordsOk = keyWordsOk.concat(userKeywordsOk);
		}
		if(userKeywordsWiki.length > 0) {
			keyWordsWiki = keyWordsWiki.concat(userKeywordsWiki);
		}
		if(userKeywordsPipe.length > 0) {
			keyWordsPipe = keyWordsPipe.concat(userKeywordsPipe);
		}
		var keyWordsCommands = ["switch language to", "Switch language to", "stop listening", "Stop listening"];

		keyWordsCommands = keyWordsCommands.concat(userCommandsList);

		var languageNames = ["africaans", "afrikaans", "indonesian", "malaysian", "malay", "catalonian", "catalan", "german", "danish", "english", "spanish", "basque", "french", "croatian", "icelandic", "italian", "hungarian", "netherlandic", "norwegian", "polish", "portuguese", "romanian", "slavic", "slovak", "finish", "finnish", "swedish", "turkish", "bulgarian", "russian", "serbian", "korean", "chinese", "japanese", "persian", "latin"];
		var languageIdentifiers = ["af-ZA", "af-ZA", "id-ID", "ms-MY", "ms-MY", "ca-ES", "ca-ES", "de-DE", "da-DK", "en-US", "es-ES", "eu-ES", "fr-FR", "hr-HR", "is-IS", "it-IT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-PT", "ro-RO", "sk-SK", "sk-SK", "fi-FI", "fi-FI", "sv-SE", "tr-TR", "bg-BG", "ru-RU", "sr-RS", "ko-KR", "cmn-Hans-CN", "ja-JP", "fa-IR", "la"];

		var executeTranscriptCommands = function(command,chunk,replaceString) {
			if(command.toLowerCase() === "switch language to") {
				var language = chunk.split(" ")[0];
				var userSpecifiedLanguage = languageNames.indexOf(language.toLowerCase());
				if (userSpecifiedLanguage === -1) {
					isLanguageChange = false;
					fullTranscript = fullTranscript.replace(new RegExp(replaceString + "(\\s+?)*" + language),"");
					$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/error-finding-lang",{variables:{language:language}});
				} else {
					recognition.lang = languageIdentifiers[userSpecifiedLanguage];
					isLanguageChangeLanguage = languageIdentifiers[userSpecifiedLanguage];
					isLanguageChange = true
					recognition.stop();
					fullTranscript = fullTranscript.replace(new RegExp(replaceString + "(\\s+?)*" + language),"");
				}
			} else if(command.toLowerCase() === "stop listening") {
				isContinuousListening = false;
				stopRecognizing = true;
				fullTranscript = fullTranscript.replace(new RegExp(replaceString),"");
			} else if(userCommandsList.indexOf(command) !== -1) {
				var index = userCommandsList.indexOf(command);
				var action = userCommandsActionList[index];
				fullTranscript = fullTranscript.replace(new RegExp(replaceString),"");
				$tw.rootWidget.invokeActionString(action);
			} else if(keyWordsPipe.indexOf(command) !== -1) {
				isPiping = true;
				fullTranscript = fullTranscript.replace(new RegExp(replaceString),"");
			}
		};

		var startsWithKeyword = function(chunk,keywords) {
			for(var i=0; i<keywords.length; i++) {
				if(chunk.substring(0,keywords[i].length) === keywords[i]) {
					return true;
				}
			}
			return false;
		};

		var removeKeyWords = function(chunk,keywords) {
			for(var i=0; i<keywords.length; i++) {
				if(chunk.substring(0,keywords[i].length) === keywords[i]) {
					return chunk.slice(keywords[i].length);
				}
			}
			return chunk;
		};

		var getTranscriptCommandsInner = function(transcriptChunk,okKeyWord,i) {
			var okKeyWordLength = okKeyWord.length;
			var slicedChunk = transcriptChunk.slice(transcriptChunk.indexOf(keyWordsOk[i]) + okKeyWordLength).replace(/^\s+/g, "");
			//commandsTranscript = transcriptChunk.slice(transcriptChunk.indexOf(keyWordsOk[i]) + okKeyWordLength).replace(/^\s+/g, "");
			for(var k=0; k<keyWordsWiki.length; k++) {
				if(slicedChunk.indexOf(keyWordsWiki[k]) !== -1) {
					var wikiKeyWordLength = keyWordsWiki[k].length;
					var slicedWikiWordChunk = slicedChunk.slice(wikiKeyWordLength);
					slicedWikiWordChunk = slicedWikiWordChunk.replace(/^\s+/g, "");
					//commandsTranscript = commandsTranscript.slice(wikiKeyWordLength).replace(/^\s+/g, "");
					while(startsWithKeyword(slicedWikiWordChunk,keyWordsOk)) {
						slicedWikiWordChunk = removeKeyWords(slicedWikiWordChunk,keyWordsOk).replace(/^\s+/g, "");
						commandsTranscript = removeKeyWords(commandsTranscript,keyWordsOk).replace(/^\s+/g, "");
					}
					if(slicedChunk.substring(0,wikiKeyWordLength) === keyWordsWiki[k]) {
						for(var n=0; n<keyWordsCommands.length; n++) {
							var commandKeyWordLength = keyWordsCommands[n].length;
							var commandKeyWordSubstring = slicedWikiWordChunk.substring(0,commandKeyWordLength);
							var slicedCommandChunk = slicedWikiWordChunk.slice(commandKeyWordLength).replace(/^\s+/g, "");
							//commandsTranscript = commandsTranscript.slice(commandKeyWordLength).replace(/^\s+/g, "");
							if(commandKeyWordSubstring === keyWordsCommands[n]) {
								isCommand = true;
								commandsTranscript = transcriptChunk.slice(transcriptChunk.indexOf(keyWordsOk[i]) + okKeyWordLength).replace(/^\s+/g, "").slice(wikiKeyWordLength).replace(/^\s+/g, "").slice(commandKeyWordLength).replace(/^\s+/g, "");
								var replaceString = keyWordsOk[i] + "(\\s+?)*" + keyWordsWiki[k] + "(\\s+?)*" + keyWordsCommands[n];
								executeTranscriptCommands(keyWordsCommands[n],slicedCommandChunk,replaceString);
							}
						}
						for(n=0; n<keyWordsPipe.length; n++) {
							var pipeKeyWordLength = keyWordsPipe[n].length;
							var pipeKeyWordSubstring = slicedWikiWordChunk.substring(0,pipeKeyWordLength);
							var slicedPipeChunk = slicedWikiWordChunk.slice(pipeKeyWordLength).replace(/^\s+/g, "");
							//commandsTranscript = commandsTranscript.slice(commandKeyWordLength).replace(/^\s+/g, "");
							if(pipeKeyWordSubstring === keyWordsPipe[n]) {
								isCommand = true;
								commandsTranscript = transcriptChunk.slice(transcriptChunk.indexOf(keyWordsOk[i]) + okKeyWordLength).replace(/^\s+/g, "").slice(wikiKeyWordLength).replace(/^\s+/g, "").slice(pipeKeyWordLength).replace(/^\s+/g, "");
								var replaceString = keyWordsOk[i] + "(\\s+?)*" + keyWordsWiki[k] + "(\\s+?)*" + keyWordsPipe[n];
								executeTranscriptCommands(keyWordsPipe[n],slicedPipeChunk,replaceString);
							}
						}
					}
					for(var m=0; m<keyWordsOk.length; m++) {
						if(slicedWikiWordChunk.indexOf(keyWordsOk[m]) !== -1) {
							getTranscriptCommandsInner(slicedWikiWordChunk,keyWordsOk[m],m);
						}
					}
				}
			}
		};

		var getTranscriptCommands = function(transcriptChunk) {
			for(var i=0; i<keyWordsOk.length; i++) {
				if(transcriptChunk.indexOf(keyWordsOk[i]) !== -1) {
					getTranscriptCommandsInner(transcriptChunk,keyWordsOk[i],i);
				}
			}
		};

		getTranscriptCommands(commandsTranscript);

		if(isPiping) {
			var activeElement = document.activeElement;
			var doc;
			if(activeElement && activeElement.tagName.toUpperCase() === "IFRAME" && activeElement.className === "tc-edit-texteditor tc-edit-texteditor-body") {
				doc = activeElement.contentDocument || activeElement.contentWindow.document;
				activeElement = doc.activeElement;
			} else {
				doc = document;
			}
			if(window.CodeMirror && activeElement.closest(".CodeMirror")) {
				var cm = activeElement.closest(".CodeMirror").CodeMirror;
				cm.replaceSelection({replacement: fullTranscript});
				isPiping = false;
				fullTranscript = "";
			} else if(activeElement && ((activeElement.tagName.toUpperCase() === "INPUT" && (activeElement.type.toUpperCase() === "TEXT" || activeElement.type.toUpperCase() === "SEARCH")) || activeElement.tagName.toUpperCase() === "TEXTAREA")) {
				if(doc) {
					if(doc.queryCommandSupported("insertText") && !$tw.browser.isFirefox) { 
				 		doc.execCommand("insertText",false,fullTranscript);
				 	} else {
				 		var selStart = activeElement.selectionStart,
							selEnd = activeElement.selectionEnd;
						var value = activeElement.value;
						var newText = value.substring(0,selStart) + fullTranscript + value.substring(selEnd,value.length);
						activeElement.value = newText;
						activeElement.setSelectionRange(selStart,selStart + fullTranscript.length);
				 	}
				 	fullTranscript = "";
				}
			}
			isPiping = false;
		}

		transcriptCounter += 1;
		fullTranscriptCounter += 1;
		//$tw.wiki.setText("$:/state/speech-to-text/transcript","text",undefined,fullTranscript);
		if(stopRecognizing) {
			isLanguageChange = false;
			isContinuousListening = false;
			recognition.stop();
		}
	};

	$tw.wiki.addEventListener("change",function(changes) {
		if(changes["$:/state/speech-to-text/recording"]) {
			var recordingState = $tw.wiki.getTiddlerText("$:/state/speech-to-text/recording") === "yes";
			if(!isRecording && recordingState) {
				if(autochangeLang) {
					recognition.lang = $tw.wiki.getTiddlerText("$:/language").replace("$:/languages/", "");
				} else {
					recognition.lang = isLanguageChangeLanguage || $tw.wiki.getTiddlerText("$:/config/speech-to-text/language") || document.documentElement.lang;
				}
				isContinuousListening = $tw.wiki.getTiddlerText("$:/config/speech-to-text/continuous") === "yes";
				recognition.start();
			} else if(isRecording && !recordingState) {
				hasBeenContinuouslyListening = isContinuousListening;
				isContinuousListening = false;
				recognition.stop();
				isRecording = false;
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
				if(isRecording) {
					isLanguageChange = true;
					isUserLanguageChange = true;
					recognition.stop();
				} else {
					$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/language-switch",{variables: {language: recognition.lang}})
				}
			}
		}
		if(changes["$:/config/speech-to-text/continuous"]) {
			isContinuousListening = $tw.wiki.getTiddlerText("$:/config/speech-to-text/continuous") === "yes";
		}
		if(changes["$:/config/speech-to-text/auto-change-language"]) {
			autochangeLang = $tw.wiki.getTiddlerText("$:/config/speech-to-text/auto-change-language") === "yes";
		}
		if(changes["$:/language"] && autochangeLang === true) {
			var tiddlyWikiLanguage = $tw.wiki.getTiddlerText("$:/language").replace("$:/languages/", "");
			recognition.lang = tiddlyWikiLanguage;
			if(isRecording) {
				isLanguageChange = true;
				recognition.stop();
			} else {
				$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/language-switch",{variables: {language: recognition.lang}})
			}
		}
	});

	updateVoiceCommandLists(getVoiceCommandTiddlerList());
	userKeywordsOk = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","ok-keywords");
	userKeywordsWiki = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","wiki-keywords");
	userKeywordsPipe = $tw.wiki.getTiddlerList("$:/config/speech-to-text/keywords","pipe-keywords");
	isContinuousListening = $tw.wiki.getTiddlerText("$:/config/speech-to-text/continuous") === "yes";
	autochangeLang = $tw.wiki.getTiddlerText("$:/config/speech-to-text/auto-change-language") === "yes";
	var lang = $tw.wiki.getTiddlerText("$:/config/speech-to-text/language") || document.documentElement.lang;
	if(lang && lang !== recognition.lang) {
		recognition.lang = lang;
	}
};

})();
