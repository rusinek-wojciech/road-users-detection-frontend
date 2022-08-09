import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from './App'
import { register } from './serviceWorkerRegistration'

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

register()
