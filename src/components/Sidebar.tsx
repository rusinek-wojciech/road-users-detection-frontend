import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import InboxIcon from '@mui/icons-material/MoveToInbox'
import MailIcon from '@mui/icons-material/Mail'

interface Props {
  enabled: boolean
  onClose: () => void
  onToggle: () => void
}

const Sidebar = ({ enabled, onClose, onToggle }: Props) => {
  return (
    <div>
      <Drawer anchor={'left'} open={enabled} onClose={onClose}>
        <Box
          sx={{ width: 250 }}
          role='presentation'
          onClick={onToggle}
          onKeyDown={onToggle}
        >
          <List>
            <ListItem button key='Inbox'>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Inbox' />
            </ListItem>
            <ListItem button key='Drafts'>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary='Drafts' />
            </ListItem>
          </List>
          <Divider />
          <List>
            <ListItem button key='Trash'>
              <ListItemIcon>
                <InboxIcon />
              </ListItemIcon>
              <ListItemText primary='Trash' />
            </ListItem>
            <ListItem button key='Spam'>
              <ListItemIcon>
                <MailIcon />
              </ListItemIcon>
              <ListItemText primary='Spam' />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </div>
  )
}

export default Sidebar
