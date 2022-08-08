import {
  GraphModel,
  engine,
  zeros,
  browser,
  Tensor,
  Rank,
} from '@tensorflow/tfjs'
import { Label, ModelConfig } from '../types'
import { DetectedObject } from '../types'
import { Semaphore } from '../utils/semaphore'

const detection = {
  throttler: new Semaphore(),

  warmUp(model: GraphModel): void {
    detection.throttler.call(async () => {
      engine().startScope()
      model
        .executeAsync(zeros([1, 300, 300, 3]).toInt())
        .finally(() => engine().endScope())
    })
  },

  async detect(
    model: GraphModel,
    config: ModelConfig,
    source: HTMLImageElement | HTMLVideoElement,
    width: number,
    height: number
  ): Promise<DetectedObject[]> {
    const { boxes, classes, scores } = config.index
    engine().startScope()
    try {
      const tensorImage = await detection.getTensorImage(source)
      const predictions: any = await model.executeAsync(tensorImage)
      const boxesArray = predictions[boxes].arraySync()[0]
      const classesArray = predictions[classes].arraySync()[0]
      const scoresArray = predictions[scores].arraySync()[0]
      return detection.detectObjects(
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
      engine().endScope()
    }
    return []
  },

  detectImage(
    model: GraphModel,
    config: ModelConfig,
    source: HTMLImageElement
  ): Promise<DetectedObject[]> {
    return detection.throttler.call(
      detection.detect,
      model,
      config,
      source,
      source.naturalWidth,
      source.naturalHeight
    )
  },

  detectVideo(
    model: GraphModel,
    config: ModelConfig,
    source: HTMLVideoElement
  ): Promise<DetectedObject[]> {
    return detection.throttler.call(
      detection.detect,
      model,
      config,
      source,
      source.videoWidth,
      source.videoHeight
    )
  },

  async getTensorImage(
    source: HTMLImageElement | HTMLVideoElement
  ): Promise<Tensor<Rank>> {
    const img = await browser.fromPixelsAsync(source)
    return img.toInt().transpose([0, 1, 2]).expandDims()
  },

  detectObjects(
    boxes: number[][],
    classes: number[],
    scores: number[],
    labels: Label[],
    threshold: number,
    width: number,
    height: number
  ): DetectedObject[] {
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
  },
}

export default detection
