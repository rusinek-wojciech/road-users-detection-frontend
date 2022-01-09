import { PaletteMode } from '@mui/material'
import { grey } from '@mui/material/colors'

const PALETTE_MODE_KEY = 'PALETTE_MODE'

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

export const getPaletteMode = (): PaletteMode => {
  const mode = localStorage.getItem(PALETTE_MODE_KEY)
  return mode === 'dark' ? 'dark' : 'light'
}

export const setPaletteMode = (mode: PaletteMode): void => {
  localStorage.setItem(PALETTE_MODE_KEY, mode)
}
