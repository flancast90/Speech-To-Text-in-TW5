/* Let's make a simple UI to demonstrate the use of the TW5 speech-to-text function */
window.onload = function() {
	document.body.innerHTML += `
	<button onclick="Speech_to_Text()" id="status-btn">Click to Record ...</button>

	<p id="output"></p>
	`
}

/*
 * Global variable declarations.
*/

statusBtn = document.getElementById('status-btn');

/* Speech to text function. */
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
    statusBtn.innerHTML = `Recording ...`
};

recognition.onspeechend = function() {
    // when user is done speaking
    recognition.stop();
    
    // What is the best way to alert the user of 
    // Mic-stopped recording? Use that method here.
    statusBtn.innerHTML = `Click to Record ...`
}
              
// We will grab the transcripts, and console.log
// the confidence here.
recognition.onresult = function(event) {
    var transcript = event.results[0][0].transcript;
    
    // This is what the user will see: the transcript of what they 		// said out-loud. We want to display this somehow in TW.
    document.getElementById('output').innerHTML = `<p style="font-size:1.2em; display:inline; font-weight:bold;">Output:</p>`+`<p style="display:inline;"> `+transcript+`</p>`;
    
    var confidence = event.results[0][0].confidence;
    console.log(confidence);
};
              
// when all Mic functions initialised, we will finally start listening.
recognition.start();

// we may also want to detect when a user doesn't allow Mic access.
// the try/catch loop will serve this purpose.
}
