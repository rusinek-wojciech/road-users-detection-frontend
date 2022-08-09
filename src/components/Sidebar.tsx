import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import ListSubheader from '@mui/material/ListSubheader'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import LightModeIcon from '@mui/icons-material/LightMode'
import DarkModeIcon from '@mui/icons-material/DarkMode'
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill'
import { Avatar, ListItemAvatar, PaletteMode } from '@mui/material'
import { MODEL_CONFIG } from '../config/models'

interface Props {
  sidebarEnabled: boolean
  paletteMode: PaletteMode
  onCloseSidebar: () => void
  onToggleSidebar: () => void
  onTogglePaletteMode: () => void
}

const Sidebar = ({
  sidebarEnabled,
  paletteMode,
  onCloseSidebar,
  onToggleSidebar,
  onTogglePaletteMode,
}: Props) => {
  const isDarkMode = paletteMode === 'dark'

  return (
    <div>
      <Drawer anchor={'left'} open={sidebarEnabled} onClose={onCloseSidebar}>
        <Box
          sx={{ width: 250 }}
          role='presentation'
          onClick={onToggleSidebar}
          onKeyDown={onToggleSidebar}
        >
          <List subheader={<ListSubheader>Options</ListSubheader>}>
            <ListItem button onClick={onTogglePaletteMode}>
              <ListItemAvatar>
                <Avatar>
                  {isDarkMode ? <LightModeIcon /> : <DarkModeIcon />}
                </Avatar>
              </ListItemAvatar>
              {isDarkMode ? (
                <ListItemText
                  primary='Light Mode'
                  secondary='Change to light mode'
                />
              ) : (
                <ListItemText
                  primary='Dark Mode'
                  secondary='Change to dark mode'
                />
              )}
            </ListItem>
          </List>
          <Divider />
          <List subheader={<ListSubheader>Labels</ListSubheader>}>
            {MODEL_CONFIG.labels.map(({ name, color }) => (
              <ListItem button key={name}>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: color }}>
                    <FormatColorFillIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={name} secondary={color} />
              </ListItem>
            ))}
          </List>
          <Divider />
        </Box>
      </Drawer>
    </div>
  )
}

export default Sidebar
