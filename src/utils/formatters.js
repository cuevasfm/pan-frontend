// Formatear moneda
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount)
}

// Formatear fecha sin conversión de zona horaria
export const formatDate = (date) => {
  if (!date) return ''

  // Extraer solo la parte de fecha (YYYY-MM-DD) para evitar zona horaria
  const dateOnly = date.split('T')[0]
  const [year, month, day] = dateOnly.split('-')

  // Crear fecha usando UTC para evitar conversión de zona horaria
  const dateObj = new Date(Date.UTC(year, month - 1, day))

  return dateObj.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC' // Forzar UTC para evitar conversión
  })
}

// Formatear fecha corta sin conversión de zona horaria
export const formatDateShort = (date) => {
  if (!date) return ''

  // Extraer solo la parte de fecha (YYYY-MM-DD) para evitar zona horaria
  const dateOnly = date.split('T')[0]
  const [year, month, day] = dateOnly.split('-')

  // Crear fecha usando UTC para evitar conversión de zona horaria
  const dateObj = new Date(Date.UTC(year, month - 1, day))

  return dateObj.toLocaleDateString('es-MX', {
    timeZone: 'UTC' // Forzar UTC para evitar conversión
  })
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
// Extrae solo la parte de fecha SIN conversión de zona horaria
export const dateToInputValue = (dateString) => {
  if (!dateString) return ''
  // Extraer SOLO los primeros 10 caracteres (YYYY-MM-DD) sin conversión
  // Esto evita problemas de zona horaria entre servidor y cliente
  return dateString.split('T')[0]
}

// Normalizar fecha de input type="date" para backend
// Envía SOLO la fecha sin hora ni zona horaria
export const normalizeDateForBackend = (dateString) => {
  if (!dateString) return null
  // Enviar solo YYYY-MM-DD sin conversión de zona horaria
  // El backend debe guardar como DATE, no TIMESTAMP
  return dateString
}

