import { GraphModel } from '@tensorflow/tfjs'

export interface State {
  model: GraphModel | null
}

export const initialState: State = {
  model: null,
}
