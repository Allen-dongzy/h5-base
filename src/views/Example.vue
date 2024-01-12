<script setup lang="ts" name="example">
const route = useRoute()

const path = computed(() => route.fullPath)
</script>

<template>
  <div class="example">example: {{ path }}</div>
</template>

<style scoped lang="scss">
.example {
}
</style>
