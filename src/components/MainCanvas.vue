<template>
  <div>
    <button :class="{ active: isDrawingRectangle }" @click="toggleRectangleDrawing">画矩形</button>
    <button :class="{ active: isDrawingOval }" @click="toggleOvalDrawing">画椭圆</button>
    <canvas ref="canvas" width="1000" height="800" style="border: 1px solid #000"></canvas>
  </div>
</template>

<script>
import * as fabric from 'fabric'
import { ERectangleBrush, EOvalBrush } from '../brushs/ShapeBrush'

export default {
  data() {
    return {
      canvas: null,
      isDrawingRectangle: false,
      isDrawingOval: false,
      rectangleBrush: null,
      ovalBrush: null
    }
  },
  mounted() {
    this.canvas = new fabric.Canvas(this.$refs.canvas)
    this.rectangleBrush = new ERectangleBrush(this.canvas)
    this.ovalBrush = new EOvalBrush(this.canvas)
  },
  methods: {
    toggleRectangleDrawing() {
      this.isDrawingRectangle = !this.isDrawingRectangle
      if (this.isDrawingRectangle) {
        this.canvas.on('mouse:down', this.onMouseDownRectangle)
        this.canvas.on('mouse:move', this.onMouseMoveRectangle)
        this.canvas.on('mouse:up', this.onMouseUpRectangle)
      } else {
        this.canvas.off('mouse:down', this.onMouseDownRectangle)
        this.canvas.off('mouse:move', this.onMouseMoveRectangle)
        this.canvas.off('mouse:up', this.onMouseUpRectangle)
      }
    },
    toggleOvalDrawing() {
      this.isDrawingOval = !this.isDrawingOval
      if (this.isDrawingOval) {
        this.canvas.on('mouse:down', this.onMouseDownOval)
        this.canvas.on('mouse:move', this.onMouseMoveOval)
        this.canvas.on('mouse:up', this.onMouseUpOval)
      } else {
        this.canvas.off('mouse:down', this.onMouseDownOval)
        this.canvas.off('mouse:move', this.onMouseMoveOval)
        this.canvas.off('mouse:up', this.onMouseUpOval)
      }
    },
    onMouseDownRectangle(opt) {
      const pointer = this.canvas.getPointer(opt.e)
      this.rectangleBrush.onMouseDown(pointer, opt)
    },
    onMouseMoveRectangle(opt) {
      const pointer = this.canvas.getPointer(opt.e)
      this.rectangleBrush.onMouseMove(pointer, opt)
    },
    onMouseUpRectangle(opt) {
      if (this.rectangleBrush.onMouseUp(opt)) {
        this.toggleRectangleDrawing()
      }
    },
    onMouseDownOval(opt) {
      const pointer = this.canvas.getPointer(opt.e)
      this.ovalBrush.onMouseDown(pointer, opt)
    },
    onMouseMoveOval(opt) {
      const pointer = this.canvas.getPointer(opt.e)
      this.ovalBrush.onMouseMove(pointer, opt)
    },
    onMouseUpOval(opt) {
      if (this.ovalBrush.onMouseUp(opt)) {
        this.toggleOvalDrawing()
      }
    }
  }
}
</script>

<style>
button.active {
  background-color: #007bff;
  color: white;
}
</style>
