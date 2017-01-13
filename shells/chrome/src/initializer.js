const installHook =  require('raw-loader!../../../injected/build/installHook');

const script = document.createElement('script');

script.textContent = installHook;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
