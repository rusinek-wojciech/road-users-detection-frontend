import {
  createTheme,
  CssBaseline,
  PaletteMode,
  ThemeProvider,
} from '@mui/material'
import { useMemo, useState } from 'react'
import BackdropSpinner from './components/BackdropSpinner'
import ImageContainer from './ImageContainer'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { getDesignTokens } from './theme'
import useModel from './useModel'

const App = () => {
  const [mode, setMode] = useState<PaletteMode>('dark')
  const [sidebar, setSidebar] = useState<boolean>(false)
  const [model, loading] = useModel()

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
