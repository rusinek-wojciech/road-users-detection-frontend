import { RefObject, useEffect, useRef, memo } from 'react'
import { Card, CardActionArea } from '@mui/material'
import { draw } from '../services/drawing'
import Webcam from 'react-webcam'
import Spinner from '../components/Spinner'
import { DetectedObject } from '../types'

interface Props {
  loading: boolean
  objects: DetectedObject[]
  webcamRef: RefObject<Webcam>
  fullscreen: boolean
  onClickAction: () => void
}

const contraints: MediaTrackConstraints = {
  facingMode: 'environment',
}

const DetectWebcam = ({
  loading,
  objects,
  webcamRef,
  fullscreen,
  onClickAction,
}: Props) => {
  const cardRef = useRef<HTMLDivElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    let frameRequest = 0
    const canvas = canvasRef.current!
    const card = cardRef.current!
    const webcam = webcamRef.current!

    const animateDraw = () => {
      const video = webcam.video
      if (!video) {
        return
      }
      draw(objects, canvas)
      frameRequest = requestAnimationFrame(animateDraw)
    }

    animateDraw()

    return () => {
      cancelAnimationFrame(frameRequest)
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
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
          videoConstraints={contraints}
        />
      </CardActionArea>
    </Card>
  )
}

export default memo(DetectWebcam)
