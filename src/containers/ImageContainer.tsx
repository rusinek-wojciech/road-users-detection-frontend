import { useEffect, useLayoutEffect, useRef } from 'react'
import { Card, CardActionArea, CardMedia } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import { DetectedObject, detect } from '../services/detection'
import { draw } from '../services/drawing'
import { Config } from '../services/config'

interface Props {
  onClickAction: () => void
  model: GraphModel
  modelConfig: Config
  imageSource: string
  fullscreen?: boolean
}

const ImageContainer = (props: Props) => {
  const {
    onClickAction,
    model,
    modelConfig,
    imageSource,
    fullscreen = false,
  } = props

  const cardRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useLayoutEffect(() => {
    const img = new Image()
    img.src = imageSource
    imageRef.current = img
  }, [imageSource])

  useEffect(() => {
    let frameRequest = 0
    const canvas = canvasRef.current
    const card = cardRef.current

    if (imageRef?.current && canvas && card) {
      const image = imageRef.current

      const animateDraw = (objects: DetectedObject[]) => {
        draw(
          objects,
          canvas,
          card.clientWidth,
          card.clientHeight,
          image.naturalWidth,
          image.naturalHeight
        )
        frameRequest = requestAnimationFrame(() => animateDraw(objects))
      }

      const animateDetect = async () => {
        const objects = await detect(
          model,
          modelConfig,
          image,
          image.naturalWidth,
          image.naturalHeight
        )
        cancelAnimationFrame(frameRequest)
        animateDraw(objects)
      }

      image.addEventListener('load', () => animateDetect(), {
        once: true,
      })
    }
    return () => {
      cancelAnimationFrame(frameRequest)
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
      }
    }
  }, [model, modelConfig, imageSource])

  return (
    <Card ref={cardRef} style={{ width: 'fit-content', margin: 'auto' }}>
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

export default ImageContainer
