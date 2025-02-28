export interface IBrushCursorInfo {
  cursorStrokeColor: string
  cursorColor: string
  cursorStrokeWidth: number
}

export interface IBrushInfo {
  color: string
  size: number
  strokeDashArray: number[] | null
}

export enum MovingRenderMode {
  Performance = 'performance',
  Quality = 'quality'
}

export enum DrawTiming {
  Drawing,
  Finished
}
