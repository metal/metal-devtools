// Listens for connection from App.js
// Then listens for message from content-script and posts message to App.js

chrome.extension.onConnect.addListener(function(port) {
	chrome.extension.onMessage.addListener(function (message) {
			port.postMessage(message);
	});
});
