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
  Switch,
  FormControlLabel,
  useMediaQuery,
  useTheme,
  Stack,
  Divider,
} from '@mui/material'
import { Add, Edit, Delete, ToggleOn, CalendarToday, EventBusy, Notes } from '@mui/icons-material'
import { fechaProduccionService } from '../services/api'
import { formatDate } from '../utils/formatters'

const FechasProduccion = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  
  const [fechas, setFechas] = useState([])
  const [loading, setLoading] = useState(true)
  const [openDialog, setOpenDialog] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [formData, setFormData] = useState({
    id: null,
    fecha_horneado: '',
    fecha_limite: '',
    abierta: true,
    notas: '',
  })

  useEffect(() => {
    loadFechas()
  }, [])

  const loadFechas = async () => {
    try {
      const { data } = await fechaProduccionService.getAll()
      setFechas(data)
    } catch (error) {
      setError('Error cargando fechas')
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleOpenDialog = (fecha = null) => {
    if (fecha) {
      setFormData({
        id: fecha.id,
        fecha_horneado: fecha.fecha_horneado.split('T')[0],
        fecha_limite: fecha.fecha_limite.split('T')[0],
        abierta: fecha.abierta,
        notas: fecha.notas || '',
      })
    } else {
      setFormData({
        id: null,
        fecha_horneado: '',
        fecha_limite: '',
        abierta: true,
        notas: '',
      })
    }
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleSubmit = async () => {
    try {
      if (formData.id) {
        await fechaProduccionService.update(formData.id, formData)
        setSuccess('Fecha actualizada exitosamente')
      } else {
        await fechaProduccionService.create(formData)
        setSuccess('Fecha creada exitosamente')
      }
      loadFechas()
      handleCloseDialog()
    } catch (error) {
      setError(error.response?.data?.message || 'Error guardando fecha')
    }
  }

  const handleToggle = async (id) => {
    try {
      await fechaProduccionService.toggleAbierta(id)
      setSuccess('Estado actualizado')
      loadFechas()
    } catch (error) {
      setError('Error actualizando estado')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar esta fecha?')) return
    try {
      await fechaProduccionService.delete(id)
      setSuccess('Fecha eliminada exitosamente')
      loadFechas()
    } catch (error) {
      setError('Error eliminando fecha')
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
          Fechas de Producción
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpenDialog()}
        >
          Nueva Fecha
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
          {fechas.length === 0 ? (
            <Card>
              <CardContent>
                <Typography align="center" color="text.secondary">
                  No hay fechas registradas
                </Typography>
              </CardContent>
            </Card>
          ) : (
            fechas.map((fecha) => (
              <Card key={fecha.id} elevation={2}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {formatDate(fecha.fecha_horneado)}
                      </Typography>
                      <Chip
                        label={fecha.abierta ? 'Abierta' : 'Cerrada'}
                        color={fecha.abierta ? 'success' : 'default'}
                        size="small"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 1.5 }} />

                  <Box sx={{ mb: 1.5 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <EventBusy fontSize="small" />
                      Límite: {formatDate(fecha.fecha_limite)}
                    </Typography>
                  </Box>

                  {fecha.notas && (
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <Notes fontSize="small" />
                        {fecha.notas}
                      </Typography>
                    </Box>
                  )}

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                    <Button
                      size="small"
                      variant={fecha.abierta ? "contained" : "outlined"}
                      color={fecha.abierta ? "success" : "default"}
                      startIcon={<ToggleOn />}
                      onClick={() => handleToggle(fecha.id)}
                    >
                      {fecha.abierta ? 'Cerrar' : 'Abrir'}
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      color="primary"
                      startIcon={<Edit />}
                      onClick={() => handleOpenDialog(fecha)}
                    >
                      Editar
                    </Button>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(fecha.id)}
                    >
                      <Delete />
                    </IconButton>
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
                <TableCell><strong>Fecha de Horneado</strong></TableCell>
                <TableCell><strong>Fecha Límite</strong></TableCell>
                <TableCell><strong>Estado</strong></TableCell>
                <TableCell><strong>Notas</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fechas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No hay fechas registradas
                  </TableCell>
                </TableRow>
              ) : (
                fechas.map((fecha) => (
                  <TableRow key={fecha.id}>
                    <TableCell>{formatDate(fecha.fecha_horneado)}</TableCell>
                    <TableCell>{formatDate(fecha.fecha_limite)}</TableCell>
                    <TableCell>
                      <Chip
                        label={fecha.abierta ? 'Abierta' : 'Cerrada'}
                        color={fecha.abierta ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{fecha.notas || '-'}</TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        color="info"
                        onClick={() => handleToggle(fecha.id)}
                        title="Abrir/Cerrar"
                      >
                        <ToggleOn />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="primary"
                        onClick={() => handleOpenDialog(fecha)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        size="small"
                        color="error"
                        onClick={() => handleDelete(fecha.id)}
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
          {formData.id ? 'Editar Fecha' : 'Nueva Fecha de Producción'}
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Fecha de Horneado"
            type="date"
            value={formData.fecha_horneado}
            onChange={(e) => setFormData({ ...formData, fecha_horneado: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            fullWidth
            label="Fecha Límite para Pedidos"
            type="date"
            value={formData.fecha_limite}
            onChange={(e) => setFormData({ ...formData, fecha_limite: e.target.value })}
            margin="normal"
            required
            InputLabelProps={{ shrink: true }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.abierta}
                onChange={(e) => setFormData({ ...formData, abierta: e.target.checked })}
              />
            }
            label="Fecha abierta para pedidos"
            sx={{ mt: 2 }}
          />
          <TextField
            fullWidth
            label="Notas"
            value={formData.notas}
            onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
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
            disabled={!formData.fecha_horneado || !formData.fecha_limite}
          >
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default FechasProduccion

