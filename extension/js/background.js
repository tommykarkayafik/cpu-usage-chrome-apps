chrome.browserAction.onClicked.addListener(function(){
  var newURL = "../basic-video-chat/index.html";
  chrome.tabs.create({ url: newURL}, (tab) => {
    chrome.processes.getProcessIdForTab(tab.id, procId => {
      let start = Date.now();
      chrome.processes.onUpdated.addListener((processes)=> {
        console.log((Date.now() - start) + ", " + processes[procId].cpu)
      })

    })
  })
});