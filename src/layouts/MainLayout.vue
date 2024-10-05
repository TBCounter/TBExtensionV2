<template>
  <q-layout class="layout" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Total battle counter
        </q-toolbar-title>

        <div>v2</div>
        <q-btn @click="userStore.logout" v-if="jwt.isAuthenticated" icon="logout" class="q-ml-md" dense></q-btn>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer class="row justify-around q-pa-xs">
      {{ $t('contact') }} <a class="footer-link" href="https://t.me/Ivan5" target="_blank">@Ivan5</a>
      <q-btn @click="userStore.switchLocale" class="q-ml-auto" dense icon="language">
        {{ userStore.userLocale === 'en-US' ? 'Русский' : 'English' }}
      </q-btn>
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainLayout'
});
import { onMounted } from 'vue';
import { useJWT } from '../stores/jwt'
import { useUser } from '../stores/user'

const jwt = useJWT()
const userStore = useUser()

onMounted(() => {
  console.log('user ')
  userStore.fillUserInfo().catch(userStore.logout)
})
</script>
<style lang="scss" scoped>
.layout {
  min-width: 350px;
  height: 400px;
}

.footer-link {
  color: white
}
</style>
