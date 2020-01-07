/* global OT API_KEY TOKEN SESSION_ID SAMPLE_SERVER_BASE_URL */

var start = Date.now();
var apiKey;
var sessionId;
var token;
var session;
var publisher;
var speaker = 1;
var turn = 1;
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

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  
  // Subscribe to a newly created stream
  session.on('streamCreated', function streamCreated(event) {
    var subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    var sub = session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
    speaker = Math.max(Number.parseInt(sub.stream.name) + 1, speaker);
    console.log(speaker)
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  session.on('signal:turn', (signal) => {
    publisher.publishAudio(signal.data == publisher.stream.name);
    console.log(`signal ${signal.data} recieved`)
  })

  // Connect to the session
  session.connect(token, function callback(error) {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      setTimeout(() => {
          // initialize the publisher
          var publisherOptions = {
            insertMode: 'append',
            width: '100%',
            height: '100%',
            name: speaker.toString()
          };
          publisher = OT.initPublisher('publisher', publisherOptions, handleError);
          session.publish(publisher, handleError);
        },5000)
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
  
    initializeSession();
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
