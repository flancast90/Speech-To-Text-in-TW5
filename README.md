# Speech-to-text-in-TW5
![License Badge](https://img.shields.io/badge/license-MIT-blue) [![release](https://img.shields.io/badge/release-latest-brightgreen)](https://github.com/flancast90/Speech-to-text-in-TW5/releases/latest) ![Repo size](https://img.shields.io/badge/size-1.3MB-orange)

### Summary


Speech-to-Text-in-TW5, as the name implies, is a cutting-edge plugin for [Jermolene's TiddlyWiki5](https://github.com/jermolene/tiddlywiki5). The plugin adds the ability to create Tiddlers from just your computer microphone and voice! The speech-to-text plugin is also being updated all the time. Here are the release notes for each release so far, as well as what is planned for later updates!

<br />

### Releases/Version History


<details><summary>Coming Soon!</summary>
  <ul>
  	<li>Custom Verbal Commands: define command word and action!</li>
    <li>Better UI: minor edits for after recording stopped with command</li>
    <li>Language auto-detection: language defaults to whatever language TW is in!</li>
    <li>language switch: change plugin language with TW built-in-languages</li>
  </ul>
</details>
<details><summary>v1.0.4</summary>
  <ul>
  	<li>Support for language change</li>
    <li>Verbal commands, starting with "command"</li>
    <li>Safari on iOS support tested</li>
  </ul>
</details>
<details><summary>v1.0.3</summary>
  <ul>
  	<li>Keyboard shortcut! Alt+Shift+R to start recording!</li>
  </ul>
</details>
<details><summary>v1.0.2</summary>
  <ul>
  	<li>BUG FIXES: plugin no longer stops listening after pause.</li>
  </ul>
</details>
<details><summary>v1.0.1</summary>
  <ul>
  	<li>Code Cleanup and minor UI edits.</li>
  </ul>
</details>
<details><summary>v1.0.0</summary>
  <ul>
  	<li>Minimal Implementation. First Release!</li>
  </ul>
</details>

<br />

### Install


<details><summary>Browser</summary>
  <ol>
    <li>Install an <code>empty.html</code> from <a href="https://www.tiddlywiki.com">tiddlywiki.com, or use your own existing TiddlyWiki</a></li>
    <br />
    <li>Go to <a href="https://speech-to-text.finnsoftware.net">speech-to-text.finnsoftware.net</a>, the plugin homepage</li>
    <br />
    <li>In the Installation tiddler of the speech-to-text plugin page, drag the "Speech-to-text: Speech to Text for TW5" plugin box into your open <code>empty.html</code> instance, or open existing TiddlyWiki. You now have the plugin! 🎉</li>
  </ol>
</details>


<details><summary>Node.js</summary>
  <ol>
    <li>Install Node.js and NPM (Node Package Manager) from <a href="https://nodejs.org/en/download/">these instructions</a></a></li>
    <br />
    <li>In your terminal, type: <code>npm install -g tiddlywiki</code></li>
    <br />
    <li>In your terminal again, create a new wiki with <code>tiddlywiki mynewwiki --init server</code></li>
    <br />
    <li>OPTIONAL: you may want to tell TiddlyWiki where the plugin will be found so you can store it in any folder. To do so, type <code>export TIDDLYWIKI_PLUGIN_PATH="$HOME/location_of_plugin"</code></li>
    <li>You then can install the latest version of the plugin via <a href="https://github.com/flancast90/Speech-To-Text-in-TW5/releases/latest/">This Link</a> as either a .zip or .tar.gz. *Make sure you extract the files to the location you specified in the last step!</li>
    <br />
    <li>That's it! 🎉 Launch your new wiki with the plugin using <code>tiddlywiki mynewwiki --listen</code></li> 
  </ol>
</details>



<br />

### License
<pre>
Copyright 2021 Finn Lancaster, Simon Huber, TonyM, collaborators, and the TiddlyWiki Community

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

End license text.
</pre>
