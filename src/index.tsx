import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from './App'
import { AppContextProvider } from './store/Context'
import * as serviceWorkerRegistration from './serviceWorkerRegistration'
import { initialize } from './init'

initialize()

ReactDOM.render(
  <StrictMode>
    <AppContextProvider>
      <App />
    </AppContextProvider>
  </StrictMode>,
  document.getElementById('root')
)

serviceWorkerRegistration.register({
  onSuccess: () => console.log('Registered service worker'),
})
