chrome.webNavigation.onCommitted.addListener(function(details) {
  chrome.storage.sync.get('namePairs', function(items) {
    var namePairs = items.namePairs;
    if (namePairs) {
      chrome.tabs.sendMessage(details.tabId, {namePairs: namePairs});
      console.log('Message sent: ', {namePairs: namePairs});
    }
  });
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
if (changeInfo.url) {
  chrome.tabs.sendMessage(tabId, {
    message: 'Tab updated',
    url: changeInfo.url
  });
}
});
