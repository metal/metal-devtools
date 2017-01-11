import './devtools.html';

let panelCreated = false;

function createPanelIfMetalLoaded() {
	if (panelCreated) {
		return;
	}

	chrome.devtools.inspectedWindow.eval(
		`!!(Object.keys(window.__METAL_DEV_TOOLS_HOOK__.rootComponents).length)`,
		function(pageHasMetal) {
			if (!pageHasMetal || panelCreated) {
				return;
			}

			clearInterval(loadCheckInterval);

			panelCreated = true;

			chrome.devtools.panels.create(
				'Metal.js',
				'',
				'build/panel.html',
				function() {}
			);
		}
	);
}

chrome.devtools.network.onNavigated.addListener(function() {
	createPanelIfMetalLoaded();
});

const loadCheckInterval = setInterval(
	function() {
		createPanelIfMetalLoaded();
	},
	1000
);

createPanelIfMetalLoaded();
