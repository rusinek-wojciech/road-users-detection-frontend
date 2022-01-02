import {
  AppBar,
  Box,
  IconButton,
  PaletteMode,
  Toolbar,
  Typography,
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'

interface Props {
  mode: PaletteMode
  toggleColorMode: () => void
  toggleSidebar: () => void
}

const Navbar = ({ mode, toggleColorMode, toggleSidebar }: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar variant='dense'>
          <IconButton
            size='large'
            edge='start'
            color='inherit'
            aria-label='open drawer'
            sx={{ mr: 2 }}
            onClick={toggleSidebar}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant='h6'
            color='inherit'
            component='div'
            sx={{ flexGrow: 1 }}
          >
            Road Traffic Recognition
          </Typography>
          <IconButton
            size='large'
            aria-label='change color mode'
            edge='end'
            color='inherit'
            onClick={toggleColorMode}
          >
            {mode === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar
