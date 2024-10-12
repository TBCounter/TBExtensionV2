import { ref } from 'vue';
import { CookieData } from 'src/types';

export function useGrabCookies() {
  const currentTabID = ref();
  const currentTabURL = ref();
  const cookiesData = ref<CookieData>({
    cookieyesID: '',
    log_cookie: '',
    PTBHSSID: '',
  });

  async function grabCookies() {
    // Обернем chrome.tabs.query в промис
    const tab = await new Promise<chrome.tabs.Tab[]>((resolve) => {
      chrome.tabs.query({ active: true, lastFocusedWindow: true }, (tabs) =>
        resolve(tabs)
      );
    });

    currentTabID.value = tab[0].id;
    currentTabURL.value = tab[0].url;

    // Функция для получения cookie через промис
    const getCookie = (url: string, name: string) => {
      return new Promise<chrome.cookies.Cookie | null>((resolve) => {
        chrome.cookies.get({ url, name }, (cookie) => resolve(cookie));
      });
    };

    // Используем await для получения каждого cookie
    const cookieyesID = await getCookie(
      'https://totalbattle.com/',
      'cookieyesID'
    );
    const log_cookie = await getCookie(
      'https://totalbattle.com/',
      'log_cookie'
    );
    const PTBHSSID = await getCookie('https://totalbattle.com/', 'PTBHSSID');

    if (cookieyesID) cookiesData.value.cookieyesID = cookieyesID.value;
    if (log_cookie) cookiesData.value.log_cookie = log_cookie.value;
    if (PTBHSSID) cookiesData.value.PTBHSSID = PTBHSSID.value;

    return cookiesData.value;
  }

  return { grabCookies, cookiesData };
}
