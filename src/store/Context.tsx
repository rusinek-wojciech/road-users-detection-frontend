import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from 'react'
import { Actions } from './actions'
import { reducer } from './reducer'
import { State, initialState } from './state'

interface Props {
  children: ReactNode
}

const AppContext = createContext<{ state: State; dispatch: Dispatch<Actions> }>(
  {
    state: initialState,
    dispatch: () => undefined,
  }
)

export const AppContextProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  )
}

export const useAppDispatch = () => {
  const { dispatch } = useContext(AppContext)
  return dispatch
}

export const useAppState = () => {
  const { state } = useContext(AppContext)
  return state
}
