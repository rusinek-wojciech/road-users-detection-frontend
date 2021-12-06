import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { App } from './App'
import { store } from './app/store'
import { Provider } from 'react-redux'
import * as serviceWorker from './serviceWorker'
import * as tf from '@tensorflow/tfjs'
import { warmUp } from './utils'
import { config } from './config'

// backend
tf.setBackend('webgl')

// download tensorflow model
export let model: tf.GraphModel | null = null
tf.ready()
  .then(() => tf.loadGraphModel(config.PATH))
  .then((m) => (model = m))
  .then((m) => warmUp(m))
  .then(() => console.log('Finished loading model'))
  .catch(() => console.log('Failed to fetch model'))

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
serviceWorker.register()
