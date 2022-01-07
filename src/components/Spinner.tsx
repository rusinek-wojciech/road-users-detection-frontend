import { Box, CircularProgress } from '@mui/material'

const Spinner = () => {
  return (
    <Box
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        zIndex: 1000,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <CircularProgress disableShrink />
    </Box>
  )
}

export default Spinner
