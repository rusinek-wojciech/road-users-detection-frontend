import { memo, useEffect, useRef, useState } from 'react'
import { Dialog } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import detection from '../services/detection'
import DetectWebcam from './DetectWebcam'
import Webcam from 'react-webcam'
import { DetectedObject } from '../types'

interface Props {
  onClickAction: () => void
  model: GraphModel
  fullscreen?: boolean
}

const WebcamContainer = (props: Props) => {
  const { onClickAction, model, fullscreen = false } = props

  const webcamRef = useRef<Webcam | null>(null)
  const webcamFullscreenRef = useRef<Webcam | null>(null)

  const [objects, setObjects] = useState<DetectedObject[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    let frameRequest = 0
    const webcam = webcamRef.current!

    const animateDetect = async () => {
      const video = webcam.video
      if (!video) {
        return
      }
      const objects = await detection.detectVideo(model, video)
      if (mounted) {
        setObjects(objects)
        frameRequest = requestAnimationFrame(animateDetect)
      }
    }

    const handleVideo = () => {
      animateDetect()
      if (mounted) {
        setLoading(false)
      }
    }

    webcam.video!.addEventListener('loadeddata', handleVideo, {
      once: true,
    })

    return () => {
      cancelAnimationFrame(frameRequest)
      mounted = false
    }
  }, [model])

  return (
    <>
      <Dialog
        open={fullscreen}
        onClose={onClickAction}
        fullScreen
        style={{ width: '100%' }}
      >
        <DetectWebcam
          loading={loading}
          objects={objects}
          webcamRef={webcamFullscreenRef}
          onClickAction={onClickAction}
          fullscreen
        />
      </Dialog>
      <DetectWebcam
        loading={loading}
        objects={objects}
        webcamRef={webcamRef}
        onClickAction={onClickAction}
      />
    </>
  )
}

export default memo(WebcamContainer)
