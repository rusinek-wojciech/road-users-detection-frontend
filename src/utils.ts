export const labels = [
  { name: 'empty', color: 'white' },
  { name: 'bike', color: 'red' },
  { name: 'scooter', color: 'yellow' },
]

export const drawRect = (
  boxes: number[][],
  classes: number[],
  scores: number[],
  threshold: number,
  imgWidth: number,
  imgHeight: number,
  ctx: CanvasRenderingContext2D
): void => {
  for (let i = 0; i <= boxes.length; i++) {
    if (boxes[i] && classes[i] && scores[i] > threshold) {
      const [y, x, height, width] = boxes[i]
      const text = classes[i]
      ctx.strokeStyle = labels[text]['color']
      ctx.lineWidth = 10
      ctx.fillStyle = 'white'
      ctx.font = '16px Arial'
      ctx.beginPath()
      ctx.fillText(
        labels[text]['name'] + ' - ' + Math.round(scores[i] * 100) / 100,
        x * imgWidth,
        y * imgHeight - 10
      )
      ctx.rect(
        x * imgWidth,
        y * imgHeight,
        (width * imgWidth) / 2,
        (height * imgHeight) / 2
      )
      ctx.stroke()
    }
  }
}
