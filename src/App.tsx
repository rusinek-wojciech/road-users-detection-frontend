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
import { WARMUP_TIME } from './services/config'

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
      tf.ready()
        .then(() => tf.loadGraphModel(modelConfig.path))
        .then((m) => {
          dispatch(setModel(m))
          warmUp(m)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setTimeout(() => setLoading(false), WARMUP_TIME))
    }
  }, [dispatch, model, modelConfig])

  const handleTogglePaletteMode = () => dispatch(togglePaletteMode())
  const handleCloseSidebar = () => dispatch(closeSidebar())
  const handleToggleSidebar = () => dispatch(toggleSidebar())

  return (
    <ThemeProvider theme={theme}>
      {loading && <BackdropSpinner />}
      <CssBaseline />
      <Navbar
        paletteMode={paletteMode}
        onToggleSidebar={handleToggleSidebar}
        onTogglePaletteMode={handleTogglePaletteMode}
      />
      <Sidebar
        sidebarEnabled={sidebarEnabled}
        onCloseSidebar={handleCloseSidebar}
        onToggleSidebar={handleToggleSidebar}
        paletteMode={paletteMode}
        onTogglePaletteMode={handleTogglePaletteMode}
        labels={modelConfig.labels}
      />
      {model && <ContentContainer model={model} modelConfig={modelConfig} />}
    </ThemeProvider>
  )
}

export default App
