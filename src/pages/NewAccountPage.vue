<template>
  <q-page>
    <q-card class="q-pa-md shadow-2" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">{{ $t('account.new') }}</div>
        <div class="text-grey-8">{{ $t('account.newDescription') }}</div>
      </q-card-section>
      <q-form @submit="createAccount">
        <q-input dense outlined :rules="[(val: string) => !!val || $t('account.required')]" :label="$t('account.name')"
          v-model="name"></q-input>
        <q-card-section>
          <q-btn type="submit" style="border-radius: 8px" color="dark" rounded size="md" :label="$t('account.create')" no-caps
            class="full-width"></q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { createAccountPost } from '../api'

const name = ref()
function createAccount() {
  createAccountPost(name.value)
}
</script>
