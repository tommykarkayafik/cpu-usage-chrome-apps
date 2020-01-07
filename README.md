# cpu-usage-chrome-apps

This repository features basic chrome apps - based on the OpenTok samples, which measure CPU usage in different situations.

**In this branch there are two folders - the master and the slave. The master sends signals to all users in the call and also recieves signals if sent, while the slave only recieves. Thus there should be only one master used in a multiple user test using this branch's code**

This repo contains:

* "extension" folder - this is the folder one should choose when uploading the folder as an unpacked chrome app.
  * Said folder contains the "manifest.json" file. Since these chrome apps were only meant to be used once or twice (and thus were built as prototypes and not meant for repeated usage), the manifest will need to change according to one's session. (specifically the CSP and in it, "mantis" URLs)
* A simple python script which takes logs as they are downloaded from the Chrome app's chrome background page and outputs header-less csv files.

Note that all logs are indeed printed in the backgrod page's console. If one logs using `console.log()` from the app itself, the message will not go to the background page's console, and so you must use `chrome.extension.getBackgroundPage().console.log()`. logs in the bckground script should use `console.log()`

In order for the apps to work, one must configure the sessions' / server's details in the config.js file - exactly as done in the OT sample apps.



## Audio-mute

This branch features an app which changes speaker every 20 seconds. (0-20 secs is a free-for-all, 20-40 user 1 speaks, 40-60 - user 2) All of the rest do not publish audio at all. Note that the turn counter countinues to count even if it surpasses the number of users (purpose - to also check what happens where there isn't any audio).

The number of seconds between switching is determined in the app.js file of the master app (specifically in `setInterval()` in line 88 - currently it's 20000).