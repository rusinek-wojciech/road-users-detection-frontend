import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import { BackdropSpinner } from './components/BackdropSpinner'
import { ImageContainer } from './ImageContainer'
import { Navbar } from './components/Navbar'
import { getDesignTokens } from './theme'
import * as tf from '@tensorflow/tfjs'
import { config } from './config'
import { warmUp } from './utils'

export const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const [loading, setLoading] = useState<boolean>(true)
  const [model, setModel] = useState<tf.GraphModel | null>(null)

  useEffect(() => {
    tf.setBackend('webgl')
    tf.ready()
      .then(() => tf.loadGraphModel(config.PATH))
      .then((m) => {
        setModel(m)
        warmUp(m)
      })
      .catch(() => console.error('Failed to fetch model'))
      .finally(() => setLoading(false))
  }, [])

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
      {loading && <BackdropSpinner />}
      <CssBaseline />
      <Navbar mode={mode} toggleColorMode={colorMode.toggleColorMode} />
      <ImageContainer model={model} />
    </ThemeProvider>
  )
}
