import * as tf from '@tensorflow/tfjs'

const labels = [
  {
    name: 'bike',
    color: 'red',
  },
  {
    name: 'scooter',
    color: 'yellow',
  },
]

export interface DetectedObject {
  label: {
    name: string
    color: string
  }
  score: string
  box: number[]
}

export const detectObjects = (
  boxes: number[][],
  classes: number[],
  scores: number[],
  threshold: number,
  imgWidth: number,
  imgHeight: number
): DetectedObject[] => {
  const objects = []
  for (let i = 0; i < boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      let [minY, minX, maxY, maxX] = boxes[i]
      minY *= imgHeight
      minX *= imgWidth
      maxY *= imgHeight
      maxX *= imgWidth
      const box = []
      box.push(minX)
      box.push(minY)
      box.push(maxX - minX)
      box.push(maxY - minY)
      objects.push({
        label: labels[classes[i] - 1],
        score: scores[i].toFixed(4),
        box,
      })
    }
  }
  return objects
}

const drawText = (
  text: string,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.font = '16px Arial'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 6
  ctx.strokeText(text, x, y)
  ctx.fillStyle = 'white'
  ctx.fillText(text, x, y)
}

const drawBox = (
  box: number[],
  color: string,
  ctx: CanvasRenderingContext2D
) => {
  ctx.strokeStyle = color
  ctx.lineWidth = 10
  ctx.beginPath()
  ctx.rect(box[0], box[1], box[2], box[3])
  ctx.stroke()
}

export const drawObjects = (
  objects: DetectedObject[],
  ctx: CanvasRenderingContext2D,
  widthScale?: number,
  heightScale?: number
) => {
  for (let i = 0; i < objects.length; i++) {
    const { label, box, score } = objects[i]
    const resizeBox = [...box]
    if (widthScale) {
      resizeBox[0] *= widthScale
      resizeBox[2] *= widthScale
    }
    if (heightScale) {
      resizeBox[1] *= heightScale
      resizeBox[3] *= heightScale
    }
    drawText(`${label.name}: ${score}`, resizeBox[0], resizeBox[1] - 10, ctx)
    drawBox(resizeBox, label.color, ctx)
  }
}

export const getTensorImage = (
  image: HTMLImageElement,
  width: number,
  height: number
): tf.Tensor<tf.Rank> => {
  return tf.image
    .resizeBilinear(tf.browser.fromPixels(image), [width, height])
    .toInt()
    .transpose([0, 1, 2])
    .expandDims()
}
