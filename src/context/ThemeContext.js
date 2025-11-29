import { createContext, useState, useContext, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { lightColors, darkColors } from "../config/theme"

const ThemeContext = createContext()

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

export function ThemeProvider({ children }) {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [colors, setColors] = useState(lightColors)

  useEffect(() => {
    loadTheme()
  }, [])

  useEffect(() => {
    setColors(isDarkMode ? darkColors : lightColors)
  }, [isDarkMode])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("darkMode")
      if (savedTheme !== null) {
        setIsDarkMode(JSON.parse(savedTheme))
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const toggleTheme = async () => {
    try {
      const newValue = !isDarkMode
      setIsDarkMode(newValue)
      await AsyncStorage.setItem("darkMode", JSON.stringify(newValue))
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const value = {
    isDarkMode,
    colors,
    toggleTheme,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}