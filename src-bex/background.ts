import { bexBackground } from 'quasar/wrappers';

// function openExtension () {
//   chrome.tabs.create(
//     {
//       url: chrome.runtime.getURL('www/index.html')
//     },
//     (/* newTab */) => {
//       // Tab opened.
//     }
//   );
// }

// chrome.runtime.onInstalled.addListener(openExtension);
// chrome.action.onClicked.addListener(openExtension);

declare module '@quasar/app-vite' {
  interface BexEventMap {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    log: [{ message: string; data?: any[] }, never];
    getTime: [never, number];

    'storage.get': [{ key: string | null }, any];
    'storage.set': [{ key: string; value: any }, any];
    'storage.remove': [{ key: string }, any];
    /* eslint-enable @typescript-eslint/no-explicit-any */
  }
}

export default bexBackground((bridge /* , allActiveConnections */) => {
  bridge.on('storage.get', ({ data, respond }) => {
    const { key } = data;
    if (key === null) {
      chrome.storage.sync.get(null, (items) => {
        // Group the values up into an array to take advantage of the bridge's chunk splitting.
        respond(Object.values(items));
      });
    } else {
      chrome.storage.sync.get([key], (items) => {
        respond(items[key]);
      });
    }
  });
  // Usage:
  // const { data } = await bridge.send('storage.get', { key: 'someKey' })

  bridge.on('storage.set', ({ data, respond }) => {
    chrome.storage.sync.set({ [data.key]: data.value }, () => {
      respond();
    });
  });
  // Usage:
  // await bridge.send('storage.set', { key: 'someKey', value: 'someValue' })

  
  chrome.sidePanel.setOptions({
    path: 'www/index.html#/',
    enabled: true,
  });

  chrome.storage.sync.get('sidePanelActive', (items) => {
    chrome.sidePanel
      .setPanelBehavior({ openPanelOnActionClick: items['sidePanelActive'] })
      .catch((error) => console.error(error));
  });
});
