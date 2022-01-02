import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material'
import { useEffect, useMemo, useState } from 'react'
import BackdropSpinner from './components/BackdropSpinner'
import ImageContainer from './ImageContainer'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { getDesignTokens } from './theme'
import * as tf from '@tensorflow/tfjs'
import { config } from './config'
import { warmUp } from './utils'

const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const [loading, setLoading] = useState<boolean>(true)
  const [sidebar, setSidebar] = useState<boolean>(false)
  const [model, setModel] = useState<tf.GraphModel | null>(null)

  useEffect(() => {
    if (!model) {
      tf.setBackend('webgl')
      tf.ready()
        .then(() => tf.loadGraphModel(config.PATH))
        .then((m) => {
          setModel(m)
          warmUp(m)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setLoading(false))
    }
  }, [model])

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

  const onSidebarClose = () => setSidebar(false)
  const onSidebarToggle = () => setSidebar((prev) => !prev)

  return (
    <ThemeProvider theme={theme}>
      {loading && <BackdropSpinner />}
      <CssBaseline />
      <Navbar
        mode={mode}
        toggleColorMode={colorMode.toggleColorMode}
        toggleSidebar={onSidebarToggle}
      />
      <Sidebar
        enabled={sidebar}
        onClose={onSidebarClose}
        onToggle={onSidebarToggle}
      />
      <ImageContainer model={model} />
    </ThemeProvider>
  )
}

export default App
