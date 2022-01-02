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
import Webcam from 'react-webcam'
import { drawObjects } from '../services/drawing'
import {
  detectObjects,
  DetectedObject,
  getTensorImage,
} from '../services/detection'
import { config } from '../services/config'

interface Props {
  model: tf.GraphModel | null
}

const ImageContainer = ({ model }: Props) => {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [image, setImage] = useState<HTMLImageElement | null>()
  const [isCamera, setIsCamera] = useState<boolean>(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const webcamRef = useRef<Webcam>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const requestRef = useRef<number>()

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    const draw = () => {
      if (ctx && canvasRef.current && cardRef.current) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        const { clientWidth, clientHeight } = cardRef.current
        canvasRef.current.width = clientWidth
        canvasRef.current.height = clientHeight
        if (image) {
          drawObjects(
            detectedObjects,
            ctx,
            clientWidth / image.naturalWidth,
            clientHeight / image.naturalHeight
          )
        } else if (isCamera && webcamRef.current) {
          if (webcamRef.current.video) {
            const { video } = webcamRef.current
            drawObjects(
              detectedObjects,
              ctx,
              clientWidth / video.videoWidth,
              clientHeight / video.videoHeight
            )
          }
        }
      }
      requestRef.current = requestAnimationFrame(draw)
    }
    requestRef.current = requestAnimationFrame(draw)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [image, detectedObjects, isCamera])

  useEffect(() => {
    const detectImage = async (image: HTMLImageElement) => {
      if (model) {
        tf.engine().startScope()
        model
          .executeAsync(
            getTensorImage(image, config.MODEL_WIDTH, config.MODEL_HEIGHT)
          )
          .then(async (predictions: any) => {
            const boxes = predictions[config.BOXES_INDEX].arraySync()[0]
            const classes = predictions[config.CLASSES_INDEX].arraySync()[0]
            const scores = predictions[config.SCORES_INDEX].arraySync()[0]
            // console.log('boxes', boxes)
            // console.log('classes', classes)
            // console.log('scores', scores)
            return detectObjects(
              boxes,
              classes,
              scores,
              config.TRESHOLD,
              image.naturalWidth,
              image.naturalHeight
            )
          })
          .then((objects) => setDetectedObjects(objects))
          .finally(() => tf.engine().endScope())
      }
    }

    const detectVideo = async (video: HTMLVideoElement) => {
      if (model && video) {
        tf.engine().startScope()
        model
          .executeAsync(
            getTensorImage(video, config.MODEL_WIDTH, config.MODEL_HEIGHT)
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
              video.videoWidth,
              video.videoHeight
            )
          })
          .then((objects: DetectedObject[]) => setDetectedObjects(objects))
          .finally(() => tf.engine().endScope())
      }
    }

    if (isCamera) {
      setInterval(() => {
        if (webcamRef.current) {
          if (webcamRef.current.video) {
            detectVideo(webcamRef.current.video)
          }
        }
      }, 500)
    } else if (image) {
      detectImage(image)
    }
  }, [image, isCamera, model])

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsCamera(false)
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

  const openCamera = () => {
    setImage(null)
    setIsCamera(true)
  }

  let content: JSX.Element
  if (image) {
    content = (
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
    )
  } else if (isCamera) {
    content = (
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
          <Webcam
            ref={webcamRef}
            muted={true}
            width='500'
            style={{
              width: '100%',
              objectFit: 'fill',
            }}
          />
        </CardActionArea>
      </Card>
    )
  } else {
    content = (
      <Typography variant='h5' align='center' color='text.secondary' paragraph>
        Please upload your photo
      </Typography>
    )
  }

  return (
    <main style={{ paddingTop: '1rem' }}>
      <Container>
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
          <Button
            variant='outlined'
            component='span'
            onClick={openCamera}
            startIcon={<PhotoCameraIcon />}
          >
            Camera
          </Button>
        </Stack>
      </Container>
    </main>
  )
}

export default ImageContainer
