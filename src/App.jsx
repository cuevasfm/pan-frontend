import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import PrivateRoute from './components/PrivateRoute'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Clientes from './pages/Clientes'
import Productos from './pages/Productos'
import Insumos from './pages/Insumos'
import PedidosEditable from './pages/PedidosEditable'
import FechasProduccion from './pages/FechasProduccion'
import Reportes from './pages/Reportes'

function App() {
  const { user } = useAuth()

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Layout />
          </PrivateRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pedidos" element={<PedidosEditable />} />
        <Route
          path="productos"
          element={
            <PrivateRoute requireAdmin>
              <Productos />
            </PrivateRoute>
          }
        />
        <Route
          path="insumos"
          element={
            <PrivateRoute requireAdmin>
              <Insumos />
            </PrivateRoute>
          }
        />
        <Route
          path="clientes"
          element={
            <PrivateRoute requireAdmin>
              <Clientes />
            </PrivateRoute>
          }
        />
        <Route
          path="fechas-produccion"
          element={
            <PrivateRoute requireAdmin>
              <FechasProduccion />
            </PrivateRoute>
          }
        />
        <Route
          path="reportes"
          element={
            <PrivateRoute requireAdmin>
              <Reportes />
            </PrivateRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App

