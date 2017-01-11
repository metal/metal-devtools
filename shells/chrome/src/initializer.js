function createHookObject(injectedWindow) {
	if (!injectedWindow.__METAL_DEV_TOOLS_HOOK__) {
		injectedWindow.__METAL_DEV_TOOLS_HOOK__ = {};
	}
}

const script = document.createElement('script');

script.textContent = ';(' + createHookObject.toString() + '(window))';

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
