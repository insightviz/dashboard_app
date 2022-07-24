import { useState, useEffect } from 'react'
import App from './App'

function AppTheme() {
  // This holds the information about dark mode/light mode
  const initialMode = () => { return "system" }
  const [mode, setMode] = useState(initialMode);
  const [theme, setTheme] = useState(() => {
    if (mode !== "system") {
      return mode;
    }
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
      .matches;
    return isSystemInDarkMode ? "dark" : "light";
  });
    
  const handleModeChange = (e) => {
    setMode(e.value)    
  }

  useEffect(() => {
    if (mode !== "system") {
      setTheme(mode);
      return;
    }
  
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)");
    // If system mode, immediately change theme according to the current system value
    setTheme(isSystemInDarkMode.matches ? "dark" : "light");
  
    // As the system value can change, we define an event listener when in system mode
    // to track down its changes
    const listener = (event: MediaQueryListEvent) => {
      setTheme(event.matches ? "dark" : "light");
    };
    isSystemInDarkMode.addEventListener('change', listener);
    return () => {
      isSystemInDarkMode.removeEventListener('change', listener);
    };
  }, [mode]);

  return (
    <App mode={mode} onChange={handleModeChange}/>
  );
}

export default AppTheme;