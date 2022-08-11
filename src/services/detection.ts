import {
  GraphModel,
  engine,
  zeros,
  browser,
  Tensor,
  Rank,
  enableProdMode,
  setBackend,
  ready,
  loadGraphModel,
} from '@tensorflow/tfjs'
import { MODEL_CONFIG } from 'config/models'
import { Box, DetectedObject, Source } from 'types'
import { Semaphore } from 'utils/semaphore'

export const loadModelAndWarmUp = async (): Promise<GraphModel> => {
  enableProdMode()
  setBackend('webgl')

  await ready()
  const model = await loadGraphModel(MODEL_CONFIG.path)

  engine().startScope()
  await model.executeAsync(zeros([1, 300, 300, 3]).toInt())
  engine().endScope()

  return model
}

const getTensorFromImage = async (source: Source): Promise<Tensor<Rank>> => {
  const img = await browser.fromPixelsAsync(source)
  return img.toInt().transpose([0, 1, 2]).expandDims()
}

const getScore = (score: number): string => `${(100.0 * score).toFixed(0)}%`

const initResizeBox = (box: Box, width: number, height: number): Box => {
  const [minY, minX, maxY, maxX] = box
  return [
    minX * width,
    minY * height,
    (maxX - minX) * width,
    (maxY - minY) * height,
  ]
}

const detect = async (
  model: GraphModel,
  source: Source,
  width: number,
  height: number
): Promise<DetectedObject[]> => {
  engine().startScope()
  try {
    const tensorImage = await getTensorFromImage(source)
    const predictions: any = await model.executeAsync(tensorImage)

    const boxes: Box[] = predictions[MODEL_CONFIG.index.boxes].arraySync()[0]
    const classes: number[] =
      predictions[MODEL_CONFIG.index.classes].arraySync()[0]
    const scores: number[] =
      predictions[MODEL_CONFIG.index.scores].arraySync()[0]

    const detectedBoxes = boxes.filter(
      (box, i) => box && classes[i] && scores[i] > MODEL_CONFIG.threshold
    )

    const detectedObjects: DetectedObject[] = detectedBoxes.map((box, i) => ({
      label: MODEL_CONFIG.labels[classes[i] - 1],
      score: getScore(scores[i]),
      box: initResizeBox(box, width, height),
    }))

    return detectedObjects
  } catch (e) {
    console.error(e)
  } finally {
    engine().endScope()
  }
  return []
}

export const synchronizedDetection = {
  throttler: new Semaphore(),

  onImage(
    model: GraphModel,
    image: HTMLImageElement
  ): Promise<DetectedObject[]> {
    return synchronizedDetection.throttler.call(
      detect,
      model,
      image,
      image.naturalWidth,
      image.naturalHeight
    )
  },

  onVideo(
    model: GraphModel,
    video: HTMLVideoElement
  ): Promise<DetectedObject[]> {
    return synchronizedDetection.throttler.call(
      detect,
      model,
      video,
      video.videoWidth,
      video.videoHeight
    )
  },
}
