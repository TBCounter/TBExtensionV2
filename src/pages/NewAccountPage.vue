<template>
  <q-page>
    <div class="q-pa-md q-gutter-sm">
      <q-breadcrumbs>
        <q-breadcrumbs-el icon="home" to="/" />
        <q-breadcrumbs-el :label="$t('account.new')" icon="person" />
      </q-breadcrumbs>
    </div>
    <q-card class="q-pa-sm shadow-2" bordered>
      <q-card-section class="text-center">
        <div class="text-grey-9 text-h5 text-weight-bold">{{ $t('account.new') }}</div>
        <div class="text-grey-8">{{ $t('account.newDescription') }}</div>
      </q-card-section>
      <q-form @submit="createAccount">
        <q-input dense outlined :rules="[(val: string) => !!val || $t('account.required')]" :label="$t('account.name')"
          v-model="name"></q-input>
        <q-card-section>
          <q-btn type="submit" style="border-radius: 8px" color="dark" rounded size="md" :label="$t('account.create')"
            no-caps class="full-width"></q-btn>
        </q-card-section>
      </q-form>
    </q-card>
  </q-page>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { createAccountPost } from '../api'
import { useRouter } from 'vue-router';
import { useUser } from 'src/stores/user';

const router = useRouter()
const userStore = useUser()

const name = ref()

async function createAccount() {
  await createAccountPost(name.value).catch(() => {
    console.log('cant create account')
  })
  await userStore.refillUserInfo()
  await router.push({ name: 'home' })
}
</script>
