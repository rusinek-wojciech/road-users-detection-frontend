import { DetectedObject } from './detection'

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
