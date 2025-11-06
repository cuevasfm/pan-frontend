import { useState } from 'react'
import {
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from '@mui/material'
import {
  Palette,
  Check,
  LightMode,
  DarkMode,
  AutoAwesome,
  Brightness4,
  BrightnessHigh,
} from '@mui/icons-material'
import { useTheme } from '../context/ThemeContext'
import { themeNames } from '../themes'

const themeIcons = {
  classic: <Brightness4 />,
  light: <LightMode />,
  dark: <DarkMode />,
  neonLight: <BrightnessHigh />,
  neonDark: <AutoAwesome />,
}

const ThemeSelector = () => {
  const { currentTheme, changeTheme } = useTheme()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleThemeChange = (themeName) => {
    changeTheme(themeName)
    handleClose()
  }

  return (
    <>
      <IconButton
        onClick={handleClick}
        color="inherit"
        title="Cambiar tema"
        sx={{ ml: 1 }}
      >
        <Palette />
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            minWidth: 220,
            mt: 1.5,
          },
        }}
      >
        <Box sx={{ px: 2, py: 1 }}>
          <Typography variant="caption" color="text.secondary">
            Seleccionar Tema
          </Typography>
        </Box>
        <Divider />

        {Object.entries(themeNames).map(([key, name]) => (
          <MenuItem
            key={key}
            onClick={() => handleThemeChange(key)}
            selected={currentTheme === key}
          >
            <ListItemIcon>
              {themeIcons[key]}
            </ListItemIcon>
            <ListItemText>{name}</ListItemText>
            {currentTheme === key && (
              <Check fontSize="small" sx={{ ml: 2 }} />
            )}
          </MenuItem>
        ))}
      </Menu>
    </>
  )
}

export default ThemeSelector
