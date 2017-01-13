const processComponents =  require('raw-loader!../../../injected/build/processComponents');

window.addEventListener('message', function(event) {
	chrome.extension.sendMessage(event.data);
});

const script = document.createElement('script');

script.textContent = processComponents;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
