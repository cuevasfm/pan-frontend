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
  Chip,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Grid,
  Divider,
  InputAdornment,
} from '@mui/material'
import { Add, Visibility, Delete, RemoveCircle, Edit } from '@mui/icons-material'
import {
  pedidoService,
  clienteService,
  productoService,
  fechaProduccionService,
} from '../services/api'
import { formatCurrency, formatDate, getEstadoColor, getEstadoTexto } from '../utils/formatters'

const PedidosEditable = () => {
  const [pedidos, setPedidos] = useState([])
  const [clientes, setClientes] = useState([])
  const [productos, setProductos] = useState([])
  const [fechasAbiertas, setFechasAbiertas] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [openViewDialog, setOpenViewDialog] = useState(false)
  const [selectedPedido, setSelectedPedido] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    id: null,
    cliente_id: '',
    fecha_produccion_id: '',
    notas: '',
    detalle: [{ producto_id: '', cantidad: 1, precio_unitario: 0 }],
  })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [pedidosRes, clientesRes, productosRes, fechasRes] = await Promise.all([
        pedidoService.getAll(),
        clienteService.getAll(),
        productoService.getAll(),
        fechaProduccionService.getAbiertas(),
      ])
      setPedidos(pedidosRes.data)
      setClientes(clientesRes.data)
      setProductos(productosRes.data)
      setFechasAbiertas(fechasRes.data)
    } catch (error) {
      setError('Error cargando datos')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (pedido = null) => {
    if (pedido) {
      // Modo edición
      handleEditPedido(pedido.id)
    } else {
      // Modo crear
      setFormData({
        id: null,
        cliente_id: '',
        fecha_produccion_id: '',
        notas: '',
        detalle: [{ producto_id: '', cantidad: 1, precio_unitario: 0 }],
      })
      setOpenDialog(true)
    }
  }

  const handleEditPedido = async (id) => {
    try {
      const { data } = await pedidoService.getById(id)
      setFormData({
        id: data.id,
        cliente_id: data.cliente_id,
        fecha_produccion_id: data.fecha_produccion_id,
        notas: data.notas || '',
        detalle: data.detalle.map(item => ({
          producto_id: item.producto_id,
          cantidad: item.cantidad,
          precio_unitario: item.precio_unitario
        }))
      })
      setOpenDialog(true)
    } catch (error) {
      setError('Error cargando pedido')
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleViewPedido = async (id) => {
    try {
      const { data } = await pedidoService.getById(id)
      setSelectedPedido(data)
      setOpenViewDialog(true)
    } catch (error) {
      setError('Error cargando detalles del pedido')
    }
  }

  const handleAddDetalleItem = () => {
    setFormData({
      ...formData,
      detalle: [...formData.detalle, { producto_id: '', cantidad: 1, precio_unitario: 0 }],
    })
  }

  const handleRemoveDetalleItem = (index) => {
    const newDetalle = formData.detalle.filter((_, i) => i !== index)
    setFormData({ ...formData, detalle: newDetalle })
  }

  const handleDetalleChange = (index, field, value) => {
    const newDetalle = [...formData.detalle]
    newDetalle[index][field] = value
    
    // Si cambia el producto, actualizar el precio por defecto
    if (field === 'producto_id') {
      const producto = productos.find(p => p.id === parseInt(value))
      if (producto) {
        newDetalle[index].precio_unitario = producto.precio
      }
    }
    
    setFormData({ ...formData, detalle: newDetalle })
  }

  const calcularTotal = () => {
    return formData.detalle.reduce((sum, item) => {
      return sum + (item.cantidad * item.precio_unitario)
    }, 0)
  }

  const handleSubmit = async () => {
    try {
      // Validar que todos los items tengan producto, cantidad y precio
      const valid = formData.detalle.every(
        (item) => item.producto_id && item.cantidad > 0 && item.precio_unitario >= 0
      )
      if (!valid) {
        setError('Todos los items deben tener producto, cantidad y precio válidos')
        return
      }

      const dataToSend = {
        detalle: formData.detalle.map(item => ({
          producto_id: parseInt(item.producto_id),
          cantidad: parseInt(item.cantidad),
          precio_unitario: parseFloat(item.precio_unitario)
        })),
        notas: formData.notas
      }

      if (formData.id) {
        // Actualizar pedido existente
        await pedidoService.update(formData.id, dataToSend)
        setSuccess('Pedido actualizado exitosamente')
      } else {
        // Crear nuevo pedido
        await pedidoService.create({
          cliente_id: parseInt(formData.cliente_id),
          fecha_produccion_id: parseInt(formData.fecha_produccion_id),
          ...dataToSend
        })
        setSuccess('Pedido creado exitosamente')
      }
      
      loadData()
      handleCloseDialog()
    } catch (error) {
      setError(error.response?.data?.message || 'Error guardando pedido')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de cancelar este pedido?')) return
    try {
      await pedidoService.delete(id)
      setSuccess('Pedido cancelado exitosamente')
      loadData()
    } catch (error) {
      setError('Error cancelando pedido')
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
          Pedidos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nuevo Pedido
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

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Cliente</strong></TableCell>
              <TableCell><strong>Fecha Horneado</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
              <TableCell align="right"><strong>Total</strong></TableCell>
              <TableCell align="right"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {pedidos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No hay pedidos registrados
                </TableCell>
              </TableRow>
            ) : (
              pedidos.map((pedido) => (
                <TableRow key={pedido.id}>
                  <TableCell>#{pedido.id}</TableCell>
                  <TableCell>
                    <Typography variant="body2">{pedido.cliente_nombre}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {pedido.cliente_telefono}
                    </Typography>
                  </TableCell>
                  <TableCell>{formatDate(pedido.fecha_horneado)}</TableCell>
                  <TableCell>
                    <Chip
                      label={getEstadoTexto(pedido.estado)}
                      color={getEstadoColor(pedido.estado)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">{formatCurrency(pedido.total)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      size="small"
                      color="info"
                      onClick={() => handleViewPedido(pedido.id)}
                      title="Ver Detalles"
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => handleOpenDialog(pedido)}
                      disabled={pedido.estado === 'cancelado' || pedido.estado === 'entregado'}
                      title="Editar"
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(pedido.id)}
                      disabled={pedido.estado === 'cancelado'}
                      title="Cancelar"
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

      {/* Dialog para crear/editar pedido */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="lg" fullWidth>
        <DialogTitle>
          {formData.id ? 'Editar Pedido' : 'Nuevo Pedido'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required disabled={!!formData.id}>
                <InputLabel>Cliente</InputLabel>
                <Select
                  value={formData.cliente_id}
                  onChange={(e) => setFormData({ ...formData, cliente_id: e.target.value })}
                  label="Cliente"
                >
                  {clientes.map((cliente) => (
                    <MenuItem key={cliente.id} value={cliente.id}>
                      {cliente.nombre} - {cliente.telefono}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required disabled={!!formData.id}>
                <InputLabel>Fecha de Horneado</InputLabel>
                <Select
                  value={formData.fecha_produccion_id}
                  onChange={(e) =>
                    setFormData({ ...formData, fecha_produccion_id: e.target.value })
                  }
                  label="Fecha de Horneado"
                >
                  {fechasAbiertas.map((fecha) => (
                    <MenuItem key={fecha.id} value={fecha.id}>
                      {formatDate(fecha.fecha_horneado)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Divider sx={{ my: 3 }} />

          <Typography variant="h6" gutterBottom>
            Productos del Pedido
          </Typography>

          {formData.detalle.map((item, index) => (
            <Card key={index} sx={{ mb: 2, bgcolor: 'grey.50' }}>
              <CardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={5}>
                    <FormControl fullWidth>
                      <InputLabel>Producto</InputLabel>
                      <Select
                        value={item.producto_id}
                        onChange={(e) => handleDetalleChange(index, 'producto_id', e.target.value)}
                        label="Producto"
                      >
                        {productos.map((producto) => (
                          <MenuItem key={producto.id} value={producto.id}>
                            {producto.nombre}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={6} sm={2}>
                    <TextField
                      fullWidth
                      label="Cantidad"
                      type="number"
                      value={item.cantidad}
                      onChange={(e) =>
                        handleDetalleChange(index, 'cantidad', parseInt(e.target.value) || 1)
                      }
                      inputProps={{ min: 1 }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <TextField
                      fullWidth
                      label="Precio Unitario"
                      type="number"
                      value={item.precio_unitario}
                      onChange={(e) =>
                        handleDetalleChange(index, 'precio_unitario', parseFloat(e.target.value) || 0)
                      }
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      inputProps={{ min: 0, step: 0.01 }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        Subtotal: {formatCurrency(item.cantidad * item.precio_unitario)}
                      </Typography>
                      <IconButton
                        color="error"
                        onClick={() => handleRemoveDetalleItem(index)}
                        disabled={formData.detalle.length === 1}
                        size="small"
                      >
                        <RemoveCircle />
                      </IconButton>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddDetalleItem}
            sx={{ mb: 2 }}
          >
            Agregar Producto
          </Button>

          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">
              Total del Pedido:
            </Typography>
            <Typography variant="h5" color="primary" sx={{ fontWeight: 700 }}>
              {formatCurrency(calcularTotal())}
            </Typography>
          </Box>

          <TextField
            fullWidth
            label="Notas"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            margin="normal"
            multiline
            rows={2}
            placeholder="Ej: Descuento 10% por festividad, Precio especial cliente frecuente, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.id && (!formData.cliente_id || !formData.fecha_produccion_id)}
          >
            {formData.id ? 'Actualizar Pedido' : 'Crear Pedido'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles (sin cambios) */}
      <Dialog open={openViewDialog} onClose={() => setOpenViewDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>Detalles del Pedido</DialogTitle>
        <DialogContent>
          {selectedPedido && (
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Cliente
                  </Typography>
                  <Typography variant="body1">{selectedPedido.cliente_nombre}</Typography>
                  <Typography variant="caption">{selectedPedido.cliente_telefono}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Domicilio
                  </Typography>
                  <Typography variant="body1">{selectedPedido.domicilio}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Fecha de Horneado
                  </Typography>
                  <Typography variant="body1">
                    {formatDate(selectedPedido.fecha_horneado)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Estado
                  </Typography>
                  <Chip
                    label={getEstadoTexto(selectedPedido.estado)}
                    color={getEstadoColor(selectedPedido.estado)}
                    size="small"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 600 }}>
                Detalle del Pedido
              </Typography>

              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Producto</TableCell>
                      <TableCell align="center">Cantidad</TableCell>
                      <TableCell align="right">Precio</TableCell>
                      <TableCell align="right">Subtotal</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {selectedPedido.detalle?.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell>{item.producto_nombre}</TableCell>
                        <TableCell align="center">{item.cantidad}</TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.precio_unitario)}
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(item.subtotal)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={3} align="right">
                        <strong>Total:</strong>
                      </TableCell>
                      <TableCell align="right">
                        <strong>{formatCurrency(selectedPedido.total)}</strong>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>

              {selectedPedido.notas && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Notas
                  </Typography>
                  <Typography variant="body2">{selectedPedido.notas}</Typography>
                </Box>
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

export default PedidosEditable

