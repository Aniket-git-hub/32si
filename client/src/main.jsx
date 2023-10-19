import { ChakraProvider, ColorModeProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AllDataContextProvider } from './context/AllDataContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

const theme = extendTheme({
  colors: {
    bodyColor: "linear-gradient(to right, #3b3eed 0%, #85bbfd 100%)",
  },
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <ColorModeProvider options={{ useSystemColorMode: true }}>
        <AuthProvider>
          <AllDataContextProvider>
            <SocketProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SocketProvider>
          </AllDataContextProvider>
        </AuthProvider>
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
