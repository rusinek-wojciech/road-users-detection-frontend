import { useEffect, useState } from 'react'
import * as tf from '@tensorflow/tfjs'
import { warmUp } from './utils'
import { config } from './config'

const useModel = () => {
  const [model, setModel] = useState<tf.GraphModel | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    if (!model) {
      tf.setBackend('webgl')
      tf.ready()
        .then(() => tf.loadGraphModel(config.PATH))
        .then((m) => {
          setModel(m)
          warmUp(m)
        })
        .catch(() => console.error('Failed to fetch model'))
        .finally(() => setLoading(false))
    }
  }, [model])

  return [model, loading] as const
}

export default useModel
