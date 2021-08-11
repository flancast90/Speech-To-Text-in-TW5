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
	//default is English, but user can change via speech-commands later

	var isRecording = false;
	var fullTranscript = "";
	var transcriptCounter = 0;
	var isCommand = false;
	var isLanguageChange = false;
	// required for API to initialise
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

	// here we handle all speech web api specific settings. The names are
	// a solid indicator of what they do.
	var recognition = new SpeechRecognition();
	recognition.continuous = true;
	// WE SHOULDN'T SET THE LANGUAGE BY DEFAULT
	//recognition.lang = 'en-US';

	// This runs when the speech recognition service starts
	recognition.onstart = function() {
		isRecording = true;
		// What is the best way to alert the user of 
		// Mic recording? Put either dropdown, alert, etc.
		// here for that functionality.
		if(!isLanguageChange) {
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-started");

			// do something when recording starts
			
			$tw.wiki.setText("$:/state/speech-to-text/recording/ongoing","text",undefined,"yes");
		} else {
			isLanguageChange = false;
		}
	};

	recognition.onspeechend = function() {
		if(!isLanguageChange) {
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
		if(!isLanguageChange) {
			isRecording = false;
			transcriptCounter = 0;
			$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");

			// WE WANT TO DISPLAY THE OUTPUT (saved in var transcript) IN TW5
			var creationFields = $tw.wiki.getCreationFields();
			var modificationFields = $tw.wiki.getModificationFields();
			var title = $tw.wiki.generateNewTitle("New Transcript");
			if(fullTranscript !== "") {
				$tw.wiki.addTiddler(new $tw.Tiddler(creationFields,modificationFields,{title: title,text: fullTranscript}));
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
		}
	}

	recognition.onresult = function(event) {
		var transcript = event.results[transcriptCounter][0].transcript;
		var confidence = event.results[transcriptCounter][0].confidence;
		var stopRecognizing = false;

		if(transcriptCounter === 0) {
			transcript = transcript.charAt(0).toUpperCase() + transcript.slice(1);
		}

		var transcriptChunk;
		// WE CAN ADD COMMANDS IN THE BELOW IF STATEMENT, AS WELL AS WHAT THEY SHOULD DO.
		
		/*
		 * Command Support for versions >= 1.0.4. We will check if 
		 * transcript contains the word "command", and from there we can match the rest 
		 * to pre-defined command phrases. This will also ease the command-adding process.
		*/
		//var language_lowered = transcript.toLowerCase();
		if (transcript.includes("Okay wiki") || transcript.includes("okay wiki") || transcript.includes("Okay Wiki") || transcript.includes("okay Wiki") || transcript.includes("ok wiki") || transcript.includes("Ok wiki") || transcript.includes("Ok Wiki") || transcript.includes("ok Wiki")) {

			isCommand = true;
			transcriptChunk = transcript;
			console.log("SPEECH-TO-TEXT PLUGIN: detected command word, awaiting further instructions.");
			// this is the actual text of the command
			var action;
			if(transcript.includes("ok wiki")) {
				action = transcriptChunk.replace("ok wiki ", "");
				transcriptChunk = transcriptChunk.replace("ok wiki ", "");
			} else if(transcript.includes("Ok wiki")) {
				action = transcriptChunk.replace("Ok wiki ", "");
				transcriptChunk = transcriptChunk.replace("Ok wiki ", "");
			} else if(transcript.includes("Ok Wiki")) {
				action = transcriptChunk.replace("Ok Wiki ", "");
				transcriptChunk = transcriptChunk.replace("Ok Wiki ", "");
			} else if(transcript.includes("ok Wiki")) {
				action = transcriptChunk.replace("ok Wiki ", "");
				transcriptChunk = transcriptChunk.replace("ok Wiki ", "");
			} else if(transcript.includes("okay Wiki")) {
				action = transcriptChunk.replace("okay Wiki ", "");
				transcriptChunk = transcriptChunk.replace("okay Wiki ", "");
			} else if(transcript.includes("Okay Wiki")) {
				action = transcriptChunk.replace("Okay Wiki ", "");
				transcriptChunk = transcriptChunk.replace("Okay Wiki ", "");
			} else if(transcript.includes("okay wiki")) {
				action = transcriptChunk.replace("okay wiki ", "");
				transcriptChunk = transcriptChunk.replace("okay wiki ", "");
			} else if(transcript.includes("Okay wiki")) {
				action = transcriptChunk.replace("Okay wiki ", "");
				transcriptChunk = transcriptChunk.replace("Okay wiki ", "");
			}
			if (action.includes("change language to ")) {
				console.log("SPEECH-TO-TEXT PLUGIN: change lang fired, awaiting to hear language name.");
				var lang_selection = action.split("change language to ")[1];
				console.log("SPEECH-TO-TEXT PLUGIN: attempting to change language to " + lang_selection);
				// for switching language name to identifier such as en_US, we will 
				// use arrays that share indexes as a sort of dictionary. For example,
				// name[1] = English, and identifier[1]= en_US.

				// NOTE: finnish is spelled as "finish" because the program always
				// interprets it as such
				var name = ["african", "indonesian", "malaysian", "catalonian", "german", "english", "spanish", "basque", "french", "croatian", "icelandic", "italian", "hungarian", "netherlandic", "norwegian", "polish", "portuguese", "romanian", "slavic", "finish", "swedish", "turkish", "bulgarian", "russian", "serbian", "korean", "chinese", "japanese", "latin"];
				var identifier = ["af-ZA", "id-ID", "ms-MY", "ca-ES", "de-DE", "en-US", "es-ES", "eu-ES", "fr-FR", "hr-HR", "is-IS", "it-IT", "hu-HU", "nl-NL", "nb-NO", "pl-PL", "pt-PT", "ro-RO", "sk-SK", "fi-FI", "sv-SE", "tr-TR", "bg-BG", "ru-RU", "sr-RS", "ko-KR", "cmn-Hans-CN", "ja-JP", "la"];

				var user_specified_name = name.indexOf(lang_selection.toLowerCase());
				transcriptChunk = transcriptChunk.replace("change language to " + lang_selection, "");
				// if error, tell the user.
				if (user_specified_name === -1) {
					$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/error-finding-lang",{variables:{language:lang_selection}});
					//recognition.stop();
				// otherwise, the language code is the index of the spoken word
				} else {
					recognition.lang = identifier[user_specified_name];
					console.log("SPEECH-TO-TEXT PLUGIN: language now is "+recognition.lang);
					isLanguageChange = true;
					recognition.stop();
				}

			} else if(action.includes("stop talking")) {
				transcriptChunk = transcriptChunk.replace("stop talking", "");
				stopRecognizing = true;
			}
		}

		transcriptCounter += 1;
		if(!isCommand) {
			fullTranscript = fullTranscript + transcript;
			$tw.wiki.setText("$:/state/speech-to-text/transcript","text",undefined,fullTranscript);
		} else {
			fullTranscript = fullTranscript + transcriptChunk;
			$tw.wiki.setText("$:/state/speech-to-text/transcript","text",undefined,fullTranscript);
		}
		if(stopRecognizing) {
			recognition.stop();
		}
		isCommand = false;
	};

	$tw.wiki.addEventListener("change",function(changes) {
		if(changes["$:/state/speech-to-text/recording"]) {
			var recordingState = $tw.wiki.getTiddlerText("$:/state/speech-to-text/recording") === "yes";
			if(!isRecording && recordingState) {
				recognition.start();
			} else if(isRecording) {
				recognition.stop();
				isRecording = false;
				//$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");
				$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			}
		}
	});
};

})();
