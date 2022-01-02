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
