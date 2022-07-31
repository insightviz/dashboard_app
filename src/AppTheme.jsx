import { useState, useEffect, createContext } from 'react'

const localStorageKey = "mode";

export const ThemeContext = createContext({
  mode: "system",
  theme: "light",
  setMode: () => {}
});

const ThemeProvider = ({ children }) => {
  // This holds the information about dark mode/light mode
  const initialMode = () => { return (localStorage.getItem(localStorageKey)) || "system" }
  const [mode, setMode] = useState(initialMode);
  const [theme, setTheme] = useState(() => {
    if (mode !== "system") {
      return mode;
    }
    const isSystemInDarkMode = matchMedia("(prefers-color-scheme: dark)")
      .matches;
    return isSystemInDarkMode ? "dark" : "light";
  });
    
  useEffect(() => {
    localStorage.setItem(localStorageKey, mode);
  }, [mode]);

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

  useEffect(() => {
    // Clear previous classNames on the body and add the new one
    document.body.classList.remove("light");
    document.body.classList.remove("dark");
    document.body.classList.add(theme);
  
    // change <meta name="color-scheme"> for native inputs
    (document.getElementById("colorScheme")).content = theme;
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export default ThemeProvider;