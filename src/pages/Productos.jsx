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
  Grid,
  CircularProgress,
  Alert,
  Chip,
  List,
  ListItem,
  ListItemText,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material'
import { Add, Edit, Delete, Visibility, Restaurant, RemoveCircle } from '@mui/icons-material'
import { productoService, insumoService, unidadService } from '../services/api'
import { formatCurrency } from '../utils/formatters'

const Productos = () => {
  const [productos, setProductos] = useState([])
  const [insumos, setInsumos] = useState([])
  const [unidades, setUnidades] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [openRecetaDialog, setOpenRecetaDialog] = useState(false)
  const [selectedProducto, setSelectedProducto] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    id: null,
    nombre: '',
    precio: '',
    descripcion: '',
  })
  const [recetaData, setRecetaData] = useState({
    productoId: null,
    receta: [],
    nuevoItem: { insumo_id: '', cantidad: '', unidad_id: '' }
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [productosRes, insumosRes, unidadesRes] = await Promise.all([
        productoService.getAll(),
        insumoService.getAll(),
        unidadService.getAll(),
      ])
      setProductos(productosRes.data)
      setInsumos(insumosRes.data)
      setUnidades(unidadesRes.data)
    } catch (error) {
      setError('Error cargando datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (producto = null) => {
    if (producto) {
      setFormData(producto)
    } else {
      setFormData({ id: null, nombre: '', precio: '', descripcion: '' })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setFormData({ id: null, nombre: '', precio: '', descripcion: '' })
  }

  const handleViewProducto = async (id) => {
    try {
      const { data } = await productoService.getById(id)
      setSelectedProducto(data)
      setOpenViewDialog(true)
    } catch (error) {
      setError('Error cargando detalles del producto')
    }
  }

  const handleOpenRecetaDialog = async (id) => {
    try {
      const { data } = await productoService.getById(id)
      setRecetaData({
        productoId: id,
        productoNombre: data.nombre,
        receta: data.receta || [],
        nuevoItem: { insumo_id: '', cantidad: '', unidad_id: '' }
      })
      setOpenRecetaDialog(true)
    } catch (error) {
      setError('Error cargando receta')
    }
  }

  const handleCloseRecetaDialog = () => {
    setOpenRecetaDialog(false)
    setRecetaData({
      productoId: null,
      receta: [],
      nuevoItem: { insumo_id: '', cantidad: '', unidad_id: '' }
    })
  }

  const handleAddIngrediente = async () => {
    const { productoId, nuevoItem } = recetaData
    
    if (!nuevoItem.insumo_id || !nuevoItem.cantidad || !nuevoItem.unidad_id) {
      setError('Completa todos los campos del ingrediente')
      return
    }

    try {
      await productoService.addRecetaItem(productoId, {
        insumo_id: nuevoItem.insumo_id,
        cantidad: parseFloat(nuevoItem.cantidad),
        unidad_id: nuevoItem.unidad_id
      })
      
      // Recargar la receta
      const { data } = await productoService.getById(productoId)
      setRecetaData({
        ...recetaData,
        receta: data.receta || [],
        nuevoItem: { insumo_id: '', cantidad: '', unidad_id: '' }
      })
      setSuccess('Ingrediente agregado')
    } catch (error) {
      setError(error.response?.data?.message || 'Error agregando ingrediente')
    }
  }

  const handleRemoveIngrediente = async (recetaId) => {
    if (!window.confirm('¿Eliminar este ingrediente?')) return
    
    try {
      await productoService.removeRecetaItem(recetaData.productoId, recetaId)
      
      // Recargar la receta
      const { data } = await productoService.getById(recetaData.productoId)
      setRecetaData({
        ...recetaData,
        receta: data.receta || []
      })
      setSuccess('Ingrediente eliminado')
    } catch (error) {
      setError('Error eliminando ingrediente')
    }
  }

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await productoService.update(formData.id, formData)
        setSuccess('Producto actualizado exitosamente')
      } else {
        const { data } = await productoService.create(formData)
        setSuccess('Producto creado. Ahora puedes agregar la receta.')
        // Abrir dialog de receta automáticamente
        setTimeout(() => {
          handleCloseDialog()
          handleOpenRecetaDialog(data.id)
        }, 1000)
      }
      loadData()
      if (formData.id) {
        handleCloseDialog()
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Error guardando producto')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return
    try {
      await productoService.delete(id)
      setSuccess('Producto eliminado exitosamente')
      loadData()
    } catch (error) {
      setError('Error eliminando producto')
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
          Productos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Producto
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

      <Grid container spacing={3}>
        {productos.length === 0 ? (
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No hay productos registrados
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ) : (
          productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} key={producto.id}>
              <Card elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
                      {producto.nombre}
                    </Typography>
                    <Chip
                      label={formatCurrency(producto.precio)}
                      color="primary"
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {producto.descripcion || 'Sin descripción'}
                  </Typography>
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                    <IconButton
                      size="small"
                      color="success"
                      onClick={() => handleOpenRecetaDialog(producto.id)}
                      title="Gestionar Receta"
                    >
                      <Restaurant />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handleViewProducto(producto.id)}
                      title="Ver Detalles"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(producto)}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(producto.id)}
                      title="Eliminar"
                    >
                      <Delete />
                    </IconButton>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

      {/* Dialog para crear/editar producto */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {formData.id ? 'Editar Producto' : 'Nuevo Producto'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Nombre del Producto"
            value={formData.nombre}
            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Precio"
            type="number"
            value={formData.precio}
            onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
            margin="normal"
            required
            InputProps={{
              startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
            }}
          />
          <TextField
            fullWidth
            label="Descripción"
            value={formData.descripcion}
            onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            margin="normal"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.nombre || !formData.precio}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para gestionar receta */}
      <Dialog open={openRecetaDialog} onClose={handleCloseRecetaDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          Gestionar Receta - {recetaData.productoNombre}
        </DialogTitle>
        <DialogContent>
          {/* Lista de ingredientes actuales */}
          {recetaData.receta.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Ingredientes Actuales:
              </Typography>
              <TableContainer component={Paper} variant="outlined">
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Insumo</strong></TableCell>
                      <TableCell align="right"><strong>Cantidad</strong></TableCell>
                      <TableCell align="center"><strong>Acción</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recetaData.receta.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.insumo}</TableCell>
                        <TableCell align="right">
                          {item.cantidad} {item.unidad}
                        </TableCell>
                        <TableCell align="center">
                          <IconButton
                            size="small"
                            color="error"
                            onClick={() => handleRemoveIngrediente(item.id)}
                          >
                            <RemoveCircle />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>
          )}

          <Divider sx={{ my: 2 }} />

          {/* Agregar nuevo ingrediente */}
          <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
            Agregar Ingrediente:
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <FormControl fullWidth>
                <InputLabel>Insumo</InputLabel>
                <Select
                  value={recetaData.nuevoItem.insumo_id}
                  onChange={(e) => setRecetaData({
                    ...recetaData,
                    nuevoItem: { ...recetaData.nuevoItem, insumo_id: e.target.value }
                  })}
                  label="Insumo"
                >
                  {insumos.map((insumo) => (
                    <MenuItem key={insumo.id} value={insumo.id}>
                      {insumo.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField
                fullWidth
                label="Cantidad"
                type="number"
                value={recetaData.nuevoItem.cantidad}
                onChange={(e) => setRecetaData({
                  ...recetaData,
                  nuevoItem: { ...recetaData.nuevoItem, cantidad: e.target.value }
                })}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={6} sm={4}>
              <FormControl fullWidth>
                <InputLabel>Unidad</InputLabel>
                <Select
                  value={recetaData.nuevoItem.unidad_id}
                  onChange={(e) => setRecetaData({
                    ...recetaData,
                    nuevoItem: { ...recetaData.nuevoItem, unidad_id: e.target.value }
                  })}
                  label="Unidad"
                >
                  {unidades.map((unidad) => (
                    <MenuItem key={unidad.id} value={unidad.id}>
                      {unidad.simbolo} ({unidad.nombre})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddIngrediente}
            sx={{ mt: 2 }}
            fullWidth
          >
            Agregar Ingrediente
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRecetaDialog} variant="contained">
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Detalles del Producto</DialogTitle>
        <DialogContent>
          {selectedProducto && (
            <Box>
              <Typography variant="h6" gutterBottom>
                {selectedProducto.nombre}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {selectedProducto.descripcion}
              </Typography>
              <Chip
                label={formatCurrency(selectedProducto.precio)}
                color="primary"
                sx={{ my: 2 }}
              />
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Receta:
              </Typography>
              {selectedProducto.receta && selectedProducto.receta.length > 0 ? (
                <List dense>
                  {selectedProducto.receta.map((item, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={item.insumo}
                        secondary={`${item.cantidad} ${item.unidad}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography color="text.secondary">
                  No hay receta definida
                </Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenViewDialog(false)}>Cerrar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default Productos
