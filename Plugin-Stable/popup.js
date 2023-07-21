function updateTabLabels() {
    var tabs = Array.from(document.getElementsByClassName('tab'));
    tabs.forEach((tab, index) => {
      tab.textContent = 'Set ' + (index + 1);
    });
  }
  
  function deleteTabAndNameSet(index) {
    var tabs = Array.from(document.getElementsByClassName('tab'));
    var nameSets = Array.from(document.getElementsByClassName('name-set'));
    tabs[index].remove();
    nameSets[index].remove();
    if (tabs[index] && tabs[index].classList.contains('active')) {
      var newIndex = index === 0 ? 0 : index - 1;
      tabs[newIndex] && tabs[newIndex].classList.add('active');
      nameSets[newIndex] && nameSets[newIndex].classList.add('active');
    }
    updateTabLabels();
  }
  
  function deleteActiveTabAndNameSet() {
    var activeTabIndex = Array.from(document.getElementsByClassName('tab')).findIndex(tab => tab.classList.contains('active'));
    if (activeTabIndex !== -1) {
      deleteTabAndNameSet(activeTabIndex);
      saveNameSets();
    }
  }
  
  function addTab(index) {
    var tab = document.createElement('div');
    tab.className = 'tab';
    tab.textContent = 'Set ' + (index + 1);
    tab.onclick = function() {
      document.getElementsByClassName('tab active')[0].classList.remove('active');
      tab.classList.add('active');
      document.getElementsByClassName('name-set active')[0].classList.remove('active');
      document.getElementsByClassName('name-set')[index].classList.add('active');
    };
    document.getElementById('tabs').appendChild(tab);
    return tab;
  }
  
  function addNameSet(realName, fakeName) {
    var nameSetDiv = document.createElement('div');
    nameSetDiv.className = 'name-set';
    nameSetDiv.innerHTML = `
      <label for="realName">Real Name:</label><br>
      <input type="text" class="realName" name="realName" value="${realName || ''}"><br>
      <label for="fakeName">Fake Name:</label><br>
      <input type="text" class="fakeName" name="fakeName" value="${fakeName || ''}"><br>
    `;
    document.getElementById('nameSets').appendChild(nameSetDiv);
    return nameSetDiv;
  }
  
  function saveNameSets() {
    var nameSets = Array.from(document.getElementsByClassName('name-set'));
    var namePairs = nameSets.map(nameSet => ({
      realName: nameSet.getElementsByClassName('realName')[0].value,
      fakeName: nameSet.getElementsByClassName('fakeName')[0].value,
    }));
    chrome.storage.sync.set({'namePairs': namePairs}, function() {
      console.log('Names saved');
    });
  }
  
  document.getElementById('addButton').onclick = function() {
    var nameSetDiv = addNameSet();
    var tab = addTab(document.getElementsByClassName('name-set').length - 1);
    if (document.getElementsByClassName('name-set').length === 1) {
      nameSetDiv.classList.add('active');
      tab.classList.add('active');
    }
  }
  
  document.getElementById('saveButton').onclick = saveNameSets;
  
  document.getElementById('deleteButton').onclick = function() {
    document.getElementById('confirmDeleteDialog').style.display = 'block';
  }
  
  document.getElementById('confirmDeleteButton').onclick = function() {
    deleteActiveTabAndNameSet();
    document.getElementById('confirmDeleteDialog').style.display = 'none';
  }
  
  document.getElementById('cancelDeleteButton').onclick = function() {
    document.getElementById('confirmDeleteDialog').style.display = 'none';
  }
  
  chrome.storage.sync.get('namePairs', function(items) {
    var namePairs = items.namePairs;
    if (namePairs && namePairs.length > 0) {
      namePairs.forEach(pair => {
        var nameSetDiv = addNameSet(pair.realName, pair.fakeName);
        var tab = addTab(document.getElementsByClassName('name-set').length - 1);
        if (!document.getElementsByClassName('name-set active').length) {
          nameSetDiv.classList.add('active');
          tab.classList.add('active');
        }
      });
    } else {
      document.getElementById('addButton').click();
    }
  });
  