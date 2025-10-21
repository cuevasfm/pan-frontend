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

