import { PaletteMode } from '@mui/material'
import { getPaletteMode } from '../services/theme'

export interface State {
  sidebarEnabled: boolean
  paletteMode: PaletteMode
}

export const initialState: State = {
  sidebarEnabled: false,
  paletteMode: getPaletteMode(),
}
