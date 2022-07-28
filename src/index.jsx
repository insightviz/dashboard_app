import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ChakraProvider } from '@chakra-ui/react';
import ThemeProvider from './AppTheme';
import "./index.css"
import { GeistProvider, CssBaseline } from '@geist-ui/core'

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <ThemeProvider>
        <GeistProvider>
          <CssBaseline />
          <App />
        </GeistProvider>
      </ThemeProvider>
    </ChakraProvider>
  </React.StrictMode>
);