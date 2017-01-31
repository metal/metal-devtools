import './popup.html';

chrome.extension.onConnect.addListener(port => {
	chrome.extension.onMessage.addListener((message, sender) => {
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
