<template>
  <q-layout class="layout" view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-toolbar-title>
          Total battle counter
        </q-toolbar-title>

        <div>v2</div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-footer>
      site
    </q-footer>
  </q-layout>
</template>

<script setup lang="ts">
defineOptions({
  name: 'MainLayout'
});


</script>
<style lang="scss" scoped>
.layout {
  width: 300px;
  height: 400px;
}
</style>
