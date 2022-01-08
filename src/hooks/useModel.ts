import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import { warmUp } from '../services/detection'
import { useAppDispatch, useAppState } from '../store/Context'
import { setModel } from '../store/actions'

const useModel = () => {
  const { model, modelConfig } = useAppState()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(!model)

  useEffect(() => {
    if (!model) {
      tf.enableProdMode()
      tf.setBackend('webgl')
      tf.ready()
        .then(() => tf.loadGraphModel(modelConfig.path))
        .then((m) => {
          dispatch(setModel(m))
          warmUp(m)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setTimeout(() => setLoading(false), 3000))
    }
  }, [dispatch, model, modelConfig])

  return [model, modelConfig, loading] as const
}

export default useModel
