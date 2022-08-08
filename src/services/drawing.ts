import { Box, DetectedObject } from '../types'

const drawText = (
  text: string,
  x: number,
  y: number,
  ctx: CanvasRenderingContext2D
): void => {
  ctx.font = 'lighter 0.9rem Roboto'
  ctx.strokeStyle = 'black'
  ctx.lineWidth = 5
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

const drawObjects = (
  objects: DetectedObject[],
  ctx: CanvasRenderingContext2D,
  widthScale: number,
  heightScale: number
): void => {
  for (let i = 0; i < objects.length; i++) {
    const { label, box, score } = objects[i]
    const resizeBox: Box = [...box]

    resizeBox[0] *= widthScale
    resizeBox[2] *= widthScale
    resizeBox[1] *= heightScale
    resizeBox[3] *= heightScale

    resizeBox[1] <= 40
      ? drawText(
          `${label.name} ${score}`,
          resizeBox[0] + 5,
          resizeBox[1] + 20,
          ctx
        )
      : drawText(`${label.name} ${score}`, resizeBox[0], resizeBox[1] - 5, ctx)

    drawBox(resizeBox, label.color, ctx)
  }
}

export const draw = (
  objects: DetectedObject[],
  canvas: HTMLCanvasElement,
  clientWidth: number,
  clientHeight: number,
  width: number,
  height: number
): void => {
  const ctx = canvas.getContext('2d')!
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
  canvas.width = clientWidth
  canvas.height = clientHeight
  drawObjects(objects, ctx, clientWidth / width, clientHeight / height)
}
