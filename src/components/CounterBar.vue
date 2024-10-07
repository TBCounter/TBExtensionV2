<template>
  <div class="row bar" v-if="totalChests">
    <div :style="`width: ${calcWidth(value)};`" v-for="(value, key) in chestStatuses"
      :class="['bar--' + key, 'bar-inner row justify-center items-center']" :key="key">
      {{ value > 0 ? value : '' }}
    </div>
  </div>
  <div class="row bar" v-else>
    <div style="width: 100%; background: gray;" class="bar-inner row justify-center items-center">no data</div>
  </div>
</template>

<script setup lang="ts">
import { ChestStatuses } from 'src/types'
import { computed } from 'vue';

type Props = {
  chestStatuses: ChestStatuses
}
const props = defineProps<Props>()

function calcWidth(count: number) {
  return (count * 100 / totalChests.value) + '%';
}


const totalChests = computed(() => {
  return Object.values(props.chestStatuses).reduce((acc, curr) => acc + curr, 0)
})

</script>

<style lang="scss" scoped>
.bar {
  border-radius: 8px;
  height: 20px;
  overflow: hidden;

  &-inner {
    height: 20px;
    color: white;
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
