import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import Box from '@mui/material/Box'
import AppBar from '@mui/material/AppBar'
import IconButton from '@mui/material/IconButton'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import styled from '@emotion/styled'
import { PaletteMode } from '@mui/material'

interface Props {
  paletteMode: PaletteMode
  onTogglePaletteMode: () => void
  onToggleSidebar: () => void
}

const StyledBox = styled(Box)`
  flex-grow: 1;
`

const Navbar = ({
  paletteMode,
  onTogglePaletteMode,
  onToggleSidebar,
}: Props) => {
  const isDarkMode = paletteMode === 'dark'
  return (
    <StyledBox>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='open drawer'
            sx={{ mr: 2 }}
            onClick={onToggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            color='inherit'
            component='div'
            sx={{ flexGrow: 1 }}
          >
            Road Users Detection
          </Typography>
          <IconButton
            size='large'
            aria-label='change color mode'
            edge='end'
            color='inherit'
            onClick={onTogglePaletteMode}
          >
            {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </StyledBox>
  )
}

export default Navbar
