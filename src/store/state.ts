import { PaletteMode } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import { Config, ssdMobilenet } from '../services/config'
import { getPaletteMode } from '../services/theme'

export interface State {
  model: GraphModel | null
  sidebarEnabled: boolean
  paletteMode: PaletteMode
  modelConfig: Config
}

export const initialState: State = {
  model: null,
  sidebarEnabled: false,
  paletteMode: getPaletteMode(),
  modelConfig: ssdMobilenet(),
}
