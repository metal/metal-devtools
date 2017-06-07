/**
 * Handles message passing between devtools and the injected scripts.
 */

import * as constants from '../../../shared/constants';

import './popup.html';

chrome.runtime.onMessage.addListener((message, sender) => {
  if (message.type === constants.METAL_DETECTED && sender.tab) {
    chrome.browserAction.setIcon({
      path: {
        48: 'build/metal_48.png'
      },
      tabId: sender.tab.id
    });
  }
});

chrome.extension.onConnect.addListener(port => {
  chrome.extension.onMessage.addListener((message, sender) => {
    if (port.name === sender.tab.id.toString()) {
      port.postMessage(message);
    }
  });

  port.onMessage.addListener(({type}) => {
    if (type === 'initialize') {
      chrome.tabs.executeScript(Number(port.name), {
        file: './build/contentScript.js'
      });
    }
  });
});
