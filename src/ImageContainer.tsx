import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import {
  Button,
  Card,
  CardActionArea,
  CardMedia,
  Container,
  Stack,
  Typography,
} from '@mui/material'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import {
  detectObjects,
  drawObjects,
  DetectedObject,
  getTensorImage,
} from './utils'
import { config } from './config'

interface Props {
  model: tf.GraphModel | null
}

export const ImageContainer = ({ model }: Props) => {
  const [image, setImage] = useState<HTMLImageElement | null>()
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    const draw = () => {
      if (ctx && canvasRef.current && image && cardRef.current) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const { clientWidth, clientHeight } = cardRef.current
        canvasRef.current.width = clientWidth
        canvasRef.current.height = clientHeight
        drawObjects(
          detectedObjects,
          ctx,
          clientWidth / image.naturalWidth,
          clientHeight / image.naturalHeight
        )
      }
      requestRef.current = requestAnimationFrame(draw)
    }
    requestRef.current = requestAnimationFrame(draw)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [image, detectedObjects])

  useEffect(() => {
    const detect = async () => {
      if (image && model) {
        tf.engine().startScope()
        model
          .executeAsync(
            getTensorImage(image, config.MODEL_WIDTH, config.MODEL_HEIGHT)
          )
          .then(async (predictions: any) => {
            const boxes = predictions[config.BOXES_INDEX].arraySync()[0]
            const classes = predictions[config.CLASSES_INDEX].arraySync()[0]
            const scores = predictions[config.SCORES_INDEX].arraySync()[0]
            return detectObjects(
              boxes,
              classes,
              scores,
              config.TRESHOLD,
              image.naturalWidth,
              image.naturalHeight
            )
          })
          .then((objects: DetectedObject[]) => setDetectedObjects(objects))
          .finally(() => tf.engine().endScope())
      }
    }
    detect()
  }, [image, model])

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (
      files &&
      files.length > 0 &&
      /\.(jpe?g|png|gif)$/i.test(files[0].name)
    ) {
      const image = new Image()
      image.src = URL.createObjectURL(files[0])
      image.addEventListener('load', () => {
        setDetectedObjects([])
        setImage(image)
      })
    }
  }

  const content = image ? (
    <Card ref={cardRef}>
      <CardActionArea>
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
        <CardMedia component='img' image={image.src} alt='detected image' />
      </CardActionArea>
    </Card>
  ) : (
    <Typography variant='h5' align='center' color='text.secondary' paragraph>
      Please upload your photo
    </Typography>
  )

  return (
    <main style={{ paddingTop: '1rem' }}>
      <Container maxWidth='sm'>
        {content}
        <Stack
          sx={{ pt: 4 }}
          direction='row'
          spacing={2}
          justifyContent='center'
        >
          <input
            accept='image/*'
            style={{ display: 'none' }}
            id='upload-image'
            type='file'
            onChange={onChangeImage}
          />
          <label htmlFor='upload-image'>
            <Button
              variant='contained'
              component='span'
              startIcon={<FileUploadIcon />}
            >
              Upload
            </Button>
          </label>
          <Button variant='outlined' startIcon={<PhotoCameraIcon />}>
            Camera
          </Button>
        </Stack>
      </Container>
    </main>
  )
}
