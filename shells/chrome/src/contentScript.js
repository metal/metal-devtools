const installRootManagerHook = require('raw-loader!../../../injected/build/installRootManagerHook');

window.addEventListener('message', function({data}) {
	if (data.from === 'backend') {
		chrome.extension.sendMessage(data.message);
	}
});

const script = document.createElement('script');

script.textContent = installRootManagerHook;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
