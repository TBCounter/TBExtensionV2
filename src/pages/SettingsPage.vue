<template>
  <q-layout class="layout" view="lHh Lpr lFf">
    <q-checkbox v-model="sidePanelActive" label="Use side panel for extension" />
  </q-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { watch } from 'vue';
import { ref } from 'vue';
import { useQuasar } from 'quasar'

const $q = useQuasar()
const sidePanelActive = ref(false)

watch(sidePanelActive, async (value) => {
  await $q.bex.send('storage.set', { key: 'sidePanelActive', value })

}, { immediate: false })


onMounted(async () => {
  const { data } = await $q.bex.send('storage.get', { key: 'sidePanelActive' })
  sidePanelActive.value = data
})
</script>
