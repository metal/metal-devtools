import './devtools.html';

let panelCreated = false;

function createPanelIfMetalLoaded() {
	if (panelCreated) {
		return;
	}

	chrome.devtools.inspectedWindow.eval(
		`window.__METAL_DEV_TOOLS_HOOK__ && window.__METAL_DEV_TOOLS_HOOK__.hasComponents()`,
		(pageHasMetal) => {
			if (!pageHasMetal || panelCreated) {
				return;
			}

			clearInterval(loadCheckInterval);

			panelCreated = true;

			chrome.devtools.panels.create(
				'Metal.js',
				'',
				'build/panel.html',
				(panel) => {
					chrome.devtools.panels.elements.onSelectionChanged.addListener(function() {
						chrome.devtools.inspectedWindow.eval(
							'window.__METAL_DEV_TOOLS_HOOK__.setInspected($0);'
						);
					});

					panel.onShown.addListener(function() {
						chrome.devtools.inspectedWindow.eval(
							'window.__METAL_DEV_TOOLS_HOOK__.reloadRoots();'
						);
					});
				}
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
