import { useTheme } from '@/context/useTheme'
import { useEffect } from 'react'

function ThemeApplier() {
  const { theme, setTheme } = useTheme()
  
  // Managing theme modes
  useEffect(() => {
    const root = document.documentElement
    root.classList.remove("light", "dark", "dark-green")
        if(theme) {
        // If user has selected theme, use that
        root.classList.add(theme)
        // Else If user OS preferences prefers dark mode
        } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        root.classList.add("dark")
        } else {
        // Else use light mode
        root.classList.add("light")
        setTheme("light")
        }
    },[theme])

  return null
}

export default ThemeApplier