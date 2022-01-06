import { useEffect, useRef } from 'react'
import { Card, CardActionArea } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import Webcam from 'react-webcam'
import { DetectedObject, detect } from '../services/detection'
import { draw } from '../services/drawing'
import { Config } from '../services/config'

interface Props {
  onClickAction: () => void
  model: GraphModel
  modelConfig: Config
  shouldClose: boolean // if component should be unmounted
  setCloseable: (b: boolean) => void // indicate that component can be unmounted
}

const WebcamContainer = (props: Props) => {
  const { onClickAction, model, modelConfig, shouldClose, setCloseable } = props

  const cardRef = useRef<HTMLDivElement>(null)
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const shouldCloseRef = useRef<boolean>(false)
  const frameRequest = useRef<number>(0)

  useEffect(() => {
    shouldCloseRef.current = shouldClose
  }, [shouldClose])

  useEffect(() => {
    const canvas = canvasRef.current
    const card = cardRef.current

    if (webcamRef?.current?.video && canvas && card && !shouldClose) {
      const { video } = webcamRef.current

      const animateDraw = (objects: DetectedObject[]) => {
        draw(
          objects,
          canvas,
          card.clientWidth,
          card.clientHeight,
          video.videoWidth,
          video.videoHeight
        )
        frameRequest.current = requestAnimationFrame(() => animateDraw(objects))
      }

      const animateDetect = () => {
        setTimeout(async () => {
          const objects = await detect(
            model,
            modelConfig,
            video,
            video.videoWidth,
            video.videoHeight
          )
          cancelAnimationFrame(frameRequest.current)
          if (shouldCloseRef.current) {
            setCloseable(true)
          } else {
            animateDraw(objects)
            animateDetect()
          }
        })
      }

      video.addEventListener(
        'loadeddata',
        () => {
          animateDetect()
        },
        {
          once: true,
        }
      )
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
  }, [model, modelConfig, setCloseable, shouldClose])

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
        <Webcam
          ref={webcamRef}
          muted={true}
          width='500'
          style={{
            width: '100%',
            objectFit: 'contain',
            display: 'block',
            maxHeight: '83vh',
          }}
          videoConstraints={{
            facingMode: 'environment',
          }}
        />
      </CardActionArea>
    </Card>
  )
}

export default WebcamContainer
