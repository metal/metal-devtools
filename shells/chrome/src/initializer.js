import * as constants from '../../../shared/constants';

const installInitialHook = require('raw-loader!../../../injected/build/installInitialHook');

window.addEventListener('message', function({data}) {
	if (data.from === constants.METAL_DEVTOOLS_BACKEND) {
		chrome.extension.sendMessage(data.message);
	}
});

const script = document.createElement('script');

script.textContent = installInitialHook;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
