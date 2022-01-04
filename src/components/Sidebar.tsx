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

interface Props {
  enabled: boolean
  closeSidebar: () => void
  toggleSidebar: () => void
  paletteMode: PaletteMode
  togglePaletteMode: () => void
  labels: {
    name: string
    color: string
  }[]
}

const Sidebar = (props: Props) => {
  const {
    enabled,
    closeSidebar,
    toggleSidebar,
    paletteMode,
    togglePaletteMode,
    labels,
  } = props

  const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

  return (
    <div>
      <Drawer anchor={'left'} open={enabled} onClose={closeSidebar}>
        <Box
          sx={{ width: 250 }}
          role='presentation'
          onClick={toggleSidebar}
          onKeyDown={toggleSidebar}
        >
          <List subheader={<ListSubheader>Options</ListSubheader>}>
            <ListItem button key='Inbox' onClick={togglePaletteMode}>
              <ListItemAvatar>
                <Avatar>
                  {paletteMode === 'dark' ? (
                    <LightModeIcon />
                  ) : (
                    <DarkModeIcon />
                  )}
                </Avatar>
              </ListItemAvatar>

              {paletteMode === 'dark' ? (
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
