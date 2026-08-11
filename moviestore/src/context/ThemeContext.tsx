import { createContext, useState, type ReactNode } from "react";

export type Theme = "light" | "dark"
export type ThemeSetting = Theme | null

type ThemeContextType = {
    theme: ThemeSetting
    setTheme: (theme: ThemeSetting) => void
}


const ThemeContext = createContext<ThemeContextType | null>(null)

export const ThemeProvider = ({children} : {children: ReactNode}) => {
    const [theme, setTheme] = useState<ThemeSetting>(() => {
        const saved = localStorage.getItem('theme')
        return saved === "light" || saved === "dark" ? saved : null
    })

    const handleTheme = (theme: ThemeSetting) => {
        if (theme) {
            localStorage.setItem('theme', theme)
        } else {
            localStorage.removeItem('theme')
        }
        setTheme(theme)
    }

  return (
    <ThemeContext.Provider value={{theme, setTheme: handleTheme}}>
        {children}
    </ThemeContext.Provider>
  )
}

export default ThemeContext