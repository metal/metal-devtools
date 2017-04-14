const installInitialHook = require('raw-loader!../../../injected/build/installInitialHook');

const script = document.createElement('script');

script.textContent = installInitialHook;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
