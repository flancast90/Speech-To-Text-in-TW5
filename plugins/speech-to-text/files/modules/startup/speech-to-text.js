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
	var isRecording = false;
	// required for API to initialise
	var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
	var recognition = new SpeechRecognition();

	// This runs when the speech recognition service starts
	recognition.onstart = function() {
		isRecording = true;
		// What is the best way to alert the user of 
		// Mic recording? Put either dropdown, alert, etc.
		// here for that functionality.
		$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-started");

		// do something when recording starts
		
		$tw.wiki.setText("$:/state/speech-to-text/recording/ongoing","text",undefined,"yes");
	};

	recognition.onspeechend = function() {
		isRecording = false;
		// when user is done speaking
		recognition.stop();
		
		// What is the best way to alert the user of 
		// Mic-stopped recording? Use that method here.
		$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");
		
		// WE WANT TO CHANGE BUTTON COLOUR BACK TO BLACK HERE
		$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
		$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording");
	}
			  
	// We will grab the transcripts, and console.log
	// the confidence here.
	recognition.onresult = function(event) {
		var transcript = event.results[0][0].transcript;
		console.log(transcript);
		
		// This is what the user will see: the transcript of what they 		// said out-loud. We want to display this somehow in TW.
		
		// WE WANT TO DISPLAY THE OUTPUT (saved in var transcript) IN TW5
		var creationFields = $tw.wiki.getCreationFields();
		var modificationFields = $tw.wiki.getModificationFields();
		var title = $tw.wiki.generateNewTitle("New Transcript");
		$tw.wiki.addTiddler(new $tw.Tiddler(creationFields,modificationFields,{title: title,text: transcript}));
		
		var confidence = event.results[0][0].confidence;
		console.log(confidence);
	};

	$tw.wiki.addEventListener("change",function(changes) {
		if(changes["$:/state/speech-to-text/recording"]) {
			var recordingState = $tw.wiki.getTiddlerText("$:/state/speech-to-text/recording") === "yes";
			if(!isRecording && recordingState) {
				recognition.start();
			} else {
				recognition.stop();
				isRecording = false;
				$tw.notifier.display("$:/plugins/flancast90/speech-to-text/ui/Notifications/recording-stopped");
				$tw.wiki.deleteTiddler("$:/state/speech-to-text/recording/ongoing");
			}
		}
	});
};

})();
