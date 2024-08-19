<template>
  <q-page>
    <q-item @click="$router.push({ name: 'new' })" class="full-width" clickable v-ripple>
      {{ $t('account.new') }}
    </q-item>
    <q-virtual-scroll style="max-height: 800px;" :items="userStore.accounts" separator v-slot="{ item, index }">
      <q-item class="full-width" clickable v-ripple>
        {{ index + 1 }}. {{ item.name }}
      </q-item>
    </q-virtual-scroll>
  </q-page>
</template>

<script setup lang="ts">
import { useUser } from 'src/stores/user';

const userStore = useUser()

</script>
