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
} from '@mui/material'
import { Add, Visibility, Delete, RemoveCircle } from '@mui/icons-material'
import {
  pedidoService,
  clienteService,
  productoService,
  fechaProduccionService,
} from '../services/api'
import { formatCurrency, formatDate, getEstadoColor, getEstadoTexto } from '../utils/formatters'

const Pedidos = () => {
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
    cliente_id: '',
    fecha_produccion_id: '',
    notas: '',
    detalle: [{ producto_id: '', cantidad: 1 }],
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

  const handleOpenDialog = () => {
    setFormData({
      cliente_id: '',
      fecha_produccion_id: '',
      notas: '',
      detalle: [{ producto_id: '', cantidad: 1 }],
    })
    setOpenDialog(true)
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
      detalle: [...formData.detalle, { producto_id: '', cantidad: 1 }],
    })
  }

  const handleRemoveDetalleItem = (index) => {
    const newDetalle = formData.detalle.filter((_, i) => i !== index)
    setFormData({ ...formData, detalle: newDetalle })
  }

  const handleDetalleChange = (index, field, value) => {
    const newDetalle = [...formData.detalle]
    newDetalle[index][field] = value
    setFormData({ ...formData, detalle: newDetalle })
  }

  const handleSubmit = async () => {
    try {
      // Validar que todos los items tengan producto y cantidad
      const valid = formData.detalle.every(
        (item) => item.producto_id && item.cantidad > 0
      )
      if (!valid) {
        setError('Todos los items deben tener producto y cantidad válida')
        return
      }

      await pedidoService.create(formData)
      setSuccess('Pedido creado exitosamente')
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
          onClick={handleOpenDialog}
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
                    >
                      <Visibility />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(pedido.id)}
                      disabled={pedido.estado === 'cancelado'}
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

      {/* Dialog para crear pedido */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Pedido</DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal" required>
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
              <FormControl fullWidth margin="normal" required>
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

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, fontWeight: 600 }}>
            Productos
          </Typography>

          {formData.detalle.map((item, index) => (
            <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
              <FormControl sx={{ flex: 2 }}>
                <InputLabel>Producto</InputLabel>
                <Select
                  value={item.producto_id}
                  onChange={(e) => handleDetalleChange(index, 'producto_id', e.target.value)}
                  label="Producto"
                >
                  {productos.map((producto) => (
                    <MenuItem key={producto.id} value={producto.id}>
                      {producto.nombre} - {formatCurrency(producto.precio)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                label="Cantidad"
                type="number"
                value={item.cantidad}
                onChange={(e) =>
                  handleDetalleChange(index, 'cantidad', parseInt(e.target.value) || 1)
                }
                sx={{ width: 100 }}
                inputProps={{ min: 1 }}
              />
              <IconButton
                color="error"
                onClick={() => handleRemoveDetalleItem(index)}
                disabled={formData.detalle.length === 1}
              >
                <RemoveCircle />
              </IconButton>
            </Box>
          ))}

          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={handleAddDetalleItem}
            sx={{ mt: 1 }}
          >
            Agregar Producto
          </Button>

          <TextField
            fullWidth
            label="Notas"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
            margin="normal"
            multiline
            rows={2}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.cliente_id || !formData.fecha_produccion_id}
          >
            Crear Pedido
          </Button>
        </DialogActions>
      </Dialog>

      {/* Dialog para ver detalles */}
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

export default Pedidos

