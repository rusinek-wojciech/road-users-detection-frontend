import { setPaletteMode } from '../services/theme'
import { Actions, ActionType } from './actions'
import { State } from './state'

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case ActionType.TOGGLE_SIDEBAR:
      return {
        ...state,
        sidebarEnabled: !state.sidebarEnabled,
      }
    case ActionType.CLOSE_SIDEBAR:
      return {
        ...state,
        sidebarEnabled: false,
      }
    case ActionType.TOGGLE_PALETTE_MODE:
      const paletteMode = state.paletteMode === 'light' ? 'dark' : 'light'
      setPaletteMode(paletteMode)
      return {
        ...state,
        paletteMode,
      }
    default:
      throw new Error(`Action invalid: ${action.type}`)
  }
}
