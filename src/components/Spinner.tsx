import styled from '@emotion/styled'
import { Box, CircularProgress } from '@mui/material'

const StyledBox = styled(Box)`
  position: absolute;
  top: 50%;
  left: 50%;
  z-index: 1000;
  transform: translate(-50%, -50%);
`

const Spinner = () => {
  return (
    <StyledBox>
      <CircularProgress disableShrink />
    </StyledBox>
  )
}

export default Spinner
