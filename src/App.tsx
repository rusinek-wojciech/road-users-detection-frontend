import { useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import {
  ready,
  loadGraphModel,
  GraphModel,
  enableProdMode,
  setBackend,
} from '@tensorflow/tfjs'

import BackdropSpinner from './components/BackdropSpinner'
import ContentContainer from './detections/ContentContainer'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { getDesignTokens } from './services/theme'
import { useAppDispatch, useAppState } from './store/Context'
import { toggleSidebar, closeSidebar, togglePaletteMode } from './store/actions'
import detection from './services/detection'
import { MODEL_CONFIG } from './config/models'

const loadModel = async () => {
  enableProdMode()
  setBackend('webgl')
  await ready()
  const model = await loadGraphModel(MODEL_CONFIG.path)
  detection.warmUp(model)
  return model
}

const App = () => {
  const [model, setModel] = useState<GraphModel>()
  const { sidebarEnabled, paletteMode } = useAppState()
  const dispatch = useAppDispatch()
  const theme = useMemo(
    () => createTheme(getDesignTokens(paletteMode)),
    [paletteMode]
  )

  useEffect(() => {
    loadModel().then(setModel)
  }, [])

  const handleTogglePaletteMode = () => dispatch(togglePaletteMode())
  const handleCloseSidebar = () => dispatch(closeSidebar())
  const handleToggleSidebar = () => dispatch(toggleSidebar())

  const loading = !model

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
      />
      {model && <ContentContainer model={model} />}
    </ThemeProvider>
  )
}

export default App
