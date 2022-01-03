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
import { draw } from '../services/drawing'
import { DetectedObject, createPredictions } from '../services/detection'

interface Props {
  model: tf.GraphModel
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
  const requestDraw = useRef<number>()
  const stop = useRef<boolean>(false)

  // start rendering boxes
  useEffect(() => {
    const animateDraw = () => {
      if (canvasRef.current && cardRef.current) {
        const source = webcamRef.current?.video || imageRef.current
        if (source) {
          draw(detectedObjects, source, canvasRef.current, cardRef.current)
        }
      }
      requestDraw.current = requestAnimationFrame(animateDraw)
    }
    animateDraw()
    return () => cancelAnimationFrame(requestDraw?.current!)
  }, [detectedObjects])

  // start detecting for webcam
  useEffect(() => {
    if (mode === 'webcam' && webcamRef?.current?.video) {
      const { video } = webcamRef.current

      const animatePredict = () => {
        if (!stop.current) {
          createPredictions(model, video)
            .then((objects) => setDetectedObjects(objects))
            .then(() => requestAnimationFrame(animatePredict))
        }
      }

      video.addEventListener(
        'loadeddata',
        () => {
          stop.current = false
          animatePredict()
        },
        {
          once: true,
        }
      )
    }
    return () => {
      stop.current = true
    }
  }, [mode, model])

  // start detecting for image
  useEffect(() => {
    if (mode === 'image' && imageRef?.current && !loading) {
      setTimeout(() => {
        createPredictions(model, imageRef.current!).then((objects) =>
          setDetectedObjects(objects)
        )
      }, 500)
    }
  }, [mode, model, loading])

  const onChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (
      files &&
      files.length > 0 &&
      /\.(jpe?g|png|gif)$/i.test(files[0].name) &&
      !loading
    ) {
      setLoading(true)
      const image = new Image()
      image.src = URL.createObjectURL(files[0])
      imageRef.current = image
      image.addEventListener(
        'load',
        () => {
          setDetectedObjects([])
          setMode('image')
          setLoading(false)
        },
        { once: true }
      )
    }
  }

  const openCamera = () => {
    if (mode !== 'webcam') {
      setDetectedObjects([])
      setMode('webcam')
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
                display: 'block',
              }}
              videoConstraints={{
                facingMode: 'environment',
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
