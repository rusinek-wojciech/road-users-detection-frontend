import * as tf from '@tensorflow/tfjs'
import { config } from './config'

export interface DetectedObject {
  label: {
    name: string
    color: string
  }
  score: string
  box: [number, number, number, number]
}

export const detectObjects = (
  boxes: number[][],
  classes: number[],
  scores: number[],
  threshold: number,
  imgWidth: number,
  imgHeight: number
): DetectedObject[] => {
  return boxes
    .filter((box, i) => box && classes[i] && scores[i] > threshold)
    .map((box, i) => {
      const [minY, minX, maxY, maxX] = box
      return {
        label: config.LABELS[classes[i] - 1],
        score: scores[i].toFixed(4),
        box: [
          minX * imgWidth,
          minY * imgHeight,
          (maxX - minX) * imgWidth,
          (maxY - minY) * imgHeight,
        ],
      }
    })
}

const drawText = (
  text: string,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.font = '1rem Roboto'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 6
  ctx.strokeText(text, x, y)
  ctx.fillStyle = 'white'
  ctx.fillText(text, x, y)
}

const drawBox = (
  box: [number, number, number, number],
  color: string,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.rect(...box)
  ctx.stroke()
}

export const drawObjects = (
  objects: DetectedObject[],
  ctx: CanvasRenderingContext2D,
  widthScale?: number,
  heightScale?: number
): void => {
  for (let i = 0; i < objects.length; i++) {
    const { label, box, score } = objects[i]
    const resizeBox: [number, number, number, number] = [...box]
    if (widthScale) {
      resizeBox[0] *= widthScale
      resizeBox[2] *= widthScale
    }
    if (heightScale) {
      resizeBox[1] *= heightScale
      resizeBox[3] *= heightScale
    }
    drawText(`${label.name}: ${score}`, resizeBox[0], resizeBox[1] - 5, ctx)
    drawBox(resizeBox, label.color, ctx)
  }
}

export const getTensorImage = (
  src: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number
): tf.Tensor<tf.Rank> => {
  return tf.image
    .resizeBilinear(tf.browser.fromPixels(src), [width, height])
    .toInt()
    .transpose([0, 1, 2])
    .expandDims()
}

export const warmUp = (model: tf.GraphModel): void => {
  tf.engine().startScope()
  model
    .executeAsync(tf.zeros([1, 300, 300, 3]).toInt())
    .finally(() => tf.engine().endScope())
}
