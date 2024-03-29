import { useEffect, useRef, useState } from 'react'
import { GraphModel } from '@tensorflow/tfjs'
import Webcam from 'react-webcam'

import { synchronizedDetection } from 'services/detection'
import Spinner from 'components/Spinner'
import { draw } from 'services/drawing'
import {
  Canvas,
  StyledCard,
  StyledCardActionArea,
  StyledWebcam,
} from 'detections/styles'

const contraints: MediaTrackConstraints = {
  facingMode: 'environment',
}

interface Props {
  model: GraphModel
  fullscreen: boolean
  onClickAction: () => void
}

const VideoDetection = ({ model, fullscreen, onClickAction }: Props) => {
  const [loading, setLoading] = useState<boolean>(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const webcamRef = useRef<Webcam | null>(null)

  useEffect(() => {
    let mounted = true
    let frameRequest = 0
    const canvas = canvasRef.current!
    const webcam = webcamRef.current!

    webcam.video!.addEventListener(
      'loadeddata',
      () => {
        const animateDetect = async () => {
          const video = webcam.video
          if (!video) {
            return
          }

          const objects = await synchronizedDetection.onVideo(model, video)

          if (mounted) {
            canvas.width = video.videoWidth
            canvas.height = video.videoHeight
            draw(objects, canvas)
            frameRequest = requestAnimationFrame(animateDetect)
            setLoading(false)
          }
        }

        animateDetect()
      },
      {
        once: true,
      }
    )

    return () => {
      cancelAnimationFrame(frameRequest)
      mounted = false
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    }
  }, [model])

  const fullScreenClass = fullscreen ? 'fullscreen' : 'normal'

  return (
    <StyledCard className={fullScreenClass}>
      <StyledCardActionArea onClick={onClickAction}>
        {loading && <Spinner />}
        <Canvas
          className={fullScreenClass}
          ref={canvasRef}
          isLoading={loading}
        />
        <StyledWebcam
          className={fullScreenClass}
          ref={webcamRef}
          muted={true}
          videoConstraints={contraints}
        />
      </StyledCardActionArea>
    </StyledCard>
  )
}

export default VideoDetection
