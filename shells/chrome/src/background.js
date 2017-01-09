import './popup.html';

chrome.extension.onConnect.addListener(function(port) {
	chrome.extension.onMessage.addListener(function (message) {
			port.postMessage(message);
	});
});
