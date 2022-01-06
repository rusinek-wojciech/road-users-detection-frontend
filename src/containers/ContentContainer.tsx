import { useEffect, useRef, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Config } from '../services/config'
import ImageContainer from './ImageContainer'
import WebcamContainer from './WebcamContainer'
import { Dialog } from '@mui/material'

interface Props {
  model: tf.GraphModel
  modelConfig: Config
}

type Mode =
  | 'empty'
  | 'webcam'
  | 'image'
  | 'fullscreen-image'
  | 'fullscreen-webcam'

const ContentContainer = ({ model, modelConfig }: Props) => {
  const [mode, setMode] = useState<Mode>('empty')
  const nextMode = useRef<Mode>('empty')

  const [webcamShouldClose, setWebcamShouldClose] = useState<boolean>(false)
  const [webcamCloseable, setWebcamCloseable] = useState<boolean>(false)

  const [imageSource, setImageSource] = useState<string | null>(null)

  useEffect(() => {
    if (webcamCloseable) {
      setMode(nextMode.current)
      setWebcamCloseable(false)
      setWebcamShouldClose(false)
    }
  }, [webcamCloseable])

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (
      files &&
      files.length > 0 &&
      /\.(jpe?g|png|gif)$/i.test(files[0].name)
    ) {
      setImageSource(URL.createObjectURL(files[0]))
      if (mode === 'webcam') {
        nextMode.current = 'image'
        setWebcamShouldClose(true)
      } else {
        setMode('image')
      }
    }
  }

  const handleOpenCamera = () => {
    setImageSource(null)
    setMode('webcam')
  }

  const toggleWebcamFullscreen = () => {
    if (mode === 'fullscreen-webcam') {
      nextMode.current = 'webcam'
    } else if (mode === 'webcam') {
      nextMode.current = 'fullscreen-webcam'
    }
    setWebcamShouldClose(true)
  }
  const toggleImageFullscreen = () => {
    setMode((m) => (m === 'image' ? 'fullscreen-image' : 'image'))
  }

  const content = () => {
    if (mode === 'empty') {
      return (
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
    if (mode === 'image') {
      return (
        <ImageContainer
          onClickAction={toggleImageFullscreen}
          model={model}
          modelConfig={modelConfig}
          imageSource={imageSource!}
        />
      )
    }
    if (mode === 'fullscreen-image') {
      return (
        <Dialog
          keepMounted
          open={true}
          onClose={toggleImageFullscreen}
          fullScreen
          style={{ width: '100%' }}
        >
          <ImageContainer
            onClickAction={toggleImageFullscreen}
            model={model}
            modelConfig={modelConfig}
            imageSource={imageSource!}
            fullscreen
          />
        </Dialog>
      )
    }
    if (mode === 'webcam') {
      return (
        <WebcamContainer
          onClickAction={toggleWebcamFullscreen}
          model={model}
          modelConfig={modelConfig}
          shouldClose={webcamShouldClose}
          setCloseable={setWebcamCloseable}
        />
      )
    }
    if (mode === 'fullscreen-webcam') {
      return (
        <Dialog
          keepMounted
          open={true}
          onClose={toggleWebcamFullscreen}
          fullScreen
          style={{ width: '100%' }}
        >
          <WebcamContainer
            onClickAction={toggleWebcamFullscreen}
            model={model}
            modelConfig={modelConfig}
            shouldClose={webcamShouldClose}
            setCloseable={setWebcamCloseable}
            fullscreen
          />
        </Dialog>
      )
    }
    throw new Error('Invalid state')
  }

  return (
    <main style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <Container style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {content()}
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
            onChange={handleChangeImage}
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
            onClick={handleOpenCamera}
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
