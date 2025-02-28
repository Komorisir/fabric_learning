import { Canvas, FabricObject, Group, Path, PencilBrush, Point, TEvent } from 'fabric'
import { isEmptySVGPath } from './utils'
import { DrawTiming, MovingRenderMode } from '@/types/brushes'

export class EPencilBrush extends PencilBrush {
  public targetGroup: Group | null = null

  public tempPath: FabricObject | null = null

  // 渲染模式属性: performance(使用contextTop) 或 quality(实时绘制)
  public movingRenderMode: MovingRenderMode = MovingRenderMode.Quality

  constructor(canvas: Canvas, targetGroup?: Group) {
    super(canvas)
    this.targetGroup = targetGroup || null
  }

  setTargetGroup(targetGroup: Group) {
    this.targetGroup = targetGroup
  }

  getGroupPath(path: Path, timing: DrawTiming): { path: FabricObject | null } {
    return { path }
  }

  // 更换渲染模式
  changeMovingRenderMode(mode: MovingRenderMode) {
    this.movingRenderMode = mode
  }

  // 质量模式，实时绘制
  qualityMovingRender(points: Point[], targetGroup: Group) {
    // 如果存在临时路径，先从组中移除
    if (this.tempPath) {
      targetGroup.remove(this.tempPath)
      this.tempPath = null
    }

    // 创建新的路径数据
    const pathData = this.convertPointsToSVGPath(points).join('') as any
    // 将临时路径添加到目标组中
    const { path } = this.getGroupPath(this.createPath(pathData), DrawTiming.Drawing)
    // 将临时路径添加到目标组中
    path && targetGroup.add(path)
    this.tempPath = path
    // 请求画布重绘
    this.canvas.requestRenderAll()
  }

  // 性能模式，contextTop绘制
  performanceMovingRender(points: Point[]) {
    if (this.needsFullRender()) {
      // redraw curve
      // clear top canvas
      this.canvas.clearContext(this.canvas.contextTop)
      this._render()
    } else {
      const anyThis = this as any
      const length = points.length
      const ctx = this.canvas.contextTop
      // draw the curve update
      this._saveAndTransform(ctx)
      if (anyThis.oldEnd) {
        ctx.beginPath()
        ctx.moveTo(anyThis.oldEnd.x, anyThis.oldEnd.y)
      }
      anyThis.oldEnd = PencilBrush.drawSegment(ctx, points[length - 2], points[length - 1])
      ctx.stroke()
      ctx.restore()
    }
  }

  // ------------------------------重写部分--------------------------------

  onMouseDown(pointer: Point, { e }: TEvent) {
    if (!this.targetGroup || this.movingRenderMode === MovingRenderMode.Performance) {
      return super.onMouseDown(pointer, { e })
    }
    if (!this.canvas._isMainEvent(e)) {
      return
    }
    this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey]
    this._prepareForDrawing(pointer)
    // capture coordinates immediately
    // this allows to draw dots (when movement never occurs)
    this._addPoint(pointer)
  }

  // 重写 onMouseMove 方法
  public onMouseMove(pointer: Point, { e }: TEvent) {
    if (!this.targetGroup) {
      return super.onMouseMove(pointer, { e })
    }
    if (!this.canvas._isMainEvent(e)) {
      return
    }

    this.drawStraightLine = !!this.straightLineKey && e[this.straightLineKey]
    if (this.limitedToCanvasSize === true && this._isOutSideCanvas(pointer)) {
      return
    }

    const points = (this as any)._points as Point[]

    if (this._addPoint(pointer) && points.length > 1) {
      if (this.movingRenderMode === MovingRenderMode.Quality) {
        this.qualityMovingRender(points, this.targetGroup)
      } else {
        this.performanceMovingRender(points)
      }
    }
  }

  public onMouseUp({ e }: TEvent) {
    if (!this.targetGroup) {
      return super.onMouseUp({ e })
    }
    if (this.tempPath) {
      this.targetGroup.remove(this.tempPath)
      this.tempPath = null
    }
    return super.onMouseUp({ e })
  }

  _finalizeAndAddPath() {
    if (!this.targetGroup) {
      return super._finalizeAndAddPath()
    }
    const ctx = this.canvas.contextTop
    ctx.closePath()
    if (this.decimate) {
      ;(this as any)._points = this.decimatePoints((this as any)._points, this.decimate)
    }
    const pathData = this.convertPointsToSVGPath((this as any)._points)
    if (isEmptySVGPath(pathData)) {
      this.canvas.requestRenderAll()
      return
    }

    const path = this.createPath(pathData)
    this.canvas.clearContext(this.canvas.contextTop)
    this.canvas.fire('before:path:created', { path })
    if (this.tempPath) {
      this.targetGroup.remove(this.tempPath)
    }
    // 将最终路径添加到目标组中
    const { path: newPath } = this.getGroupPath(path, DrawTiming.Finished)
    // 将临时路径添加到目标组中
    newPath && this.targetGroup.add(newPath)
    this.tempPath = null
    this.canvas.requestRenderAll()
    path.setCoords()
    this._resetShadow()

    // fire event 'path' created
    this.canvas.fire('path:created', { path })
  }
}
