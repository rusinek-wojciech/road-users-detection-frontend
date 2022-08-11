import { useEffect, useState, useRef } from 'react'
import { GraphModel } from '@tensorflow/tfjs'
import styled from '@emotion/styled'
import { synchronizedDetection } from '../services/detection'
import { Card, CardActionArea, CardMedia } from '@mui/material'
import { draw } from '../services/drawing'
import Spinner from '../components/Spinner'

const StyledCard = styled(Card)`
  &.normal {
    position: relative;
    width: fit-content;
    margin: 0 auto;
  }
  &.fullscreen {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 100%;
  }
`

const StyledCardActionArea = styled(CardActionArea)`
  width: fit-content;
  margin: 0 auto;
`

const Canvas = styled.canvas`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: ${(props: { isLoading: boolean }) =>
    props.isLoading ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
`

const StyledCardMedia = styled(CardMedia)`
  width: 100%;
  object-fit: contain;
` as typeof CardMedia

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
      {loading && <Spinner />}
      <StyledCardActionArea onClick={onClickAction}>
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
