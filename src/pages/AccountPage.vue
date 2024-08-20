<template>
  <q-page class="column items-center">
    <h4 class="q-ma-md">
      {{ userStore.accounts?.find(el => el.id === parseInt($route.params.id as string))?.name }}
    </h4>
    <div>
      <q-btn @click="runCookiesAccount"> Start counting! </q-btn>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useGrabCookies } from '../utils'
import { useUser } from 'src/stores/user';
import { runAccount } from '../api'
import { useRoute } from 'vue-router';

const userStore = useUser()
const cookies = useGrabCookies()
const route = useRoute()

async function runCookiesAccount() {
  cookies.grabCookies()
  await runAccount({ accountId: route.params.id as string, url: 'https://totalbattle.com/', cookie: cookies.cookiesData.value })
}

</script>
