import { useMemo } from 'react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import BackdropSpinner from './components/BackdropSpinner'
import ContentContainer from './containers/ContentContainer'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { getDesignTokens } from './services/theme'
import useModel from './hooks/useModel'
import { useAppDispatch, useAppState } from './store/Context'
import { toggleSidebar, closeSidebar, togglePaletteMode } from './store/actions'

const App = () => {
  const { sidebarEnabled, paletteMode, modelConfig } = useAppState()
  const dispatch = useAppDispatch()
  const [model, loading] = useModel()
  const theme = useMemo(
    () => createTheme(getDesignTokens(paletteMode)),
    [paletteMode]
  )

  const onTogglePaletteMode = () => dispatch(togglePaletteMode())
  const onCloseSidebar = () => dispatch(closeSidebar())
  const onToggleSidebar = () => dispatch(toggleSidebar())

  return (
    <ThemeProvider theme={theme}>
      {loading && <BackdropSpinner />}
      <CssBaseline />
      <Navbar
        paletteMode={paletteMode}
        togglePaletteMode={onTogglePaletteMode}
        toggleSidebar={onToggleSidebar}
      />
      <Sidebar
        enabled={sidebarEnabled}
        closeSidebar={onCloseSidebar}
        toggleSidebar={onToggleSidebar}
        paletteMode={paletteMode}
        togglePaletteMode={onTogglePaletteMode}
        labels={modelConfig.labels}
      />
      {model && <ContentContainer model={model} modelConfig={modelConfig} />}
    </ThemeProvider>
  )
}

export default App
