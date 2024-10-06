<template>
  <div class="row q-gutter-md">
    <div class="row items-center" v-for="(value, key) in chestStatuses" :key="key">
      <div :class="['description--' + key, 'description-circle q-mr-xs']"></div>

      {{ $t('status.' + key) }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChestStatuses } from 'src/types'

type Props = {
  chestStatuses: ChestStatuses
}
defineProps<Props>()



</script>

<style lang="scss" scoped>
.description {

  &-circle {
    height: 10px;
    width: 10px;
    border-radius: 5px;
  }

  &--CREATED {
    background: $primary;
  }

  &--ERROR {
    background: $negative;
  }

  &--PROCESSED {
    background: $positive;
  }

  &--PROCESSING {
    background: $warning;
  }

  &--UPLOADED {
    background: $info;
  }
}
</style>
