function setupContextMenu() {
  chrome.contextMenus.create({
    id: 'add-number',
    title: 'Add',
    contexts: ['selection']
  });  
}

chrome.runtime.onInstalled.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((data, tab) => {
   chrome.sidePanel.open({ windowId: tab.windowId });

   //Waiting for load the sidepanel
    setTimeout(() => {
      chrome.runtime.sendMessage({
        name: 'add-number',
        data: { value: data.selectionText }
      });
    }, 100);

});
