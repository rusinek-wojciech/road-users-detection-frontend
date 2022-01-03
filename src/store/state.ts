import { PaletteMode } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import { Config, ssdMobilenet } from '../services/config'

export interface State {
  model: GraphModel | null
  sidebarEnabled: boolean
  paletteMode: PaletteMode
  modelConfig: Config
}

export const initialState: State = {
  model: null,
  sidebarEnabled: false,
  paletteMode: 'light',
  modelConfig: ssdMobilenet(),
}
