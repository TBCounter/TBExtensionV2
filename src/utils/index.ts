import { ref } from 'vue';
import { CookieData } from 'src/types';


export function useGrabCookies() {
  const currentTabID = ref();
  const currentTabURL = ref();
  const cookiesData = ref<CookieData>({
    cookieyesID: '',
    log_cookie: '',
    PTBHSSID: ''
  });

  function grabCookies() {

    chrome.tabs.query(
      {
        active: true,
        lastFocusedWindow: true
      },
      function (tabs) {
        currentTabID.value = tabs[0].id;
        currentTabURL.value = tabs[0].url

      }
    );


    chrome.cookies.get({
      url: 'https://totalbattle.com/',
      name: 'cookieyesID',
    }, function (cookie) {
      if (!cookie) return
      cookiesData.value['cookieyesID'] = cookie.value


    })
    chrome.cookies.get({
      url: 'https://totalbattle.com/',
      name: 'log_cookie',
    }, (cookie) => {
      if (!cookie) return
      cookiesData.value['log_cookie'] = cookie.value

    })
    chrome.cookies.get({
      url: 'https://totalbattle.com/',
      name: 'PTBHSSID',
    }, (cookie) => {
      if (!cookie) return
      cookiesData.value['PTBHSSID'] = cookie.value

    })

  }
  return { grabCookies, cookiesData }
}
