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
	$tw.wiki.addEventListener("change",function(changes) {
		if(changes["$:/state/speech-to-text/recording"]) {
			var recordingState = $tw.wiki.getTiddlerText("$:/state/speech-to-text/recording") === "yes";
			console.log(recordingState);
            Speech_to_Text();
		}
	})
};

function Speech_to_Text(){

// required for API to initialise
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;
var recognition = new SpeechRecognition();
            
// This runs when the speech recognition service starts
recognition.onstart = function() {
	// What is the best way to alert the user of 
	// Mic recording? Put either dropdown, alert, etc.
	// here for that functionality.

    // do something when recording starts
    
    // WE WANT TO CHANGE THE BUTTON COLOUR HERE, AS OPPOSED TO ON BUTTON CLICK
};

recognition.onspeechend = function() {
    // when user is done speaking
    recognition.stop();
    
    // What is the best way to alert the user of 
    // Mic-stopped recording? Use that method here.
    
    // WE WANT TO CHANGE BUTTON COLOUR BACK TO BLACK HERE
}
              
// We will grab the transcripts, and console.log
// the confidence here.
recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    
    // This is what the user will see: the transcript of what they 		// said out-loud. We want to display this somehow in TW.
    
    // WE WANT TO DISPLAY THE OUTPUT (saved in var transcript) IN TW5
    
    var confidence = event.results[0][0].confidence;
    console.log(confidence);
};
              
// when all Mic functions initialised, we will finally start listening.
recognition.start();


}

})();
