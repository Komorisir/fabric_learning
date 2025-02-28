import { Canvas, Group, Point, Rect, Ellipse, TEvent } from 'fabric'
import { EPencilBrush } from './PencilBrush'

export class ERectangleBrush extends EPencilBrush {
  private startPoint: Point | null = null

  private rect: Rect | null = null

  // eslint-disable-next-line no-useless-constructor
  constructor(canvas: Canvas, targetGroup?: Group) {
    super(canvas, targetGroup)
  }

  onMouseDown(pointer: Point, { e }: TEvent): void {
    if (!this.canvas._isMainEvent(e)) return
    this.startPoint = pointer

    this.rect = new Rect({
      left: pointer.x,
      top: pointer.y,
      originX: 'left',
      originY: 'top',
      width: 0,
      height: 0,
      fill: 'transparent',
      stroke: this.color,
      strokeWidth: this.width,
      selectable: true, // 允许选择
      hasControls: true, // 显示控制点
      hasBorders: true, // 显示边框
      transparentCorners: false, // 不透明的控制点
      cornerColor: 'rgba(102,153,255,0.5)', // 控制点颜色
      cornerSize: 8, // 控制点大小
      cornerStyle: 'rect', // 控制点样式
      hoverCursor: 'pointer', // 鼠标悬停样式
      moveCursor: 'move', // 鼠标移动样式
      evented: true // 允许事件
    })

    if (this.targetGroup) {
      this.targetGroup.add(this.rect)
    } else {
      this.canvas.add(this.rect)
    }
  }

  onMouseMove(pointer: Point, { e }: TEvent): void {
    if (!this.startPoint || !this.rect || !this.canvas._isMainEvent(e)) return

    const width = pointer.x - this.startPoint.x
    const height = pointer.y - this.startPoint.y

    this.rect.set({
      width: Math.abs(width),
      height: Math.abs(height),
      left: width > 0 ? this.startPoint.x : pointer.x,
      top: height > 0 ? this.startPoint.y : pointer.y
    })

    this.canvas.requestRenderAll()
  }

  onMouseUp({ e }: TEvent): boolean {
    if (!this.canvas._isMainEvent(e)) return false

    if (this.rect) {
      // 结束绘制时选中该矩形
      this.canvas.setActiveObject(this.rect)
      this.canvas.requestRenderAll()
    }
    // 重置状态
    this.startPoint = null
    this.rect = null

    return true
  }
}
export class EOvalBrush extends EPencilBrush {
  private startPoint: Point | null = null
  private ellipse: Ellipse | null = null

  constructor(canvas: Canvas, targetGroup?: Group) {
    super(canvas, targetGroup)
  }

  onMouseDown(pointer: Point, { e }: TEvent): void {
    if (!this.canvas._isMainEvent(e)) return
    this.startPoint = pointer
    this.ellipse = new Ellipse({
      left: pointer.x,
      top: pointer.y,
      rx: 0,
      ry: 0,
      fill: 'transparent',
      stroke: this.color,
      strokeWidth: this.width,
      selectable: true,
      hasControls: true,
      hasBorders: true,
      transparentCorners: false,
      cornerColor: 'rgba(102,153,255,0.5)',
      cornerSize: 8,
      cornerStyle: 'rect',
      hoverCursor: 'pointer',
      moveCursor: 'move',
      evented: true
    })

    if (this.targetGroup) {
      this.targetGroup.add(this.ellipse)
    } else {
      this.canvas.add(this.ellipse)
    }
  }

  onMouseMove(pointer: Point, { e }: TEvent): void {
    if (!this.startPoint || !this.ellipse || !this.canvas._isMainEvent(e)) return

    const rx = Math.abs(pointer.x - this.startPoint.x) / 2
    const ry = Math.abs(pointer.y - this.startPoint.y) / 2

    this.ellipse.set({
      rx,
      ry,
      left: this.startPoint.x - rx,
      top: this.startPoint.y - ry
    })

    this.canvas.requestRenderAll()
  }

  onMouseUp({ e }: TEvent): boolean {
    if (!this.canvas._isMainEvent(e)) return false

    if (this.ellipse) {
      this.canvas.setActiveObject(this.ellipse)
      this.canvas.requestRenderAll()
    }
    this.startPoint = null
    this.ellipse = null

    return true
  }
}
