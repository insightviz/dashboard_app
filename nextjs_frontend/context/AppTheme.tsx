import { useState, useEffect, createContext, useContext } from 'react';

export const ThemeContext = createContext({
  mode: "",
  theme: "",
  changeMode: (e: string) => {}
});

interface AppThemeProps {
  children: React.ReactNode
}

const ThemeProvider = ({ children }: AppThemeProps) => {
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState<string>('');
  const [theme, setTheme] = useState<string>('');

  const changeMode = (e: string) => {
    setMode(e)
    localStorage.setItem('insightMode', e);
  }
    
  useEffect(() => {
    setMode(localStorage.getItem('insightMode') || 'system') 
  }, []);

  useEffect(() => {
    if (mode !== "system") {
      setTheme(mode);
      document.body.dataset.theme = mode;
      return;
    }
    
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)");
    const newTheme = isSystemInDarkMode.matches ? "dark" : "light"
    // If system mode, immediately change theme according to the current system value
    setTheme(newTheme);
    localStorage.setItem('insightTheme', newTheme);
    // Set data-theme attribute to selected theme for body tag
    document.body.dataset.theme = newTheme;
  
    // As the system value can change, we define an event listener when in system mode
    // to track down its changes
    const listener = (event: any) => {
      setTheme(event.matches ? "dark" : "light");
    };
    isSystemInDarkMode.addEventListener('change', listener);
    return () => {
      isSystemInDarkMode.removeEventListener('change', listener);
    };
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ theme, mode, changeMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useAppThemeContext() {
  return useContext(ThemeContext);
}

export default ThemeProvider;