import './panel.html';
import '../../../frontend/static';

import App from '../../../frontend/components/App';

const port = chrome.extension.connect({name: '' + chrome.devtools.inspectedWindow.tabId});

new App(
	{
		element: document.getElementById('container'),
		port
	}
);

port.postMessage('initialize');
