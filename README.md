**Collaborators:** The ``Speech-to-Text-for-TW5.js`` contains the base JS code to be converted to a plugin, specifically inside the ``Speech_to_Text()`` function. Over the next few days, I will be adding a few other things, such as detection of denial to access Mic, etc. The file also contains a VERY SIMPLE UI. Feel free to modify it/develop your own for the actual plugin UI, and please keep everyone informed of progress by periodically uploading the plugin code to this repo.

<br />
<br />

### First-Things-First: Browser Support.
The in-progress Speech-to-text plugin for TW5 has been decided to use the [Web-Speech API](https://www.google.com/intl/en/chrome/demos/speech.html). According to [Dev.Mozilla.Org](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), this API is limited in support as of right now to ONLY the Edge, Chrome, and Safari browsers.

<br />

An MarkDown rendition of the support chart is given below

<br />

**Web (Computer)**
|Chrome|Edge|FireFox|IE|Opera|Safari|
|------|----|-------|--|-----|------|
|33|18|49|NO|21|7|

**Mobile**
|WebView Android|Chrome Android|FireFox for Android|Opera Android|Safari on iOS|SamSung Internet|
|---------------|--------------|-------------------|-------------|-------------|----------------|
|NO|33|62|NO|7|3.0|

### 


### License
Copyright 2021 Finn Lancaster, Simon Huber, TonyM, collaborators, and the TiddlyWiki Community
``
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

End license text.``
