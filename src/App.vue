<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useUser } from './stores/user';

defineOptions({
  name: 'App'
});

const userStore = useUser()

onMounted(()=>{
  userStore.fillUserInfo().catch(userStore.logout)
})
</script>
