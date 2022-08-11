import { useEffect, useState, useRef } from 'react'
import { GraphModel } from '@tensorflow/tfjs'

import { synchronizedDetection } from 'services/detection'
import { draw } from 'services/drawing'
import Spinner from 'components/Spinner'
import {
  Canvas,
  StyledCard,
  StyledCardActionArea,
  StyledCardMedia,
} from 'detections/styles'

interface Props {
  model: GraphModel
  image: HTMLImageElement
  fullscreen: boolean
  onClickAction: () => void
}

const ImageDetection = ({ model, image, fullscreen, onClickAction }: Props) => {
  const [loading, setLoading] = useState<boolean>(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let mounted = true
    const canvas = canvasRef.current!

    image.addEventListener(
      'load',
      async () => {
        const objects = await synchronizedDetection.onImage(model, image)

        if (mounted) {
          canvas.width = image.width
          canvas.height = image.height
          draw(objects, canvas)
          setLoading(false)
        }
      },
      { once: true }
    )

    return () => {
      mounted = false
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
    }
  }, [image, model])

  return (
    <StyledCard className={fullscreen ? 'fullscreen' : 'normal'}>
      <StyledCardActionArea onClick={onClickAction}>
        {loading && <Spinner />}
        <Canvas ref={canvasRef} isLoading={loading} />
        <StyledCardMedia
          component='img'
          image={image.src}
          alt='detected image'
        />
      </StyledCardActionArea>
    </StyledCard>
  )
}

export default ImageDetection
