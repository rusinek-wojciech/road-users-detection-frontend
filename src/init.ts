import * as tf from '@tensorflow/tfjs'

export const initialize = () => {
  tf.enableProdMode()
  tf.setBackend('webgl')
}
