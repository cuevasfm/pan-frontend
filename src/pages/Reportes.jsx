import { useState, useEffect } from 'react'
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Divider,
  Button,
  Chip,
} from '@mui/material'
import { Print, Download } from '@mui/icons-material'
import { reporteService, fechaProduccionService } from '../services/api'
import { formatCurrency, formatDate } from '../utils/formatters'

const Reportes = () => {
  const [fechas, setFechas] = useState([])
  const [selectedFecha, setSelectedFecha] = useState('')
  const [reporte, setReporte] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    loadFechas()
  }, [])

  const loadFechas = async () => {
    try {
      const { data } = await fechaProduccionService.getAll()
      setFechas(data)
    } catch (error) {
      setError('Error cargando fechas')
    }
  }

  const handleFechaChange = async (fechaId) => {
    setSelectedFecha(fechaId)
    if (!fechaId) {
      setReporte(null)
      return
    }

    setLoading(true)
    setError('')
    try {
      const { data } = await reporteService.getReporteProduccion(fechaId)
      setReporte(data)
    } catch (error) {
      setError('Error cargando reporte')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        Reportes de Producción
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Calcula insumos necesarios y análisis de costos por fecha de producción
      </Typography>

      {error && (
        <Alert severity="error" onClose={() => setError('')} sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <FormControl fullWidth>
            <InputLabel>Selecciona Fecha de Producción</InputLabel>
            <Select
              value={selectedFecha}
              onChange={(e) => handleFechaChange(e.target.value)}
              label="Selecciona Fecha de Producción"
            >
              <MenuItem value="">-- Seleccionar --</MenuItem>
              {fechas.map((fecha) => (
                <MenuItem key={fecha.id} value={fecha.id}>
                  {formatDate(fecha.fecha_horneado)} - {fecha.abierta ? 'Abierta' : 'Cerrada'}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {reporte && !loading && (
        <Box>
          {/* Mostrar mensaje si no hay pedidos */}
          {reporte.totales.total_pedidos === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center" variant="h6" color="text.secondary" sx={{ py: 4 }}>
                  📭 No hay pedidos para esta fecha de producción
                </Typography>
                <Typography align="center" color="text.secondary">
                  Los pedidos aparecerán aquí cuando los clientes realicen sus órdenes.
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon={<Print />}
                  onClick={handlePrint}
                >
                  Imprimir
                </Button>
              </Box>

              {/* Resumen de totales */}
              <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Total Pedidos
                  </Typography>
                  <Typography variant="h4">
                    {reporte.totales.total_pedidos}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Productos a Hornear
                  </Typography>
                  <Typography variant="h4">
                    {reporte.totales.total_productos}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Costo Insumos
                  </Typography>
                  <Typography variant="h4" color="error.main">
                    {formatCurrency(reporte.totales.costo_insumos)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card elevation={2}>
                <CardContent>
                  <Typography color="text.secondary" gutterBottom variant="overline">
                    Margen
                  </Typography>
                  <Typography variant="h4" color="success.main">
                    {formatCurrency(reporte.totales.margen_ganancia)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({reporte.totales.porcentaje_margen.toFixed(1)}%)
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Resumen de productos */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                📦 Resumen de Productos
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Producto</strong></TableCell>
                      <TableCell align="center"><strong>Cantidad Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reporte.resumen_productos.map((producto) => (
                      <TableRow key={producto.producto_id}>
                        <TableCell>{producto.producto_nombre}</TableCell>
                        <TableCell align="center">
                          <Chip label={producto.cantidad_total} color="primary" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Lista de insumos necesarios */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                🛒 Lista de Compras - Insumos Necesarios
              </Typography>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell><strong>Insumo</strong></TableCell>
                      <TableCell align="right"><strong>Cantidad</strong></TableCell>
                      <TableCell align="right"><strong>Costo Total</strong></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reporte.insumos_necesarios.map((insumo) => (
                      <TableRow key={insumo.insumo_id}>
                        <TableCell>{insumo.insumo_nombre}</TableCell>
                        <TableCell align="right">
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {insumo.cantidad.toFixed(2)} {insumo.unidad_simbolo}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          {formatCurrency(insumo.costo_total)}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow>
                      <TableCell colSpan={2} align="right">
                        <strong>Total Costo Insumos:</strong>
                      </TableCell>
                      <TableCell align="right">
                        <Typography variant="h6" color="error.main">
                          {formatCurrency(reporte.totales.costo_insumos)}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>

          {/* Análisis financiero */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                💰 Análisis Financiero
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Total Ventas
                    </Typography>
                    <Typography variant="h5" color="primary.main">
                      {formatCurrency(reporte.totales.total_ventas)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                      Costo de Producción
                    </Typography>
                    <Typography variant="h5" color="error.main">
                      {formatCurrency(reporte.totales.costo_insumos)}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ p: 2, bgcolor: 'success.light', borderRadius: 1 }}>
                    <Typography variant="body2" color="success.dark">
                      Ganancia Neta
                    </Typography>
                    <Typography variant="h4" color="success.dark" sx={{ fontWeight: 700 }}>
                      {formatCurrency(reporte.totales.margen_ganancia)}
                    </Typography>
                    <Typography variant="body2" color="success.dark">
                      Margen: {reporte.totales.porcentaje_margen.toFixed(2)}%
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>

          {/* Lista de pedidos */}
          {reporte.pedidos.length > 0 && (
            <Card sx={{ mt: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  📋 Lista de Pedidos
                </Typography>
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell><strong>#</strong></TableCell>
                        <TableCell><strong>Cliente</strong></TableCell>
                        <TableCell><strong>Teléfono</strong></TableCell>
                        <TableCell><strong>Domicilio</strong></TableCell>
                        <TableCell align="right"><strong>Total</strong></TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {reporte.pedidos.map((pedido) => (
                        <TableRow key={pedido.id}>
                          <TableCell>{pedido.id}</TableCell>
                          <TableCell>{pedido.cliente_nombre}</TableCell>
                          <TableCell>{pedido.cliente_telefono}</TableCell>
                          <TableCell>{pedido.domicilio}</TableCell>
                          <TableCell align="right">
                            {formatCurrency(pedido.total)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          )}
            </>
          )}
        </Box>
      )}

      {!reporte && !loading && selectedFecha && (
        <Card>
          <CardContent>
            <Typography align="center" color="text.secondary">
              No hay datos de reporte para esta fecha
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default Reportes

