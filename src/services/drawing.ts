import { Box, DetectedObject } from '../types'

const drawText = (
  text: string,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.font = 'lighter 1rem Roboto'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 5
  ctx.strokeText(text, x, y)
  ctx.fillStyle = 'white'
  ctx.fillText(text, x, y)
}

const drawBox = (
  box: Box,
  color: string,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.strokeStyle = color
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.rect(...box)
  ctx.stroke()
}

export const draw = (
  objects: DetectedObject[],
  canvas: HTMLCanvasElement
): void => {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  for (let i = 0; i < objects.length; i++) {
    const { label, box, score } = objects[i]

    box[1] <= 40
      ? drawText(`${label.name} ${score}`, box[0] + 5, box[1] + 20, ctx)
      : drawText(`${label.name} ${score}`, box[0], box[1] - 5, ctx)

    drawBox(box, label.color, ctx)
  }
}
