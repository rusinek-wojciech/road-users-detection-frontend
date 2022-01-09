import { useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import * as tf from '@tensorflow/tfjs'
import BackdropSpinner from './components/BackdropSpinner'
import ContentContainer from './detections/ContentContainer'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { getDesignTokens } from './services/theme'
import { useAppDispatch, useAppState } from './store/Context'
import {
  toggleSidebar,
  closeSidebar,
  togglePaletteMode,
  setModel,
} from './store/actions'
import { warmUp } from './services/detection'

const App = () => {
  const { sidebarEnabled, paletteMode, model, modelConfig } = useAppState()
  const dispatch = useAppDispatch()
  const theme = useMemo(
    () => createTheme(getDesignTokens(paletteMode)),
    [paletteMode]
  )
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!model) {
      tf.enableProdMode()
      tf.setBackend('webgl')
      tf.ready()
        .then(() => tf.loadGraphModel(modelConfig.path))
        .then((m) => {
          dispatch(setModel(m))
          warmUp(m)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setTimeout(() => setLoading(false), 3000))
    }
  }, [dispatch, model, modelConfig])

  const onTogglePaletteMode = () => dispatch(togglePaletteMode())
  const onCloseSidebar = () => dispatch(closeSidebar())
  const onToggleSidebar = () => dispatch(toggleSidebar())

  return (
    <ThemeProvider theme={theme}>
      {loading && <BackdropSpinner />}
      <CssBaseline />
      <Navbar
        paletteMode={paletteMode}
        onToggleSidebar={onToggleSidebar}
        onTogglePaletteMode={onTogglePaletteMode}
      />
      <Sidebar
        sidebarEnabled={sidebarEnabled}
        onCloseSidebar={onCloseSidebar}
        onToggleSidebar={onToggleSidebar}
        paletteMode={paletteMode}
        onTogglePaletteMode={onTogglePaletteMode}
        labels={modelConfig.labels}
      />
      {model && <ContentContainer model={model} modelConfig={modelConfig} />}
    </ThemeProvider>
  )
}

export default App
