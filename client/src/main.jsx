import { ChakraProvider, ColorModeProvider, ColorModeScript, extendTheme } from '@chakra-ui/react'
import { MotionConfig } from 'framer-motion'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AllDataContextProvider } from './context/AllDataContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { GameSettingsProvider } from './context/GameSettingsContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

const theme = extendTheme({
  colors: {
    bodyColor: "linear-gradient(to right, #3b3eed 0%, #85bbfd 100%)",
  },
  semanticTokens: {
    colors: {
      // Text colours for the two sides; lighter shades keep contrast on the dark game background.
      "player.red": { default: "red.600", _dark: "red.300" },
      "player.blue": { default: "blue.600", _dark: "blue.200" },
      "player.draw": { default: "gray.600", _dark: "gray.300" },
    },
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
        <MotionConfig reducedMotion="user">
        <GameSettingsProvider>
        <AuthProvider>
          <AllDataContextProvider>
            <SocketProvider>
              <BrowserRouter>
                <App />
              </BrowserRouter>
            </SocketProvider>
          </AllDataContextProvider>
        </AuthProvider>
        </GameSettingsProvider>
        </MotionConfig>
      </ColorModeProvider>
    </ChakraProvider>
  </React.StrictMode>,
)
