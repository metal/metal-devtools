// Listen for messages to the window, and then send them to the background script

window.addEventListener('message', function(event) {
	chrome.extension.sendMessage(event.data);
});

// Create hook method and attach to window

const metalHook =  require('./injected').default;

const script = document.createElement('script');

script.textContent = ';(' + metalHook.toString() + '(window))';

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
