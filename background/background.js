import { getVideoId } from "../content-script/util/youTube";
console.log('background script ======');

let videoId = null;
let mounted = false;

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  console.log('testing tab update =====', tab.url);
  if (changeInfo.status === 'complete' && tab.url.includes('youtube.')) {
    videoId = getVideoId(tab.url);
    console.log('get video id =====', videoId);
    if (videoId && mounted) {
      chrome.tabs.sendMessage(tabId, { type: 'videoId', data: videoId });
    }
  }
});

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.type === 'contentScriptMounted') {
    console.log('content script mounted!!!!!! ', videoId);
    mounted = true;
    // Wait for the content script to finish rendering before sending the videoId message
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, { type: 'videoId', data: videoId });
    });
  }
});