import { TSimplePathData } from 'fabric'

const toFixed = (number: number | string, fractionDigits: number) =>
  parseFloat(Number(number).toFixed(fractionDigits))

const joinPath = (pathData: TSimplePathData, fractionDigits?: number) =>
  pathData
    .map(segment => {
      return segment
        .map((arg, i) => {
          if (i === 0) return arg
          return fractionDigits === undefined ? arg : toFixed(arg, fractionDigits)
        })
        .join(' ')
    })
    .join(' ')

/**
 * @private
 * @param {TSimplePathData} pathData SVG path commands
 * @returns {boolean}
 */
export function isEmptySVGPath(pathData: TSimplePathData): boolean {
  return joinPath(pathData) === 'M 0 0 Q 0 0 0 0 L 0 0'
}
