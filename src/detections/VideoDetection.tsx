import { useEffect, useRef, useState } from 'react'
import { GraphModel } from '@tensorflow/tfjs'
import { synchronizedDetection } from '../services/detection'
import Webcam from 'react-webcam'
import Spinner from '../components/Spinner'
import { draw } from '../services/drawing'
import {
  Canvas,
  StyledCard,
  StyledCardActionArea,
  StyledWebcam,
} from './styles'

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

  return (
    <StyledCard className={fullscreen ? 'fullscreen' : 'normal'}>
      <StyledCardActionArea onClick={onClickAction}>
        {loading && <Spinner />}
        <Canvas ref={canvasRef} isLoading={loading} />
        <StyledWebcam
          ref={webcamRef}
          muted={true}
          videoConstraints={contraints}
        />
      </StyledCardActionArea>
    </StyledCard>
  )
}

export default VideoDetection
