// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

// Formatear fecha
export const formatDate = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Formatear fecha corta
export const formatDateShort = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-MX')
}

// Formatear fecha y hora
export const formatDateTime = (date) => {
  if (!date) return ''
  return new Date(date).toLocaleString('es-MX', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// Formatear número con decimales
export const formatNumber = (num, decimals = 2) => {
  return parseFloat(num).toFixed(decimals)
}

// Obtener badge color según estado
export const getEstadoColor = (estado) => {
  const colors = {
    pendiente: 'warning',
    confirmado: 'info',
    en_preparacion: 'primary',
    entregado: 'success',
    cancelado: 'error',
  }
  return colors[estado] || 'default'
}

// Obtener texto de estado
export const getEstadoTexto = (estado) => {
  const textos = {
    pendiente: 'Pendiente',
    confirmado: 'Confirmado',
    en_preparacion: 'En Preparación',
    entregado: 'Entregado',
    cancelado: 'Cancelado',
  }
  return textos[estado] || estado
}

// Convertir fecha ISO a formato YYYY-MM-DD para input type="date"
// Extrae solo la parte de fecha sin considerar zona horaria
export const dateToInputValue = (dateString) => {
  if (!dateString) return ''
  // Extraer solo la parte YYYY-MM-DD de cualquier formato de fecha
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

// Normalizar fecha de input type="date" a formato ISO con hora del mediodía
// Esto evita problemas de zona horaria al enviar al backend
export const normalizeDateForBackend = (dateString) => {
  if (!dateString) return null
  // Crear fecha con hora al mediodía para evitar cambios de día por zona horaria
  const [year, month, day] = dateString.split('-')
  const date = new Date(year, month - 1, day, 12, 0, 0)
  return date.toISOString()
}

