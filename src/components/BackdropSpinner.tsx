import styled from '@emotion/styled'
import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

const StyledBackdrop = styled(Backdrop)`
  color: #fff;
  z-index: 1000;
`
interface Props {
  open: boolean
}

const BackdropSpinner = ({ open }: Props) => {
  return (
    <StyledBackdrop open={open}>
      <CircularProgress color='inherit' disableShrink />
    </StyledBackdrop>
  )
}

export default BackdropSpinner
