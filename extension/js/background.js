chrome.browserAction.onClicked.addListener(function(){
  var newURL = "../basic-video-chat/index.html";
  chrome.tabs.create({ url: newURL}, (tab) => {
    chrome.processes.getProcessIdForTab(tab.id, procId => {
      let start = Date.now();
      let delta = 0;
      chrome.processes.onUpdated.addListener((processes)=> {
        delta = (Date.now() - start);
        console.log( delta + ", " + processes[procId].cpu)
      })
    })
  })
});