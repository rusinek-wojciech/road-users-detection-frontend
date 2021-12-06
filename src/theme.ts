import { PaletteMode } from '@mui/material'
import { grey } from '@mui/material/colors'

export const getDesignTokens = (mode: PaletteMode) => ({
  palette: {
    type: mode,
    primary: {
      main: '#3f51b5',
    },
    secondary: {
      main: '#f50057',
    },
    ...(mode === 'dark' && {
      background: {
        default: '#1b212b',
        paper: '#1b212b',
      },
    }),
    text: {
      ...(mode === 'light'
        ? {
            primary: grey[900],
            secondary: grey[800],
          }
        : {
            primary: '#fff',
            secondary: grey[500],
          }),
    },
  },
})
