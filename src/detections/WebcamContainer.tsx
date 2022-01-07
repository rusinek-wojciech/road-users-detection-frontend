import { memo, useEffect, useRef, useState } from 'react'
import { Dialog } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import { DetectedObject, detect } from '../services/detection'
import { Config } from '../services/config'
import DetectWebcam from './DetectWebcam'
import Webcam from 'react-webcam'

interface Props {
  onClickAction: () => void
  model: GraphModel
  modelConfig: Config
  shouldClose: boolean // if component should be unmounted
  setCloseable: (b: boolean) => void // indicate that component can be unmounted
  fullscreen?: boolean
}

const WebcamContainer = (props: Props) => {
  const {
    onClickAction,
    model,
    modelConfig,
    shouldClose,
    setCloseable,
    fullscreen = false,
  } = props

  const webcamRef = useRef<Webcam | null>(null)
  const webcamFullscreenRef = useRef<Webcam | null>(null)
  const shouldCloseRef = useRef<boolean>(false)

  const [objects, setObjects] = useState<DetectedObject[]>([])

  useEffect(() => {
    shouldCloseRef.current = shouldClose
  }, [shouldClose])

  useEffect(() => {
    if (webcamRef?.current?.video) {
      const { video } = webcamRef.current

      const animateDetect = async () => {
        const objects = await detect(
          model,
          modelConfig,
          video,
          video.videoWidth,
          video.videoHeight
        )
        if (shouldCloseRef.current) {
          setCloseable(true)
        } else {
          setObjects(objects)
          requestAnimationFrame(animateDetect)
        }
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
  }, [model, modelConfig, setCloseable])

  return (
    <>
      <Dialog
        open={fullscreen}
        onClose={onClickAction}
        fullScreen
        style={{ width: '100%' }}
      >
        <DetectWebcam
          objects={objects}
          webcamRef={webcamFullscreenRef}
          onClickAction={onClickAction}
          fullscreen
        />
      </Dialog>
      <DetectWebcam
        objects={objects}
        webcamRef={webcamRef}
        onClickAction={onClickAction}
      />
    </>
  )
}

export default memo(WebcamContainer)
