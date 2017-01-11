import './panel.html';
import '../../../frontend/static';

import App from '../../../frontend/components/App';

const port = chrome.extension.connect({name: '' + chrome.devtools.inspectedWindow.tabId});

const app = new App(
	{
		element: document.getElementById('container'),
		network: chrome.devtools.network,
		port
	}
);

chrome.devtools.network.onNavigated.addListener(function() {
	app.resetRoots();
	port.postMessage('initialize');
});

port.postMessage('initialize');
