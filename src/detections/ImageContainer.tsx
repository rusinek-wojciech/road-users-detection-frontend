import { memo, useEffect, useState } from 'react'
import { Dialog } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import { synchronizedDetection } from '../services/detection'
import DetectImage from './DetectImage'
import { DetectedObject } from '../types'

interface Props {
  model: GraphModel
  imageSource: string
  fullscreen: boolean
  onClickAction: () => void
}

const ImageContainer = ({
  model,
  imageSource,
  fullscreen,
  onClickAction,
}: Props) => {
  const [objects, setObjects] = useState<DetectedObject[]>([])
  const [[width, height], setImageSize] = useState<[number, number]>([0, 0])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let mounted = true
    const img = new Image()
    img.src = imageSource

    img.addEventListener(
      'load',
      async () => {
        const objects = await synchronizedDetection.onImage(model, img)
        if (mounted) {
          setObjects(objects)
          setImageSize([img.naturalWidth, img.naturalHeight])
          setLoading(false)
        }
      },
      { once: true }
    )

    return () => {
      mounted = false
    }
  }, [imageSource, model])

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
        fullscreen={false}
      />
    </>
  )
}

export default memo(ImageContainer)
