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

export const detectImage = (
  model: tf.GraphModel,
  config: Config,
  source: HTMLImageElement
): Promise<DetectedObject[]> => {
  return detect(
    model,
    config,
    source,
    source.naturalWidth,
    source.naturalHeight
  )
}

export const detectVideo = (
  model: tf.GraphModel,
  config: Config,
  source: HTMLVideoElement
): Promise<DetectedObject[]> => {
  return detect(model, config, source, source.videoWidth, source.videoHeight)
}

export const detect = async (
  model: tf.GraphModel,
  config: Config,
  source: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number
): Promise<DetectedObject[]> => {
  const { boxes, classes, scores } = config.index

  tf.engine().startScope()
  try {
    const tensorImage = await getTensorImage(source)
    const predictions: any = await model.executeAsync(tensorImage)
    const boxesArray = predictions[boxes].arraySync()[0]
    const classesArray = predictions[classes].arraySync()[0]
    const scoresArray = predictions[scores].arraySync()[0]
    return detectObjects(
      boxesArray,
      classesArray,
      scoresArray,
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
  source: HTMLImageElement | HTMLVideoElement
): Promise<tf.Tensor<tf.Rank>> => {
  const img = await tf.browser.fromPixelsAsync(source)
  return img.toInt().transpose([0, 1, 2]).expandDims()
}
