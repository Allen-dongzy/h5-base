<script setup lang="ts">
interface Props {
  name?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="router-view" :data-name="props.name || undefined">
    <router-view />
  </div>
</template>

<style scoped lang="scss">
.router-view {
}
</style>
