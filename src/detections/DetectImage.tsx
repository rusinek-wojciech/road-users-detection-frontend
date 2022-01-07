import { useEffect, useRef } from 'react'
import { Card, CardActionArea, CardMedia } from '@mui/material'
import { DetectedObject } from '../services/detection'
import { draw } from '../services/drawing'

interface Props {
  objects: DetectedObject[]
  imageSource: string
  width: number
  height: number
  onClickAction: () => void
  fullscreen?: boolean
}

const DetectImage = (props: Props) => {
  const {
    objects,
    imageSource,
    width,
    height,
    onClickAction,
    fullscreen = false,
  } = props

  const cardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRequest = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const card = cardRef.current

    if (canvas && card) {
      const animateDraw = () => {
        draw(
          objects,
          canvas,
          card.clientWidth,
          card.clientHeight,
          width,
          height
        )
        frameRequest.current = requestAnimationFrame(animateDraw)
      }
      animateDraw()
    }

    return () => {
      cancelAnimationFrame(frameRequest.current)
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
      }
    }
  }, [objects, width, height])

  return (
    <Card
      ref={cardRef}
      style={{
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      <CardActionArea onClick={onClickAction}>
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            zIndex: 100,
            width: '100%',
            height: '100%',
          }}
        />
        <CardMedia
          style={{
            width: '100%',
            objectFit: 'contain',
            maxHeight: fullscreen ? '100vh' : '83vh',
          }}
          component='img'
          image={imageSource}
          alt='detected image'
        />
      </CardActionArea>
    </Card>
  )
}

export default DetectImage
