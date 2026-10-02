import { useEffect, useState } from 'react'
import { ThemeContext } from './theme-context'

const STORAGE_KEY = 'class-1ia08-theme'

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark') return saved
  } catch {
    // localStorage unavailable
  }
  return 'dark'
}

function applyTheme(theme) {
  const root = document.documentElement
  root.dataset.theme = theme

  // Keep shadcn .dark class in sync so shadcn components
  // that rely on the .dark class selector still work
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
}

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(getInitialTheme)

  // Apply theme to DOM on mount and changes
  useEffect(() => {
    applyTheme(theme)
    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      // localStorage unavailable
    }
  }, [theme])

  const toggleTheme = () => {
    setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  const setTheme = (value) => {
    if (value === 'dark' || value === 'light') {
      setThemeState(value)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}
