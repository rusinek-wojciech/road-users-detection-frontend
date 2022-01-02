import { GraphModel } from '@tensorflow/tfjs'

export enum ActionType {
  SET_MODEL = 'SET_MODEL',
}

export const setModel = (model: GraphModel) => ({
  type: ActionType.SET_MODEL,
  payload: model,
})

export type Actions = ReturnType<typeof setModel>
