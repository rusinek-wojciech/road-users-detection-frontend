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
  const { sidebarEnabled, paletteMode } = useAppState()
  const dispatch = useAppDispatch()
  const [model, loading] = useModel()
  const theme = useMemo(
    () => createTheme(getDesignTokens(paletteMode)),
    [paletteMode]
  )

  const onToggleMode = () => dispatch(togglePaletteMode())
  const onSidebarClose = () => dispatch(closeSidebar())
  const onSidebarToggle = () => dispatch(toggleSidebar())

  return (
    <ThemeProvider theme={theme}>
      {loading && <BackdropSpinner />}
      <CssBaseline />
      <Navbar
        mode={paletteMode}
        toggleMode={onToggleMode}
        toggleSidebar={onSidebarToggle}
      />
      <Sidebar
        enabled={sidebarEnabled}
        onClose={onSidebarClose}
        onToggle={onSidebarToggle}
      />
      {model && <ContentContainer model={model} />}
    </ThemeProvider>
  )
}

export default App
