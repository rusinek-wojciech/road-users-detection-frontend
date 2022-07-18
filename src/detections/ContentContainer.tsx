import { useState } from 'react'
import { GraphModel } from '@tensorflow/tfjs'
import FileUploadIcon from '@mui/icons-material/FileUpload'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import CloseIcon from '@mui/icons-material/Close'
import Typography from '@mui/material/Typography'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import { Config } from '../services/config'
import ImageContainer from './ImageContainer'
import WebcamContainer from './WebcamContainer'

interface Props {
  model: GraphModel
  modelConfig: Config
}

type Mode = 'empty' | 'webcam' | 'image'

const ContentContainer = ({ model, modelConfig }: Props) => {
  const [mode, setMode] = useState<Mode>('empty')
  const [imageSource, setImageSource] = useState<string | null>(null)
  const [fullscreen, setFullscreen] = useState<boolean>(false)

  const handleChangeImage = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target
    if (
      files &&
      files.length > 0 &&
      /\.(jpe?g|png|gif)$/i.test(files[0].name)
    ) {
      setImageSource(URL.createObjectURL(files[0]))
      setMode('image')
    }
    // allows reselecting same file
    event.target.value = ''
  }

  const handleOpenCamera = () => {
    setImageSource(null)
    setMode('webcam')
  }

  const toggleFullscreen = () => {
    setFullscreen((fs) => !fs)
  }

  const handleCloseAll = () => {
    setMode('empty')
  }

  return (
    <main style={{ paddingTop: '1rem', paddingBottom: '1rem' }}>
      <Container style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        {mode === 'empty' ? (
          <Typography
            variant='h5'
            align='center'
            color='text.secondary'
            paragraph
          >
            Please upload your photo
          </Typography>
        ) : mode === 'image' ? (
          <ImageContainer
            key={imageSource}
            onClickAction={toggleFullscreen}
            model={model}
            modelConfig={modelConfig}
            imageSource={imageSource!}
            fullscreen={fullscreen}
          />
        ) : mode === 'webcam' ? (
          <WebcamContainer
            onClickAction={toggleFullscreen}
            model={model}
            modelConfig={modelConfig}
            fullscreen={fullscreen}
          />
        ) : null}
        <Stack
          sx={{ pt: 4 }}
          display={'flex'}
          direction={'row'}
          flexWrap={'wrap'}
          gap={2}
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
              style={{ width: '100%' }}
              variant='contained'
              component='span'
              startIcon={<FileUploadIcon />}
            >
              Upload
            </Button>
          </label>
          <Button
            variant='contained'
            color='info'
            onClick={handleOpenCamera}
            startIcon={<PhotoCameraIcon />}
          >
            Camera
          </Button>
          {mode !== 'empty' && (
            <Button
              variant='contained'
              color='error'
              onClick={handleCloseAll}
              startIcon={<CloseIcon />}
            >
              Close
            </Button>
          )}
        </Stack>
      </Container>
    </main>
  )
}

export default ContentContainer
