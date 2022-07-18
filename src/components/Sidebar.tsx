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

const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

interface Label {
  name: string
  color: string
}

interface Props {
  sidebarEnabled: boolean
  labels: Label[]
  paletteMode: PaletteMode
  onCloseSidebar: () => void
  onToggleSidebar: () => void
  onTogglePaletteMode: () => void
}

const Sidebar = ({
  sidebarEnabled,
  labels,
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
            {labels.map((label) => (
              <ListItem button key={label.name}>
                <ListItemAvatar>
                  <Avatar style={{ backgroundColor: label.color }}>
                    <FormatColorFillIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={capitalize(label.name)}
                  secondary={label.color}
                />
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
