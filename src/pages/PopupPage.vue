<template>
  <div>
    <q-btn @click="grabCookies">grab!</q-btn>
    <div>{{ cookiesData }}</div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';


type CookieData = {
  cookieyesID: string,
  log_cookie: string,
  PTBHSSID: string
}

const cookiesData = ref<CookieData>({
  cookieyesID: '',
  log_cookie: '',
  PTBHSSID: ''
});

const currentTabID = ref();
const currentTabURL = ref();


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

</script>
