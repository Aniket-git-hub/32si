import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { AllDataContextProvider } from './context/AllDataContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

const theme = extendTheme({
  colors: {
    bodyColor: "linear-gradient(to right, #3b3eed 0%, #85bbfd 100%)",
  }
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AllDataContextProvider>
          <SocketProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SocketProvider>
        </AllDataContextProvider>
      </AuthProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
