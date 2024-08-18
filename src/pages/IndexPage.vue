<template>
  <q-page >
    <q-list >
      <q-item class="full-width" clickable v-ripple v-for="account in userStore.accounts" :key="account.id">

      </q-item>
    </q-list>
  </q-page>
</template>

<script setup lang="ts">
import { useUser } from 'src/stores/user';

const userStore = useUser()

</script>
