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
import { DetectedObject, createPredictions } from '../services/detection'

interface Props {
  model: tf.GraphModel | null
}

type Mode = 'image' | 'webcam' | 'empty'

const ContentContainer = ({ model }: Props) => {
  const [detectedObjects, setDetectedObjects] = useState<DetectedObject[]>([])
  const [mode, setMode] = useState<Mode>('empty')
  const [loading, setLoading] = useState<boolean>(false)

  const cardRef = useRef<HTMLDivElement>(null)
  const webcamRef = useRef<Webcam>(null)
  const imageRef = useRef<HTMLImageElement | null>(null)
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
        if (imageRef && imageRef.current) {
          drawObjects(
            detectedObjects,
            ctx,
            clientWidth / imageRef.current.naturalWidth,
            clientHeight / imageRef.current.naturalHeight
          )
        } else if (mode === 'webcam' && webcamRef.current) {
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
  }, [detectedObjects, mode])

  useEffect(() => {
    const detectImage = async (image: HTMLImageElement) => {
      if (model) {
        createPredictions(model, image).then((objects) =>
          setDetectedObjects(objects)
        )
      }
    }

    const detectVideo = async (video: HTMLVideoElement) => {
      if (model && video) {
        createPredictions(model, video).then((objects) =>
          setDetectedObjects(objects)
        )
      }
    }

    if (mode === 'webcam' && webcamRef && webcamRef.current) {
      setInterval(() => {
        if (webcamRef.current && webcamRef.current.video) {
          detectVideo(webcamRef.current.video)
        }
      }, 500)
    } else if (mode === 'image' && imageRef && imageRef.current) {
      detectImage(imageRef.current)
    }
  }, [mode, model])

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode('empty')
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
        imageRef.current = image
        setMode('image')
      })
    }
  }

  const openCamera = () => {
    setMode('webcam')
    setDetectedObjects([])
    imageRef.current = null
    if (webcamRef.current) {
    }
  }

  let content: JSX.Element
  switch (mode) {
    case 'image':
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
            <CardMedia
              component='img'
              image={imageRef!.current!.src}
              alt='detected image'
            />
          </CardActionArea>
        </Card>
      )
      break
    case 'webcam':
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
      break
    default:
      content = (
        <Typography
          variant='h5'
          align='center'
          color='text.secondary'
          paragraph
        >
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

export default ContentContainer
