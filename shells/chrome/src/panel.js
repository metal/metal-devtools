import './panel.html';
import '../../../frontend/static';

import App from '../../../frontend/components/App';

new App(
	{
		element: document.getElementById('container'),
		port: chrome.extension.connect({name: 'metal-devtools'})
	}
);
