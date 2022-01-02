import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from './App'
import { AppContextProvider } from './store/Context'
import * as serviceWorker from './serviceWorker'

ReactDOM.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorker.register()
