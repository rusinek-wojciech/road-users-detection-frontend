import * as tf from '@tensorflow/tfjs'
import { Config } from './config'

export interface DetectedObject {
  label: {
    name: string
    color: string
  }
  score: string
  box: [number, number, number, number]
}

export const warmUp = (model: tf.GraphModel): void => {
  tf.engine().startScope()
  model
    .executeAsync(tf.zeros([1, 300, 300, 3]).toInt())
    .finally(() => tf.engine().endScope())
}

export const detect = async (
  model: tf.GraphModel,
  config: Config,
  source: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number
): Promise<DetectedObject[]> => {
  tf.engine().startScope()
  const { boxes, classes, scores } = config.index
  try {
    const tensorImage = await getTensorImage(
      source,
      config.modelWidth,
      config.modelHeight
    )
    const predictions: any = await model.executeAsync(tensorImage)
    return detectObjects(
      predictions[boxes].arraySync()[0],
      predictions[classes].arraySync()[0],
      predictions[scores].arraySync()[0],
      config.labels,
      config.treshold,
      width,
      height
    )
  } catch (e) {
    console.error(e)
  } finally {
    tf.engine().endScope()
  }
  return []
}

const detectObjects = (
  boxes: number[][],
  classes: number[],
  scores: number[],
  labels: {
    name: string
    color: string
  }[],
  threshold: number,
  width: number,
  height: number
): DetectedObject[] => {
  return boxes
    .filter((box, i) => box && classes[i] && scores[i] > threshold)
    .map((box, i) => {
      const [minY, minX, maxY, maxX] = box
      return {
        label: labels[classes[i] - 1],
        score: `${(100.0 * scores[i]).toFixed(0)}%`,
        box: [
          minX * width,
          minY * height,
          (maxX - minX) * width,
          (maxY - minY) * height,
        ],
      }
    })
}

const getTensorImage = async (
  source: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number
): Promise<tf.Tensor<tf.Rank>> => {
  return tf.image
    .resizeBilinear(await tf.browser.fromPixelsAsync(source), [width, height])
    .toInt()
    .transpose([0, 1, 2])
    .expandDims()
}
