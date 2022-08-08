import { useEffect, useMemo, useState } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { ready, loadGraphModel } from '@tensorflow/tfjs'

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
      ready()
        .then(() => loadGraphModel(modelConfig.path))
        .then((model) => {
          dispatch(setModel(model))
          warmUp(model)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setLoading(false))
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
