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
  });

  session.on('sessionDisconnected', function sessionDisconnected(event) {
    console.log('You were disconnected from the session.', event.reason);
  });

  session.on('signal:turn', (signal) => {
    publisher.publishAudio(signal.data == publisher.stream.name);
    chrome.extension.getBackgroundPage().console.log(`it's now ${signal.data}'s turn`)
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
          chrome.extension.getBackgroundPage().console.log(`I am ${speaker.toString()}`)
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
    let delta = 0;
    setInterval(() => {
      delta = (Date.now() - start);
      if (20000 * turn + 1000 >= delta && delta >= 20000 * turn) {
        session.signal({
          type: "turn",
          data: turn.toString()
        },
        function(error) {
          if (error) {
            console.log("signal error: " + error.message);
          } else {
            console.log(`signal ${turn}'s turn sent`);
            
          }
          turn += 1;
        }
        );
      }
    },1000)
  }).catch(function catchErr(error) {
    handleError(error);
    alert('Failed to get opentok sessionId and token. Make sure you have updated the config.js file.');
  });
}
