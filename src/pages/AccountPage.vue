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
    <div class="q-mx-md q-mb-sm">
      <q-toggle v-model="runWithOpen" :label="$t('account.runWithOpen')"> <q-tooltip>
          {{ $t('account.chestTooltip') }}
        </q-tooltip></q-toggle>
    </div>
    <div class="row justify-center">
      <q-btn :disabled="accountInfo?.logs?.length || !userStore.nodeStatus.idle" @click="runCookiesAccount"> {{
        $t('account.start') }} </q-btn>
      <q-btn class="q-ml-md" @click="isSelectDatesForChestsDialogOpened = true">{{ $t('account.download') }}</q-btn>

    </div>

    <CounterDescription class="q-ma-md" :chest-statuses="chestStatusesMock" />

    <div v-if="(accountInfo?.session && Object.keys(accountInfo.session).length > 0)">
      <div class="q-ml-md q-mb-md">{{ $t('account.currentRun') }}</div>
      <CounterBar class="q-ma-md" :chest-statuses="accountInfo.session" />
    </div>

    <div>
      <div class="q-ml-md q-mb-md">{{ $t('account.previousRun') }}</div>
      <q-virtual-scroll style="max-height: 300px;"
        :items="prevStatuses.sort((a, b) => +new Date(b.start_time) - +new Date(a.start_time))" separator
        v-slot="{ item }">

        <div class="q-py-sm" :key="item._id">
          <div class="row items-center">
            <div>
              <q-badge class="q-ml-md" color="blue" outline>
                {{ new Date(item.start_time).toLocaleString() }}
              </q-badge>
              <q-badge class="q-ml-md" :color="item.status === 'DONE' ? 'positive' : 'negative'">
                {{ item.status === 'DONE' ? $t('status.PROCESSED') : $t('status.ERROR') }}
              </q-badge>
            </div>
            <q-space />
            <q-btn size="small" @click="getChestBySession(item.session_id)" flat round color="positive"
              icon="file_download" />
            <q-btn size="small" flat round color="negative" icon="delete_forever">
              <q-menu>
                <q-list style="min-width: 100px">
                  <q-item clickable
                    @click="deletingSession = item; deletingWhole = false; isSureDeleteDialogOpen = true" v-close-popup>
                    <q-item-section>{{ $t("account.deleteSoft") }}</q-item-section>
                  </q-item>
                  <q-item class="bg-negative text-white" clickable
                    @click="deletingSession = item; deletingWhole = true; isSureDeleteDialogOpen = true" v-close-popup>
                    <q-item-section> {{ $t("account.deleteForever") }}</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </div>
          <CounterBar class="q-ma-md q-mt-sm" :chest-statuses="item.chestStatusCounts" />
          <q-separator />
        </div>
      </q-virtual-scroll>
    </div>


    <q-dialog seamless v-model="isSelectDatesForChestsDialogOpened">
      <q-card>
        <q-card-section class="row">
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

    <q-dialog seamless v-model="isSureDeleteDialogOpen">
      <q-card>
        <q-card-section>
          <div class="text-subtitle1">{{ $t('account.areUSure') }}</div>
        </q-card-section>

        <q-card-section class="q-py-none">
          <div class="text-subtitle2">{{ $t('account.areUSubSure') }}</div>
        </q-card-section>
        <q-card-section>
          <q-badge class="q-ml-md" :color="deletingSession?.status === 'DONE' ? 'positive' : 'negative'">
            {{ deletingSession?.status === 'DONE' ? $t('status.PROCESSED') : $t('status.ERROR') }}
          </q-badge>
        </q-card-section>
        <q-card-section v-if="deletingSession && deletingWhole">
          {{ $t('account.deleteForever') }}
          <CounterBar class="q-ma-md q-mt-sm" :chest-statuses="deletingSession?.chestStatusCounts" />
        </q-card-section>
        <q-card-section v-else>
          {{ $t('account.deleteSoft') }}
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="OK" @click="deleteSession(deletingSession?.session_id, deletingWhole); reloadSessions()"
            color="negative" v-close-popup />
          <q-btn flat label="Отмена" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>
<script setup lang="ts">
import { useGrabCookies } from '../utils'
import { useUser } from 'src/stores/user';
import { deleteSession, getChestBySession, getChests, getSessions, runAccount } from '../api'
import { useRoute } from 'vue-router';
import { computed, onMounted, ref, watch } from 'vue';
import { ChestStatuses, SessionStatus } from 'src/types';
import { useQuasar } from 'quasar';

import { useI18n } from 'vue-i18n';

import CounterBar from 'src/components/CounterBar.vue';
import CounterDescription from 'src/components/CounterDescription.vue';


const { t } = useI18n()
const runWithOpen = ref(false)

const prevStatuses = ref<SessionStatus[]>([])

const isSelectDatesForChestsDialogOpened = ref(false)
const isSureDeleteDialogOpen = ref(false)

const deletingSession = ref<SessionStatus>()
const deletingWhole = ref(false)

const $q = useQuasar()

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
  const cookiesData = await cookies.grabCookies().catch(() => {
    $q.notify({
      message: t('account.noCookies'),
    })
    return { PTBHSSID: '' }
  })

  if (!cookiesData.PTBHSSID) {
    $q.notify({
      message: t('account.noCookies'),
    })
  }
  await runAccount({ accountId: route.params.id as string, url: 'https://totalbattle.com/', cookie: cookiesData }, runWithOpen.value)
}


async function downloadChests() {
  await getChests(route.params.id as string, selectDatesForChests.value.from, selectDatesForChests.value.to)
}

async function reloadSessions() {
  await getSessions(route.params.id as string).then((response) => {
    prevStatuses.value = response.data

  })
}

onMounted(async () => {
  await reloadSessions()
})

watch(() => userStore.nodeStatus, async () => {
  await reloadSessions()
})

</script>
