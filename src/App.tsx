import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material'
import { grey } from '@mui/material/colors'
import { useMemo, useState } from 'react'
import { ImageContainer } from './ImageContainer'
import { Navbar } from './Navbar'

const getDesignTokens = (mode: PaletteMode) => ({
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

export const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode: PaletteMode) =>
          prevMode === 'light' ? 'dark' : 'light'
        )
      },
    }),
    []
  )

  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Navbar mode={mode} toggleColorMode={colorMode.toggleColorMode} />
      <ImageContainer />
    </ThemeProvider>
  )
}
