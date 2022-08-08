import { PaletteMode } from '@mui/material'
import { GraphModel } from '@tensorflow/tfjs'
import { MODEL } from '../config/models'
import { ModelConfig } from '../config/models'
import { getPaletteMode } from '../services/theme'

export interface State {
  model: GraphModel | null
  sidebarEnabled: boolean
  paletteMode: PaletteMode
  modelConfig: ModelConfig
}

export const initialState: State = {
  model: null,
  sidebarEnabled: false,
  paletteMode: getPaletteMode(),
  modelConfig: MODEL,
}
