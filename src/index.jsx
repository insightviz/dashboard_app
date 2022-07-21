import React from 'react';
import ReactDOM from 'react-dom/client';
import AppTheme from './AppTheme';
import { ChakraProvider } from '@chakra-ui/react';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <AppTheme />
    </ChakraProvider>
  </React.StrictMode>
);