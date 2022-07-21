import { useState, useEffect } from 'react'
import App from './App'

function AppTheme() {
  // This holds the information about dark mode/light mode
  const getCurrentTheme = () => window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  const [mode, setMode] = useState(getCurrentTheme());  

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', event => {
        const colorScheme = event.matches ? "dark" : "light";
        setMode(colorScheme);// "dark" or "light"
      });
  }, []);

  return (
    <App mode={mode}/>
  );
}

export default AppTheme;