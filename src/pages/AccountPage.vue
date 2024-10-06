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
    <div>
      <CounterDescription class="q-ma-md" :chest-statuses="chestStatusesMock" />
      <CounterBar class="q-ma-md" :chest-statuses="chestStatusesMock"></CounterBar>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useGrabCookies } from '../utils'
import { useUser } from 'src/stores/user';
import { runAccount } from '../api'
import { useRoute } from 'vue-router';
import { computed } from 'vue';
import { ChestStatuses } from 'src/types';

import CounterBar from 'src/components/CounterBar.vue';
import CounterDescription from 'src/components/CounterDescription.vue';


const chestStatusesMock = {
  CREATED: 2,
  ERROR: 3,
  PROCESSED: 3,
  PROCESSING: 1,
  UPLOADED: 10,
} as ChestStatuses

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
