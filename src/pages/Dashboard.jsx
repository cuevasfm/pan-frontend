import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from '@mui/material'
import {
  ShoppingCart,
  Inventory,
  People,
  CalendarToday,
} from '@mui/icons-material'
import { pedidoService, productoService, clienteService, fechaProduccionService } from '../services/api'
import { useAuth } from '../context/AuthContext'

const Dashboard = () => {
  const { user, isAdmin } = useAuth()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    pedidos: 0,
    productos: 0,
    clientes: 0,
    fechasAbiertas: 0,
  })

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      const promises = [
        pedidoService.getAll(),
        productoService.getAll(),
      ]

      if (isAdmin()) {
        promises.push(
          clienteService.getAll(),
          fechaProduccionService.getAbiertas()
        )
      }

      const results = await Promise.all(promises)
      
      setStats({
        pedidos: results[0].data.length,
        productos: results[1].data.length,
        clientes: results[2]?.data.length || 0,
        fechasAbiertas: results[3]?.data.length || 0,
      })
    } catch (error) {
      console.error('Error cargando estadísticas:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ title, value, icon, color }) => (
    <Card elevation={2}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box>
            <Typography color="text.secondary" gutterBottom variant="overline">
              {title}
            </Typography>
            <Typography variant="h3" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              color: `${color}.dark`,
              p: 2,
              borderRadius: 2,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  )

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    )
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 700 }}>
        ¡Bienvenido, {user?.nombre}! 👋
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Aquí tienes un resumen de tu panadería
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Pedidos Totales"
            value={stats.pedidos}
            icon={<ShoppingCart sx={{ fontSize: 40 }} />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Productos"
            value={stats.productos}
            icon={<Inventory sx={{ fontSize: 40 }} />}
            color="secondary"
          />
        </Grid>
        {isAdmin() && (
          <>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Clientes"
                value={stats.clientes}
                icon={<People sx={{ fontSize: 40 }} />}
                color="success"
              />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <StatCard
                title="Fechas Abiertas"
                value={stats.fechasAbiertas}
                icon={<CalendarToday sx={{ fontSize: 40 }} />}
                color="info"
              />
            </Grid>
          </>
        )}
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Accesos Rápidos
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Usa el menú lateral para navegar entre las diferentes secciones del sistema.
          </Typography>
          {isAdmin() && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                • Gestiona pedidos y clientes
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                • Administra productos e insumos
              </Typography>
              <Typography variant="body2" color="primary" sx={{ fontWeight: 500 }}>
                • Genera reportes de producción
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default Dashboard

