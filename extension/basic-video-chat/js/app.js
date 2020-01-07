/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

let start = Date.now();
var apiKey;
var sessionId;
var token;
var session;
var archiveID = -1;
var streamOn = false;
function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function stopArchive() { // eslint-disable-line no-unused-vars
  $.post(SAMPLE_SERVER_BASE_URL + '/archive/' + archiveID + '/stop');
}

function startArchive() { 
  if (!streamOn) {
    $.ajax({
      url: SAMPLE_SERVER_BASE_URL + '/archive/start',
      type: 'POST',
      contentType: 'application/json', // send as JSON
      data: JSON.stringify({'sessionId': sessionId}),
  
      complete: function complete() {
        // called when complete
        chrome.extension.getBackgroundPage().console.log('startArchive() complete!!');
      },
  
      success: function success() {
        // called when successful
        console.log('successfully called startArchive()');
      },
  
      error: function error() {
        // called when there is an error
        console.log('error calling startArchive()');
      }
    });
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  
  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('archiveStarted', function streamCreated(event) {
    archiveID = event.id;
    streamOn = true;
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  // initialize the publisher
  var publisherOptions = {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  var publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
    }
  });
}

// See the config.js file.
if (API_KEY && TOKEN && SESSION_ID) {
  apiKey = API_KEY;
  sessionId = SESSION_ID;
  token = TOKEN;
  initializeSession();
} else if (SAMPLE_SERVER_BASE_URL) {
  // Make an Ajax request to get the OpenTok API key, session ID, and token from the server
  fetch(SAMPLE_SERVER_BASE_URL + '/session').then(function fetch(res) {
    return res.json();
  }).then(function fetchJson(json) {
    apiKey = json.apiKey;
    sessionId = json.sessionId;
    token = json.token;

    document.getElementById("stopbutton").addEventListener("click",stopArchive)
    document.getElementById("startbutton").addEventListener("click",startArchive)
  
    initializeSession();
    let delta = 0;
    let streamOn = false;
    setInterval(() => {
      delta = (Date.now() - start);
      if (delta >= 310000) {
        document.getElementById("stopbutton").click()
        chrome.extension.getBackgroundPage().console.log('archiving stopped')
      } else if (!streamOn && delta >= 10000) {
        document.getElementById("startbutton").click()
        chrome.extension.getBackgroundPage().console.log("archiving started")
        streamOn = true;
      }
    },1000)
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
