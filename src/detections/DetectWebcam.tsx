import { RefObject, useEffect, useRef, memo } from 'react'
import { Card, CardActionArea } from '@mui/material'
import { DetectedObject } from '../services/detection'
import { draw } from '../services/drawing'
import Webcam from 'react-webcam'
import Spinner from '../components/Spinner'

interface Props {
  loading: boolean
  objects: DetectedObject[]
  webcamRef: RefObject<Webcam>
  onClickAction: () => void
  fullscreen?: boolean
}

const videoConstraints: MediaTrackConstraints = {
  facingMode: 'environment',
  width: { ideal: 1980 },
  height: { ideal: 1980 },
}

const DetectWebcam = (props: Props) => {
  const {
    loading,
    objects,
    webcamRef,
    onClickAction,
    fullscreen = false,
  } = props

  const cardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const frameRequest = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const card = cardRef.current

    const animateDraw = () => {
      if (webcamRef.current?.video && canvas && card) {
        draw(
          objects,
          canvas,
          card.clientWidth,
          card.clientHeight,
          webcamRef.current.video.videoWidth,
          webcamRef.current.video.videoHeight
        )
        frameRequest.current = requestAnimationFrame(animateDraw)
      }
    }
    animateDraw()

    return () => {
      cancelAnimationFrame(frameRequest.current)
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        }
      }
    }
  }, [objects, webcamRef])

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
        <Webcam
          ref={webcamRef}
          muted={true}
          style={{
            width: '100%',
            objectFit: 'contain',
            display: 'block',
            maxHeight: fullscreen ? '100vh' : '83vh',
          }}
          videoConstraints={videoConstraints}
        />
      </CardActionArea>
    </Card>
  )
}

export default memo(DetectWebcam)
