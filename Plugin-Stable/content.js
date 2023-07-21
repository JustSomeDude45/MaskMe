document.addEventListener("DOMContentLoaded", function(){
  const currentlyModifying = new Set();

  function replaceText(node, realName, fakeName) {
    if (node.nodeType === Node.TEXT_NODE) {
      if (node.textContent && !currentlyModifying.has(node) && node.textContent.toLowerCase().includes(realName.toLowerCase())) {
        currentlyModifying.add(node);
        var regex = new RegExp(realName, 'gi');
        node.textContent = node.textContent.replace(regex, fakeName);
        currentlyModifying.delete(node);
      }
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        replaceText(node.childNodes[i], realName, fakeName);
      }
    }
  }

  function replaceNames(realName, fakeName) {
    let treeWalker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;

    while (node = treeWalker.nextNode()) {
      replaceText(node, realName, fakeName);
    }
  }

  function replaceTitle(realName, fakeName) {
    var title = document.title;
    var regex = new RegExp(realName, 'gi');
    var newTitle = title.replace(regex, fakeName);
    if (newTitle !== title) {
      chrome.runtime.sendMessage({newTitle: newTitle});
    }
  }

  function handleNamePairs(namePairs) {
    if (namePairs && namePairs.length > 0) {
      namePairs.forEach(pair => {
        replaceNames(pair.realName, pair.fakeName);
        replaceTitle(pair.realName, pair.fakeName);
      });
    }
  }

  chrome.storage.sync.get('namePairs', function(items) {
    handleNamePairs(items.namePairs);
  });

  // Use a MutationObserver to handle dynamic content
  var observer = new MutationObserver(function(mutations) {
    mutations.forEach((mutation) => {
      let target = mutation.target;
      if (target.nodeType === Node.TEXT_NODE) {
        target = target.parentNode;
      }
      if (target && target.closest && !target.closest('.textArea-2CLwUE.textAreaSlate-9-y-k2.slateContainer-3x9zil') && document.activeElement !== target) {
        setTimeout(() => {
          chrome.storage.sync.get('namePairs', function(items) {
            handleNamePairs(items.namePairs);
          });
        }, 0);
      }
    });
  });

  // Configuration of the observer
  var config = { childList: true, subtree: true };

  // Start observing the document body initially
  observer.observe(document.body, config);
});
