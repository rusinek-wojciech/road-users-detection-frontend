import styled from '@emotion/styled'
import { Card, CardActionArea, CardMedia } from '@mui/material'
import Webcam from 'react-webcam'

export const StyledCard = styled(Card)`
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

export const StyledCardActionArea = styled(CardActionArea)`
  width: fit-content;
  margin: 0 auto;
`

export const Canvas = styled.canvas`
  position: absolute;
  left: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background-color: ${(props: { isLoading: boolean }) =>
    props.isLoading ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0)'};
`

export const StyledCardMedia = styled(CardMedia)`
  width: 100%;
  object-fit: contain;
` as typeof CardMedia

export const StyledWebcam = styled(Webcam as any)`
  width: 100%;
  object-fit: contain;
  display: block;
` as unknown as typeof Webcam
