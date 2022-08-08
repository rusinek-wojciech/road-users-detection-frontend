import { memo, useEffect, useState } from 'react'
import { Dialog } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import detection from '../services/detection'
import DetectImage from './DetectImage'
import { DetectedObject, ModelConfig } from '../types'

interface Props {
  onClickAction: () => void
  model: GraphModel
  modelConfig: ModelConfig
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

  const [objects, setObjects] = useState<DetectedObject[]>([])
  const [[width, height], setImageSize] = useState<[number, number]>([0, 0])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    const img = new Image()
    img.src = imageSource

    const detectOnImage = async () => {
      const objects = await detection.detectImage(model, modelConfig, img)
      if (mounted) {
        setObjects(objects)
        setImageSize([img.naturalWidth, img.naturalHeight])
        setLoading(false)
      }
    }

    img.addEventListener('load', detectOnImage, { once: true })

    return () => {
      mounted = false
    }
  }, [imageSource, model, modelConfig])

  return (
    <>
      <Dialog
        open={fullscreen}
        onClose={onClickAction}
        fullScreen
        style={{ width: '100%' }}
      >
        <DetectImage
          loading={loading}
          objects={objects}
          imageSource={imageSource}
          width={width}
          height={height}
          onClickAction={onClickAction}
          fullscreen
        />
      </Dialog>
      <DetectImage
        loading={loading}
        objects={objects}
        imageSource={imageSource}
        width={width}
        height={height}
        onClickAction={onClickAction}
      />
    </>
  )
}

export default memo(ImageContainer)
