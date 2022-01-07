import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Card, CardActionArea, CardMedia, Dialog } from '@mui/material'
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

  const cardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const cardFullscreenRef = useRef<HTMLDivElement | null>(null)
  const canvasFullscreenRef = useRef<HTMLCanvasElement | null>(null)

  const imageRef = useRef<HTMLImageElement | null>(null)
  const fullscreenRef = useRef<boolean>(fullscreen)
  const frameRequest = useRef<number>(0)

  const [objects, setObjects] = useState<DetectedObject[]>([])

  useLayoutEffect(() => {
    setObjects([])
    const img = new Image()
    img.src = imageSource
    imageRef.current = img
    img.addEventListener(
      'load',
      async () => {
        const objects = await detect(
          model,
          modelConfig,
          img,
          img.naturalWidth,
          img.naturalHeight
        )
        setObjects(objects)
      },
      { once: true }
    )
  }, [imageSource, model, modelConfig])

  useLayoutEffect(() => {
    fullscreenRef.current = fullscreen
  }, [fullscreen])

  useEffect(() => {
    const canvas = canvasRef.current
    const canvasFullscreen = canvasFullscreenRef.current
    const card = cardRef.current
    const cardFullscreen = cardFullscreenRef.current

    if (
      imageRef?.current &&
      canvasFullscreen &&
      cardFullscreen &&
      canvas &&
      card
    ) {
      const image = imageRef.current
      const animateDraw = () => {
        if (fullscreenRef.current) {
          draw(
            objects,
            canvasFullscreen,
            cardFullscreen.clientWidth,
            cardFullscreen.clientHeight,
            image.naturalWidth,
            image.naturalHeight
          )
        } else {
          draw(
            objects,
            canvas,
            card.clientWidth,
            card.clientHeight,
            image.naturalWidth,
            image.naturalHeight
          )
        }
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
  }, [objects])

  return (
    <>
      <Dialog
        keepMounted
        open={fullscreen}
        onClose={onClickAction}
        fullScreen
        style={{ width: '100%' }}
      >
        <Card
          ref={cardFullscreenRef}
          style={{
            width: 'fit-content',
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <CardActionArea onClick={onClickAction}>
            <canvas
              ref={canvasFullscreenRef}
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
                maxHeight: '100vh',
              }}
              component='img'
              image={imageSource}
              alt='detected image'
            />
          </CardActionArea>
        </Card>
      </Dialog>
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
              maxHeight: '83vh',
            }}
            component='img'
            image={imageSource}
            alt='detected image'
          />
        </CardActionArea>
      </Card>
    </>
  )
}

// export default memo(ImageContainer)
export default ImageContainer
