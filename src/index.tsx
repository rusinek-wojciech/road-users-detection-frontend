import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from './App'
import { AppContextProvider } from './store/Context'
import { register } from './serviceWorkerRegistration'
import { enableProdMode, setBackend } from '@tensorflow/tfjs'

enableProdMode()
setBackend('webgl')
register()

ReactDOM.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
  document.getElementById('root')
)
