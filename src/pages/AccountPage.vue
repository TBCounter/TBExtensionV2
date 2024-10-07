<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="accountInfo?.name" icon="person" />
        <q-badge class="q-ml-lg" v-if="accountInfo?.logs?.length">
          {{ accountInfo.logs.at(-1)?.message }}
        </q-badge>
      </q-breadcrumbs>
    </div>
    <div class="row justify-center">
      <q-btn :disabled="accountInfo?.logs?.length || !userStore.nodeStatus.idle" @click="runCookiesAccount"> {{
        $t('account.start') }} </q-btn>
      <q-btn class="q-ml-md" @click="isSelectDatesForChestsDialogOpened = true">{{ $t('account.download') }}</q-btn>
      <q-dialog seamless v-model="isSelectDatesForChestsDialogOpened">
        <q-card>
          <q-card-section>
            <div class="text-h6">{{ $t('account.selectDates') }}</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pa-none">
            <q-date minimal v-model="selectDatesForChests" range />
          </q-card-section>

          <q-card-actions align="right">
            <q-btn flat label="OK" @click="downloadChests" color="primary" v-close-popup />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>

    <CounterDescription class="q-ma-md" :chest-statuses="chestStatusesMock" />

    <div v-if="(accountInfo?.session && Object.keys(accountInfo.session).length > 0)">
      <div class="q-ml-md q-mb-lg">{{ $t('account.currentRun') }}</div>
      <CounterBar class="q-ma-md" :chest-statuses="accountInfo.session" />
    </div>

    <div>
      <div class="q-ml-md q-mb-lg">{{ $t('account.previousRun') }}</div>
      <q-virtual-scroll style="max-height: 300px;"
        :items="prevStatuses.sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time))" separator
        v-slot="{ item }">

        <div :key="item._id">
          <q-badge class="q-ml-md" color="blue" outline>
            {{ new Date(item.start_time).toLocaleString() }}
          </q-badge>
          <q-badge class="q-ml-md" :color="item.status === 'DONE' ? $t('status.PROCESSED') : $t('status.ERROR')">
            {{ item.status }}
          </q-badge>

          <CounterBar class="q-ma-md q-mt-sm" :chest-statuses="item.chestStatusCounts" />
        </div>
      </q-virtual-scroll>
    </div>
  </q-page>
</template>
<script setup lang="ts">
import { useGrabCookies } from '../utils'
import { useUser } from 'src/stores/user';
import { getChests, getSessions, runAccount } from '../api'
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { ChestStatuses, SessionStatus } from 'src/types';

import CounterBar from 'src/components/CounterBar.vue';
import CounterDescription from 'src/components/CounterDescription.vue';

const prevStatuses = ref<SessionStatus[]>([])

const isSelectDatesForChestsDialogOpened = ref(false)

const selectDatesForChests = ref({
  from: undefined,
  to: undefined,
})
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


async function downloadChests() {
  await getChests(route.params.id as string, selectDatesForChests.value.from, selectDatesForChests.value.to)
}

onMounted(async () => {
  await getSessions(route.params.id as string).then((response) => {
    prevStatuses.value = response.data

  })
})

watch(() => userStore.nodeStatus, async () => {
  await getSessions(route.params.id as string).then((response) => {
    prevStatuses.value = response.data

  })
})

</script>
