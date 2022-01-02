import { Actions, ActionType } from './actions'
import { State } from './state'

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case ActionType.SET_MODEL:
      return {
        ...state,
        model: action.payload,
      }
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
      return {
        ...state,
        paletteMode: state.paletteMode === 'light' ? 'dark' : 'light',
      }
    default:
      throw new Error(`Action invalid: ${action.type}`)
  }
}
