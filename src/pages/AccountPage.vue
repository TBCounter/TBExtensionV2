<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="accountInfo?.name" icon="person" />
      </q-breadcrumbs>
    </div>
    <div class="row justify-center">
      <q-btn @click="runCookiesAccount"> {{ $t('account.start') }} </q-btn>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useGrabCookies } from '../utils'
import { useUser } from 'src/stores/user';
import { runAccount } from '../api'
import { useRoute } from 'vue-router';
import { computed } from 'vue';

const userStore = useUser()
const cookies = useGrabCookies()
const route = useRoute()

const accountInfo = computed(() => {
  return userStore.accounts?.find((el) => el.id === route.params.id)
})

async function runCookiesAccount() {
  cookies.grabCookies()
  await runAccount({ accountId: route.params.id as string, url: 'https://totalbattle.com/', cookie: cookies.cookiesData.value })
}

</script>
