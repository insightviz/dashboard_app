import { useState, useEffect, createContext, useContext, Dispatch, SetStateAction } from 'react';
import { setCookie } from  'cookies-next';

export const ThemeContext = createContext({
  mode: "",
  theme: "",
  changeMode: (e: string) => {}
});

interface AppThemeProps {
  children: React.ReactNode,
  savedMode: string,
  savedTheme: string
}

const ThemeProvider = ({ children, savedMode, savedTheme }: AppThemeProps) => {
  // This holds the information about dark mode/light mode
  const [mode, setMode] = useState(savedMode);
  const [theme, setTheme] = useState(savedTheme);

  const changeMode = (e: string) => {setMode(e)}
    
  useEffect(() => {
    setCookie('insightMode', mode);
    if (mode !== "system") {
      setTheme(mode);
      setCookie('insightTheme', mode);
      return;
    }
    
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)");
    const newTheme = isSystemInDarkMode.matches ? "dark" : "light"
    // If system mode, immediately change theme according to the current system value
    setTheme(newTheme);
    setCookie('insightTheme', newTheme);
    
  
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

  useEffect(() => {
    // Set data-theme attribute to selected theme for body tag
    document.body.dataset.theme = theme;
  }, [theme]);

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