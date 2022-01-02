import { PaletteMode } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'

export interface State {
  model: GraphModel | null
  sidebarEnabled: boolean
  paletteMode: PaletteMode
}

export const initialState: State = {
  model: null,
  sidebarEnabled: false,
  paletteMode: 'light',
}
