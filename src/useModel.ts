import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import { warmUp } from './utils'
import { config } from './config'
import { useAppDispatch, useAppState } from './store/Context'
import { setModel } from './store/actions'

const useModel = () => {
  const { model } = useAppState()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(!model)

  useEffect(() => {
    if (!model) {
      tf.setBackend('webgl')
      tf.ready()
        .then(() => tf.loadGraphModel(config.PATH))
        .then((m) => {
          dispatch(setModel(m))
          warmUp(m)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setTimeout(() => setLoading(false), 3000))
    }
  }, [dispatch, model])

  return [model, loading] as const
}

export default useModel
