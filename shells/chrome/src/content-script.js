const metalHook =  require('../../../backend/installGlobalHook').default;

window.addEventListener('message', function(event) {
	chrome.extension.sendMessage(event.data);
});

const script = document.createElement('script');

script.textContent = ';(' + metalHook.toString() + '(window))';

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
