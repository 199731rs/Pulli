import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { EnquiryProvider } from './context/EnquiryContext.jsx'
import './styles/global.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <EnquiryProvider>
        <App />
      </EnquiryProvider>
    </BrowserRouter>
  </React.StrictMode>,
)
