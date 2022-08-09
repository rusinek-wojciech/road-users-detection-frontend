import Backdrop from '@mui/material/Backdrop'
import CircularProgress from '@mui/material/CircularProgress'

interface Props {
  open: boolean
}

const BackdropSpinner = ({ open }: Props) => {
  return (
    <Backdrop
      sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
      open={open}
    >
      <CircularProgress color='inherit' disableShrink />
    </Backdrop>
  )
}

export default BackdropSpinner
