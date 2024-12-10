<template>
  <MainCanvas />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import MainCanvas from './components/MainCanvas.vue'
onMounted(() => {
  console.log('Mounted')
})
</script>
