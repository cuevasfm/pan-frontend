import { createContext, useContext, useState, useEffect, useMemo } from 'react'
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import themes from '../themes'
import { useAuth } from './AuthContext'
import axios from 'axios'

const ThemeContext = createContext()

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider')
  }
  return context
}

export const ThemeProvider = ({ children }) => {
  const { user } = useAuth()
  const [currentTheme, setCurrentTheme] = useState('classic')

  // Cargar tema del usuario al iniciar sesión
  useEffect(() => {
    if (user?.theme) {
      setCurrentTheme(user.theme)
    } else {
      // Si no hay usuario o tema, cargar del localStorage
      const savedTheme = localStorage.getItem('appTheme')
      if (savedTheme && themes[savedTheme]) {
        setCurrentTheme(savedTheme)
      }
    }
  }, [user])

  const changeTheme = async (themeName) => {
    if (!themes[themeName]) {
      console.error(`Tema "${themeName}" no encontrado`)
      return
    }

    setCurrentTheme(themeName)
    localStorage.setItem('appTheme', themeName)

    // Si el usuario está autenticado, guardar en el backend
    if (user) {
      try {
        await axios.patch('/api/auth/theme', { theme: themeName })
      } catch (error) {
        console.error('Error guardando tema en el servidor:', error)
      }
    }
  }

  const theme = useMemo(() => themes[currentTheme] || themes.classic, [currentTheme])

  const value = {
    currentTheme,
    changeTheme,
    themes,
  }

  return (
    <ThemeContext.Provider value={value}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  )
}

export default ThemeContext
