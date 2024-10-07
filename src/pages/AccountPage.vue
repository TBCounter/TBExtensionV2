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
    <CounterDescription class="q-ma-md" :chest-statuses="chestStatusesMock" />
    <div v-if="accountInfo?.session && Object.keys(accountInfo.session).length > 0">
      Current run
      <CounterBar class="q-ma-md" :chest-statuses="accountInfo.session" />
    </div>

    <div>
      Previous runs
      <div v-for="status in prevStatuses" :key="status._id">

        <CounterBar class="q-ma-md" :chest-statuses="status.chestStatusCounts" />
      </div>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useGrabCookies } from '../utils'
import { useUser } from 'src/stores/user';
import { getSessions, runAccount } from '../api'
import { useRoute } from 'vue-router';
import { computed, onMounted, ref } from 'vue';
import { ChestStatuses, SessionStatus } from 'src/types';

import CounterBar from 'src/components/CounterBar.vue';
import CounterDescription from 'src/components/CounterDescription.vue';

const prevStatuses = ref<SessionStatus[]>([])

const chestStatusesMock = {
  CREATED: 0,
  ERROR: 0,
  PROCESSED: 0,
  PROCESSING: 0,
  UPLOADED: 0,
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


onMounted(async () => {
  await getSessions(route.params.id as string).then((response) => {
    prevStatuses.value = response.data

  })
})

</script>
