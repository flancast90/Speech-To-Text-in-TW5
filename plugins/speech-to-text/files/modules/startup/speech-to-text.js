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

var speechRecognitionRunning = false;

exports.startup = function() {
	$tw.wiki.addEventListener("change",function(changes) {
		if(changes["$:/state/speech-to-text/recording"]) {
			var recordingState = $tw.wiki.getTiddlerText("$:/state/speech-to-text/recording") === "yes",
				speechRecognitionConfirmed = true;
			if(!speechRecognitionRunning && recordingState) {
				// Prompt the user for microphone access
				speechRecognitionConfirmed = window.confirm("Do you want to start recording?");
				if(speechRecognitionConfirmed) {
					// Do something
					speechRecognitionRunning = true;
					console.log("recording started");
				}
			} else if(speechRecognitionRunning) {
				// Do something
				speechRecognitionRunning = false;
				console.log("recording ended");
			}
		}
	})
};

})();
