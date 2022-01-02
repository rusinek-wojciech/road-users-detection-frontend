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

export const warmUp = (model: tf.GraphModel): void => {
  tf.engine().startScope()
  model
    .executeAsync(tf.zeros([1, 300, 300, 3]).toInt())
    .finally(() => tf.engine().endScope())
}

export const createPredictions = async (
  model: tf.GraphModel,
  src: HTMLImageElement | HTMLVideoElement
): Promise<DetectedObject[]> => {
  const width =
    src instanceof HTMLVideoElement ? src.videoWidth : src.naturalWidth
  const height =
    src instanceof HTMLVideoElement ? src.videoHeight : src.naturalHeight
  tf.engine().startScope()
  try {
    const predictions = (await model.executeAsync(
      await getTensorImage(src, config.MODEL_WIDTH, config.MODEL_HEIGHT)
    )) as any
    return detectObjects(
      predictions[config.BOXES_INDEX].arraySync()[0],
      predictions[config.CLASSES_INDEX].arraySync()[0],
      predictions[config.SCORES_INDEX].arraySync()[0],
      config.TRESHOLD,
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

const getTensorImage = async (
  src: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number
): Promise<tf.Tensor<tf.Rank>> => {
  return tf.image
    .resizeBilinear(await tf.browser.fromPixelsAsync(src), [width, height])
    .toInt()
    .transpose([0, 1, 2])
    .expandDims()
}
