const processComponents =  require('raw-loader!../../../injected/build/processComponents');

window.addEventListener('message', function({data}) {
	if (data.from === 'backend') {
		chrome.extension.sendMessage(data.message);
	}
});

const script = document.createElement('script');

script.textContent = processComponents;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
