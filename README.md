# cpu-usage-chrome-apps

This repository features basic chrome apps - based on the OpenTok samples, which measure CPU usage in different situations.

This repo contains:

* "extension" folder - this is the folder one should choose when uploading the folder as an unpacked chrome app.
  * Said folder contains the "manifest.json" file. Since these chrome apps were only meant to be used once or twice (and thus were built as prototypes and not meant for repeated usage), the manifest will need to change according to one's session. (specifically the CSP and in it, "mantis" URLs)
* A simple python script which takes logs as they are downloaded from the Chrome app's chrome background page and outputs header-less csv files.

Note that all logs are indeed printed in the backgrod page's console. If one logs using `console.log()` from the app itself, the message will not go to the background page's console, and so you must use `chrome.extension.getBackgroundPage().console.log()`. logs in the bckground script should use `console.log()`

In order for the apps to work, one must configure the sessions' / server's details in the config.js file - exactly as done in the OT sample apps.
