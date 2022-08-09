import { useEffect, useMemo, useState } from 'react'
import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'

import BackdropSpinner from './components/BackdropSpinner'
import Detection from './detections/Detection'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { getDesignTokens, paletteModeLS } from './services/theme'
import { loadModelAndWarmUp } from './services/detection'

const App = () => {
  const [model, setModel] = useState<GraphModel>()
  const [sidebarEnabled, setSidebarEnabled] = useState<boolean>(false)
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(() =>
    paletteModeLS.get()
  )

  const theme = useMemo(
    () => createTheme(getDesignTokens(paletteMode)),
    [paletteMode]
  )

  useEffect(() => {
    loadModelAndWarmUp().then(setModel)
  }, [])

  const handleTogglePaletteMode = (): void => {
    const newPaletteMde = paletteMode === 'light' ? 'dark' : 'light'
    paletteModeLS.set(newPaletteMde)
    setPaletteMode(newPaletteMde)
  }
  const handleCloseSidebar = (): void => setSidebarEnabled(false)
  const handleToggleSidebar = (): void => setSidebarEnabled(!sidebarEnabled)

  const loading = !model

  return (
    <ThemeProvider theme={theme}>
      <BackdropSpinner open={loading} />
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
      {!loading && <Detection model={model} />}
    </ThemeProvider>
  )
}

export default App
