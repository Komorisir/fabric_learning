<template>
  <div class="mian-container">
    <canvas id="main-canvas" width="400" height="400" style="border: 1px solid #ccc"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as fabric from 'fabric'
import { onMounted } from 'vue'

const init = () => {
  const mainCanvas = new fabric.Canvas('main-canvas')

  // 创建一个长方形
  const rect = new fabric.Rect({
    top: 30,
    left: 30,
    width: 100,
    height: 100,
    fill: 'red'
  })

  // 将长方形添加到画布上
  mainCanvas.add(rect)
}

onMounted(() => {
  init()
})
</script>
