<script setup lang="ts">
interface Props {
  name?: string
}

const props = defineProps<Props>()
</script>

<template>
  <router-view :data-name="props.name || undefined" />
</template>

<style scoped lang="scss">
.router-view {
}
</style>
