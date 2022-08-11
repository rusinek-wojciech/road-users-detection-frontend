import ReactDOM from 'react-dom'
import { StrictMode } from 'react'
import App from 'App'
import { register } from 'serviceWorkerRegistration'
// import { createRoot } from 'react-dom/client'

// const container = document.getElementById('root')!
// const root = createRoot(container)
// root.render(<App />)

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById('root')
)

register()
