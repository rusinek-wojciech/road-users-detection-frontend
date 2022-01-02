import { Actions, ActionType } from './actions'
import { State } from './state'

export const reducer = (state: State, action: Actions): State => {
  switch (action.type) {
    case ActionType.SET_MODEL:
      return {
        ...state,
        model: action.payload,
      }
    default:
      throw new Error(`Action invalid: ${action.type}`)
  }
}
