# Speech-to-text-in-TW5
![License Badge](https://img.shields.io/badge/license-MIT-blue) [![release](https://img.shields.io/badge/release-latest-brightgreen)](https://github.com/flancast90/Speech-to-text-in-TW5/releases/latest) ![Repo size](https://img.shields.io/badge/size-1.5MB-orange)


### First Things First, Browser Support

The Speech-to-Text TW5 plugin works best in Chrome/Chromium environments, as well as in a Node.js TW in run in these same browsers. While still supported, optimal results cannot be guarunteed in iOS's Safari, Samsung Internet, or other mobile apps. Unfortunately, due to lack-of-API support, FireFox and Internet Explorer are not yet supported.

<br />

### Summary


Speech-to-Text-in-TW5, as the name implies, is a cutting-edge plugin for [Jermolene's TiddlyWiki5](https://github.com/jermolene/tiddlywiki5). The plugin adds the ability to create Tiddlers from just your computer microphone and voice! The speech-to-text plugin is also being updated all the time. Here are the release notes for each release so far, as well as what is planned for later updates!

<br />

### Releases/Version History

<details><summary>Coming Soon!</summary>
  <ul>
    <li>Activate Plugin from Editor Toolbar!</li>
    <li>various bug fixes and optimisation</li>
  </ul>
</details>
<details><summary>v1.0.5</summary>
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
    <li>In the Installation tiddler of the speech-to-text plugin page, drag the "Speech-to-text: Speech to Text for TW5" plugin box into your open <code>empty.html</code> instance, or open existing TiddlyWiki. You now have the plugin! ????</li>
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
    <li>Then, cd to myneweiki, and open the ``tiddlywiki.info`` file there. Insert the lines ``"Speech-To-Text-in-TW5/plugins/speech-to-text"`` inside the "plugins: [`` section.
    <br />
    <li>OPTIONAL: you may want to tell TiddlyWiki where the plugin will be found so you can store it in any folder. To do so, type <code>export TIDDLYWIKI_PLUGIN_PATH="$HOME/location_of_plugin"</code></li>
    <li>You then can install the latest version of the plugin via <a href="https://github.com/flancast90/Speech-To-Text-in-TW5/releases/latest/">This Link</a> as either a .zip or .tar.gz. *Make sure you extract the files to the location you specified in the last step!</li>
    <br />
    <li>That's it! ???? Launch your new wiki with the plugin using <code>tiddlywiki mynewwiki --listen</code></li> 
  </ol>
</details>

<br />

### Getting Started


The Speech-to-Text plugin for TW5 is near limitless in applications in TiddlyWiki. Just like Google Docs already supports, the plugin adds a button to the wiki sidebar so that you can speak into the Mic, and get a transcript of your conversation as a TiddlyWiki Tiddler!

**Starting the Plugin to Record**

To test it out, follow the install instructions above, or just test out a demo version at [speech-to-text.finnsoftware.net](https://speech-to-text.finnsoftware.net). Once loaded, you should see a Microphone button on the wiki sidebar. Click it, and when you see a "Recording Started", you know that it is listening. For any questions, refer to the image below:

![Recording Started](https://i.imgur.com/rhleClx.png)

<br />

**Stopping the Plugin from Recording**

To stop the plugin, you can click the Mic icon on the wiki sidebar again, or, since >= v1.0.4, you can say "Ok Wiki, stop listening". You will get a message that the "Recording Stopped", and the transcript will be added to a new Tiddler (see image).

![Recording stopped](https://i.imgur.com/XMqO2ud.png)

<br />

**Verbal Commands (v1.0.4 +)**

Since version 1.0.4, Speech-to-Text-for-TW5 has supported some kind of verbal command. These are keywords/phrases that can be spoken into the Mic when the plugin is running, to complete some action. 

For example, by saying "Ok wiki, stop listening", you can end the listening, the same action that would be taken by clicking the Mic button again. From v1.0.5, user-defined custom commands and keywords are supported. That means you could refactor the command process to understand different words; For example,
> "Ok Wiki" could be "Pasta Macaroni",
> and the word "Tiddler" could now create a new Tiddler in the Wiki instance

It should be noted that the verbal commands are not perfect: the plugin can always misunderstand a word, which will lead to commands not being recognized. At this time, the devs are working on a Dictionary of "sound-alike" words, so that even if the command is misunderstood, it has a higher chance of being recognized. You can help in this effort by logging failed commands, and the word that was misunderstood, and then sending this information to the devs in the form of a [New Issue](https://github.com/flancast90/Speech-To-Text-in-TW5/issues/new). 
Thank You!

**Note: There is currently a limitation on plugin command-words in that they cannot be the same as the keywords (eg OK Wiki or custom keywords)**

<br />

### License
<pre>
Copyright 2021 Finn Lancaster, Simon Huber, TonyM, collaborators, and the TiddlyWiki Community

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

End license text.
</pre>
