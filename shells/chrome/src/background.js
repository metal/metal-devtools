import './popup.html';

chrome.extension.onConnect.addListener(function(port) {
	chrome.extension.onMessage.addListener(function (message, sender) {
		if (port.name === sender.tab.id.toString()) {
			port.postMessage(message);
		}
	});

	port.onMessage.addListener(
		({type}) => {
			if (type === 'initialize') {
				chrome.tabs.executeScript(
					Number(port.name),
					{file: './build/contentScript.js'}
				);
			}
		}
	);
});
