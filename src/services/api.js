import axios from 'axios'

// Configurar baseURL para producción
const API_URL = import.meta.env.VITE_API_URL || ''

if (import.meta.env.PROD && API_URL) {
  axios.defaults.baseURL = API_URL
}

// Clientes
export const clienteService = {
  getAll: () => axios.get('/api/clientes'),
  getById: (id) => axios.get(`/api/clientes/${id}`),
  search: (query) => axios.get(`/api/clientes/search?q=${query}`),
  create: (data) => axios.post('/api/clientes', data),
  update: (id, data) => axios.put(`/api/clientes/${id}`, data),
  delete: (id) => axios.delete(`/api/clientes/${id}`),
}

// Productos
export const productoService = {
  getAll: () => axios.get('/api/productos'),
  getById: (id) => axios.get(`/api/productos/${id}`),
  create: (data) => axios.post('/api/productos', data),
  update: (id, data) => axios.put(`/api/productos/${id}`, data),
  delete: (id) => axios.delete(`/api/productos/${id}`),
  addRecetaItem: (productoId, data) => axios.post(`/api/productos/${productoId}/receta`, data),
  updateRecetaItem: (productoId, recetaId, data) => 
    axios.put(`/api/productos/${productoId}/receta/${recetaId}`, data),
  removeRecetaItem: (productoId, recetaId) => 
    axios.delete(`/api/productos/${productoId}/receta/${recetaId}`),
}

// Insumos
export const insumoService = {
  getAll: () => axios.get('/api/insumos'),
  getById: (id) => axios.get(`/api/insumos/${id}`),
  create: (data) => axios.post('/api/insumos', data),
  update: (id, data) => axios.put(`/api/insumos/${id}`, data),
  delete: (id) => axios.delete(`/api/insumos/${id}`),
}

// Unidades
export const unidadService = {
  getAll: () => axios.get('/api/unidades'),
  getById: (id) => axios.get(`/api/unidades/${id}`),
  getByTipo: (tipo) => axios.get(`/api/unidades/tipo/${tipo}`),
  getConversiones: () => axios.get('/api/unidades/conversiones'),
  create: (data) => axios.post('/api/unidades', data),
  createConversion: (data) => axios.post('/api/unidades/conversiones', data),
}

// Fechas de producción
export const fechaProduccionService = {
  getAll: () => axios.get('/api/fechas-produccion'),
  getAbiertas: () => axios.get('/api/fechas-produccion/abiertas'),
  getById: (id) => axios.get(`/api/fechas-produccion/${id}`),
  create: (data) => axios.post('/api/fechas-produccion', data),
  update: (id, data) => axios.put(`/api/fechas-produccion/${id}`, data),
  toggleAbierta: (id) => axios.patch(`/api/fechas-produccion/${id}/toggle`),
  delete: (id) => axios.delete(`/api/fechas-produccion/${id}`),
}

// Pedidos
export const pedidoService = {
  getAll: () => axios.get('/api/pedidos'),
  getById: (id) => axios.get(`/api/pedidos/${id}`),
  getByCliente: (clienteId) => axios.get(`/api/pedidos/cliente/${clienteId}`),
  getByFechaProduccion: (fechaId) => axios.get(`/api/pedidos/fecha-produccion/${fechaId}`),
  create: (data) => axios.post('/api/pedidos', data),
  update: (id, data) => axios.put(`/api/pedidos/${id}`, data),
  updateEstado: (id, estado) => axios.patch(`/api/pedidos/${id}/estado`, { estado }),
  delete: (id) => axios.delete(`/api/pedidos/${id}`),
}

// Reportes
export const reporteService = {
  getReporteProduccion: (fechaProduccionId) => 
    axios.get(`/api/reportes/produccion/${fechaProduccionId}`),
  getReportePedido: (pedidoId) => axios.get(`/api/reportes/pedido/${pedidoId}`),
}

export default {
  clienteService,
  productoService,
  insumoService,
  unidadService,
  fechaProduccionService,
  pedidoService,
  reporteService,
}

