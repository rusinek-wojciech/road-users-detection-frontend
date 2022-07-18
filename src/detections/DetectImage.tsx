import { useEffect, useRef, memo } from 'react'
import { Card, CardActionArea, CardMedia } from '@mui/material'
import { DetectedObject } from '../services/detection'
import { draw } from '../services/drawing'
import Spinner from '../components/Spinner'

interface Props {
  loading: boolean
  objects: DetectedObject[]
  imageSource: string
  width: number
  height: number
  onClickAction: () => void
  fullscreen?: boolean
}

const DetectImage = (props: Props) => {
  const {
    loading,
    objects,
    imageSource,
    width,
    height,
    onClickAction,
    fullscreen = false,
  } = props

  const cardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let frameRequest = 0
    const canvas = canvasRef.current!
    const card = cardRef.current!

    const animateDraw = () => {
      const { clientWidth, clientHeight } = card
      draw(objects, canvas, clientWidth, clientHeight, width, height)
      frameRequest = requestAnimationFrame(animateDraw)
    }

    animateDraw()

    return () => {
      cancelAnimationFrame(frameRequest)
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }, [objects, width, height])

  return (
    <Card
      ref={cardRef}
      style={{
        position: 'relative',
        width: 'fit-content',
        marginLeft: 'auto',
        marginRight: 'auto',
      }}
    >
      {loading && <Spinner />}
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
            backgroundColor: loading
              ? 'rgba(0, 0, 0, 0.5)'
              : 'rgba(0, 0, 0, 0)',
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

export default memo(DetectImage)
