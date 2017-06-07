/**
 * Installs and runs the initial hook on the page. It binds the
 * listener for message passing between the extention and window.
 */

import * as constants from '../../../shared/constants';

const installInitialHook = require('raw-loader!../../../injected/build/installInitialHook'); // eslint-disable-line

window.addEventListener('message', function({data}) {
  if (data.from === constants.METAL_DEVTOOLS_BACKEND) {
    chrome.extension.sendMessage(data.message);
  }
});

const script = document.createElement('script');

script.textContent = installInitialHook;

document.documentElement.appendChild(script);

script.parentNode.removeChild(script);
