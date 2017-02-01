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
						console.log('%c Metal-Devtools Extension: (`highlightDOM`)\n', 'background: #222; color: #BADA55', err);
					}
				}
			);
		},
		onSelectedChange: id => {
			chrome.devtools.inspectedWindow.eval(
				`window.__METAL_DEV_TOOLS_HOOK__.selectComponent('${id}');`,
				(res, err) => {
					if (err) {
						console.log('%c Metal-Devtools Extension: (`selectComponent`)\n', 'background: #222; color: #BADA55', err);
					}
				}
			);
		},
		inspectDOM: id => {
			chrome.devtools.inspectedWindow.eval(
					`inspect(window.__METAL_DEV_TOOLS_HOOK__.getComponentNode('${id}'));`,
				(res, err) => {
					if (err) {
						console.log('%c Metal-Devtools Extension: (`getComponentNode`)\n', 'background: #222; color: #BADA55', err);
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
