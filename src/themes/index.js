import { createTheme } from '@mui/material/styles'

// Configuración base compartida por todos los temas
const baseConfig = {
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
}

// Tema Clásico (actual)
const classicTheme = createTheme({
  ...baseConfig,
  palette: {
    mode: 'light',
    primary: {
      main: '#d97706',
      light: '#f59e0b',
      dark: '#b45309',
    },
    secondary: {
      main: '#78350f',
      light: '#92400e',
      dark: '#451a03',
    },
    background: {
      default: '#fef3c7',
      paper: '#ffffff',
    },
  },
})

// Tema Claro Moderno
const lightTheme = createTheme({
  ...baseConfig,
  palette: {
    mode: 'light',
    primary: {
      main: '#3b82f6', // Azul moderno
      light: '#60a5fa',
      dark: '#2563eb',
    },
    secondary: {
      main: '#8b5cf6', // Púrpura
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e293b',
      secondary: '#64748b',
    },
  },
})

// Tema Oscuro Moderno
const darkTheme = createTheme({
  ...baseConfig,
  palette: {
    mode: 'dark',
    primary: {
      main: '#60a5fa', // Azul claro
      light: '#93c5fd',
      dark: '#3b82f6',
    },
    secondary: {
      main: '#a78bfa', // Púrpura claro
      light: '#c4b5fd',
      dark: '#8b5cf6',
    },
    background: {
      default: '#0f172a',
      paper: '#1e293b',
    },
    text: {
      primary: '#f1f5f9',
      secondary: '#cbd5e1',
    },
  },
})

// Tema Neon Claro
const neonLightTheme = createTheme({
  ...baseConfig,
  palette: {
    mode: 'light',
    primary: {
      main: '#06b6d4', // Cyan neón
      light: '#22d3ee',
      dark: '#0891b2',
    },
    secondary: {
      main: '#ec4899', // Rosa neón
      light: '#f472b6',
      dark: '#db2777',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
  },
})

// Tema Neon Oscuro
const neonDarkTheme = createTheme({
  ...baseConfig,
  palette: {
    mode: 'dark',
    primary: {
      main: '#22d3ee', // Cyan neón brillante
      light: '#67e8f9',
      dark: '#06b6d4',
    },
    secondary: {
      main: '#f472b6', // Rosa neón brillante
      light: '#f9a8d4',
      dark: '#ec4899',
    },
    background: {
      default: '#000000',
      paper: '#0a0a0a',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',
    },
    success: {
      main: '#34d399',
    },
    warning: {
      main: '#fbbf24',
    },
    error: {
      main: '#f87171',
    },
  },
  components: {
    ...baseConfig.components,
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
})

export const themes = {
  classic: classicTheme,
  light: lightTheme,
  dark: darkTheme,
  neonLight: neonLightTheme,
  neonDark: neonDarkTheme,
}

export const themeNames = {
  classic: 'Clásico Panadería',
  light: 'Claro Moderno',
  dark: 'Oscuro Moderno',
  neonLight: 'Neon Claro',
  neonDark: 'Neon Oscuro',
}

export default themes
