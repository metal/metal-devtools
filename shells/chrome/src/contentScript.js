const installRootManagerHook = require('raw-loader!../../../injected/build/installRootManagerHook'); // eslint-disable-line

const script = document.createElement('script');

script.textContent = installRootManagerHook;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
