chrome.browserAction.onClicked.addListener(function(){
  var newURL = "../basic-video-chat/index.html";
  var SAMPLE_SERVER_BASE_URL = 'https://tokbox-basic-chat-server.herokuapp.com';
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