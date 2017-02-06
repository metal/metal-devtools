import './panel.html';
import '../../../frontend/static';

import App from '../../../frontend/components/App';

const port = chrome.extension.connect({name: '' + chrome.devtools.inspectedWindow.tabId});

const app = new App(
	{
		element: document.getElementById('container'),
		highlightDOM: id => {
			chrome.devtools.inspectedWindow.eval(
				`window.__METAL_DEV_TOOLS_HOOK__.highlightNode('${id}');`,
				(res, err) => {
					if (err) {
						console.log('%c metal-devtools extension: (`highlightDOM`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
					}
				}
			);
		},
		onSelectedChange: id => {
			chrome.devtools.inspectedWindow.eval(
				`window.__METAL_DEV_TOOLS_HOOK__.selectComponent('${id}');`,
				(res, err) => {
					if (err) {
						console.log('%c metal-devtools extension: (`selectComponent`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
					}
				}
			);
		},
		inspectDOM: id => {
			chrome.devtools.inspectedWindow.eval(
					`inspect(window.__METAL_DEV_TOOLS_HOOK__.getComponentNode('${id}'));`,
				(res, err) => {
					if (err) {
						console.log('%c metal-devtools extension: (`getComponentNode`)\n', 'background: rgb(136, 18, 128); color: #DDD', err);
					}
				}
			);
		},
		port
	}
);

chrome.devtools.network.onNavigated.addListener(() => {
	app.resetRoots();
	port.postMessage({type: 'initialize'});
});

port.postMessage({type: 'initialize'});
