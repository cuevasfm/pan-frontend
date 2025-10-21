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
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
  Chip,
} from '@mui/material'
import { Add, Edit, Delete, Category, AttachMoney, Inventory } from '@mui/icons-material'
import { insumoService, unidadService } from '../services/api'
import { formatCurrency } from '../utils/formatters'

const Insumos = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [insumos, setInsumos] = useState([])
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    unidad_id: '',
    precio_por_unidad: '',
    stock_actual: 0,
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [insumosRes, unidadesRes] = await Promise.all([
        insumoService.getAll(),
        unidadService.getAll(),
      ])
      setInsumos(insumosRes.data)
      setUnidades(unidadesRes.data)
    } catch (error) {
      setError('Error cargando datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (insumo = null) => {
    if (insumo) {
      setFormData({
        id: insumo.id,
        nombre: insumo.nombre,
        unidad_id: insumo.unidad_id,
        precio_por_unidad: insumo.precio_por_unidad,
        stock_actual: insumo.stock_actual || 0,
      })
    } else {
      setFormData({
        id: null,
        nombre: '',
        unidad_id: '',
        precio_por_unidad: '',
        stock_actual: 0,
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({
      id: null,
      nombre: '',
      unidad_id: '',
      precio_por_unidad: '',
      stock_actual: 0,
    })
  }

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await insumoService.update(formData.id, formData)
        setSuccess('Insumo actualizado exitosamente')
      } else {
        await insumoService.create(formData)
        setSuccess('Insumo creado exitosamente')
      }
      loadData()
      handleCloseDialog()
    } catch (error) {
      setError(error.response?.data?.message || 'Error guardando insumo')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este insumo?')) return
    try {
      await insumoService.delete(id)
      setSuccess('Insumo eliminado exitosamente')
      loadData()
    } catch (error) {
      setError('Error eliminando insumo')
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
          Insumos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Insumo
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

      {/* Vista móvil - Cards */}
      {isMobile ? (
        <Stack spacing={2}>
          {insumos.length === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No hay insumos registrados
                </Typography>
              </CardContent>
            </Card>
          ) : (
            insumos.map((insumo) => (
              <Card key={insumo.id} elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {insumo.nombre}
                      </Typography>
                      <Chip 
                        label={insumo.unidad_simbolo} 
                        size="small" 
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                    <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                      {formatCurrency(insumo.precio_por_unidad)}
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <AttachMoney fontSize="small" />
                      Precio por {insumo.unidad_simbolo}
                    </Typography>
                  </Box>

                  <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <Inventory fontSize="small" />
                      Stock: {insumo.stock_actual} {insumo.unidad_simbolo}
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => handleOpenDialog(insumo)}
                    >
                      Editar
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="error"
                      startIcon={<Delete />}
                      onClick={() => handleDelete(insumo.id)}
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
                <TableCell><strong>Unidad Base</strong></TableCell>
                <TableCell align="right"><strong>Precio por Unidad</strong></TableCell>
                <TableCell align="right"><strong>Stock</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {insumos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay insumos registrados
                  </TableCell>
                </TableRow>
              ) : (
                insumos.map((insumo) => (
                  <TableRow key={insumo.id}>
                    <TableCell>{insumo.nombre}</TableCell>
                    <TableCell>{insumo.unidad_simbolo}</TableCell>
                    <TableCell align="right">
                      {formatCurrency(insumo.precio_por_unidad)}
                    </TableCell>
                    <TableCell align="right">
                      {insumo.stock_actual} {insumo.unidad_simbolo}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(insumo)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(insumo.id)}
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
          {formData.id ? 'Editar Insumo' : 'Nuevo Insumo'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Insumo"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            margin="normal"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel>Unidad Base</InputLabel>
            <Select
              value={formData.unidad_id}
              onChange={(e) => setFormData({ ...formData, unidad_id: e.target.value })}
              label="Unidad Base"
            >
              {unidades.map((unidad) => (
                <MenuItem key={unidad.id} value={unidad.id}>
                  {unidad.nombre} ({unidad.simbolo})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Precio por Unidad"
            type="number"
            value={formData.precio_por_unidad}
            onChange={(e) => setFormData({ ...formData, precio_por_unidad: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
          <TextField
            fullWidth
            label="Stock Actual"
            type="number"
            value={formData.stock_actual}
            onChange={(e) => setFormData({ ...formData, stock_actual: e.target.value })}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.nombre || !formData.unidad_id || !formData.precio_por_unidad}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Insumos

