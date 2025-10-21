import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Card,
  CardContent,
  IconButton,
  TextField,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Alert,
  InputAdornment,
  Tabs,
  Tab,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from '@mui/material'
import { Add, Edit, Delete, Search, Phone, Person, Home, Lock, AdminPanelSettings } from '@mui/icons-material'
import { clienteService } from '../services/api'

const Clientes = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [clientes, setClientes] = useState([])
  const [filteredClientes, setFilteredClientes] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [tabValue, setTabValue] = useState(0) // 0 = Clientes, 1 = Administradores
  const [formData, setFormData] = useState({
    id: null,
    telefono: '',
    nombre: '',
    domicilio: '',
    rol: 'cliente',
    password: '',
  })

  useEffect(() => {
    loadClientes()
  }, [])

  useEffect(() => {
    filterClientes()
  }, [clientes, tabValue, searchTerm])

  const loadClientes = async () => {
    try {
      const { data } = await clienteService.getAll()
      setClientes(data)
    } catch (error) {
      setError('Error cargando clientes')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const filterClientes = () => {
    let filtered = clientes

    // Filtrar por rol según la pestaña
    if (tabValue === 0) {
      filtered = filtered.filter(c => c.rol === 'cliente')
    } else {
      filtered = filtered.filter(c => c.rol === 'admin')
    }

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(c => 
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.telefono.includes(searchTerm)
      )
    }

    setFilteredClientes(filtered)
  }

  const handleSearch = () => {
    filterClientes()
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
    setSearchTerm('')
  }

  const handleOpenDialog = (cliente = null) => {
    if (cliente) {
      setFormData({
        ...cliente,
        password: '', // No mostrar la contraseña
      })
    } else {
      setFormData({ 
        id: null, 
        telefono: '', 
        nombre: '', 
        domicilio: '',
        rol: tabValue === 0 ? 'cliente' : 'admin',
        password: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({ 
      id: null, 
      telefono: '', 
      nombre: '', 
      domicilio: '',
      rol: 'cliente',
      password: '',
    })
  }

  const handleSubmit = async () => {
    try {
      const dataToSend = {
        telefono: formData.telefono,
        nombre: formData.nombre,
        domicilio: formData.domicilio,
        rol: formData.rol,
      }

      // Solo incluir contraseña si se proporcionó
      if (formData.password) {
        dataToSend.password = formData.password
      }

      if (formData.id) {
        await clienteService.update(formData.id, dataToSend)
        setSuccess(formData.rol === 'admin' ? 'Administrador actualizado exitosamente' : 'Cliente actualizado exitosamente')
      } else {
        await clienteService.create(dataToSend)
        setSuccess(formData.rol === 'admin' ? 'Administrador creado exitosamente' : 'Cliente creado exitosamente')
      }
      loadClientes()
      handleCloseDialog()
    } catch (error) {
      setError(error.response?.data?.message || 'Error guardando usuario')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return
    try {
      await clienteService.delete(id)
      setSuccess('Usuario eliminado exitosamente')
      loadClientes()
    } catch (error) {
      setError('Error eliminando usuario')
    }
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          {tabValue === 0 ? 'Nuevo Cliente' : 'Nuevo Administrador'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      {success && (
        <Alert severity="success" onClose={() => setSuccess('')} sx={{ mb: 2 }}>
          {success}
        </Alert>
      )}

      {/* Pestañas para filtrar */}
      <Card sx={{ mb: 3 }}>
        <Tabs 
          value={tabValue} 
          onChange={handleTabChange}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Person />
                Clientes ({clientes.filter(c => c.rol === 'cliente').length})
              </Box>
            } 
          />
          <Tab 
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AdminPanelSettings />
                Administradores ({clientes.filter(c => c.rol === 'admin').length})
              </Box>
            } 
          />
        </Tabs>
        
        <CardContent>
          <TextField
            fullWidth
            placeholder={`Buscar ${tabValue === 0 ? 'clientes' : 'administradores'} por nombre o teléfono...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Vista móvil - Cards */}
      {isMobile ? (
        <Stack spacing={2}>
          {filteredClientes.length === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No hay {tabValue === 0 ? 'clientes' : 'administradores'} registrados
                </Typography>
              </CardContent>
            </Card>
          ) : (
            filteredClientes.map((cliente) => (
              <Card key={cliente.id} elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {cliente.nombre}
                      </Typography>
                      {cliente.rol === 'admin' && (
                        <Chip 
                          icon={<AdminPanelSettings />}
                          label="Admin" 
                          size="small" 
                          color="primary" 
                        />
                      )}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                      <Phone fontSize="small" />
                      {cliente.telefono}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Home fontSize="small" />
                      {cliente.domicilio || 'Sin domicilio'}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => handleOpenDialog(cliente)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(cliente.id)}
                    >
                      Eliminar
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))
          )}
        </Stack>
      ) : (
        /* Vista desktop - Tabla */
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Teléfono</strong></TableCell>
                <TableCell><strong>Domicilio</strong></TableCell>
                {tabValue === 1 && <TableCell><strong>Rol</strong></TableCell>}
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredClientes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={tabValue === 1 ? 5 : 4} align="center">
                    No hay {tabValue === 0 ? 'clientes' : 'administradores'} registrados
                  </TableCell>
                </TableRow>
              ) : (
                filteredClientes.map((cliente) => (
                  <TableRow key={cliente.id}>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {cliente.nombre}
                        {cliente.rol === 'admin' && (
                          <Chip 
                            icon={<AdminPanelSettings />}
                            label="Admin" 
                            size="small" 
                            color="primary" 
                          />
                        )}
                      </Box>
                    </TableCell>
                    <TableCell>{cliente.telefono}</TableCell>
                    <TableCell>{cliente.domicilio || '-'}</TableCell>
                    {tabValue === 1 && (
                      <TableCell>
                        <Chip 
                          label="Administrador" 
                          color="primary" 
                          size="small" 
                        />
                      </TableCell>
                    )}
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(cliente)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(cliente.id)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formData.id 
            ? `Editar ${formData.rol === 'admin' ? 'Administrador' : 'Cliente'}` 
            : `Nuevo ${formData.rol === 'admin' ? 'Administrador' : 'Cliente'}`
          }
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Teléfono"
            value={formData.telefono}
            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <TextField
            fullWidth
            label="Nombre Completo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />
          <TextField
            fullWidth
            label="Domicilio"
            value={formData.domicilio}
            onChange={(e) => setFormData({ ...formData, domicilio: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            InputProps={{
              startAdornment: <Home sx={{ mr: 1, color: 'action.active', alignSelf: 'flex-start', mt: 1 }} />,
            }}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Tipo de Usuario</InputLabel>
            <Select
              value={formData.rol}
              onChange={(e) => setFormData({ ...formData, rol: e.target.value })}
              label="Tipo de Usuario"
            >
              <MenuItem value="cliente">Cliente</MenuItem>
              <MenuItem value="admin">Administrador</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={formData.id ? "Nueva Contraseña (dejar vacío para no cambiar)" : "Contraseña"}
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            margin="normal"
            required={!formData.id && formData.rol === 'admin'}
            helperText={
              formData.rol === 'admin' 
                ? "Requerida para administradores" 
                : "Opcional para clientes"
            }
            InputProps={{
              startAdornment: <Lock sx={{ mr: 1, color: 'action.active' }} />,
            }}
          />

          {formData.rol === 'admin' && (
            <Alert severity="info" sx={{ mt: 2 }}>
              Los administradores tienen acceso completo al sistema
            </Alert>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.telefono || !formData.nombre || (!formData.id && formData.rol === 'admin' && !formData.password)}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Clientes
