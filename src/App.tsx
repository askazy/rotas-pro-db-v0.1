import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';

// Páginas
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AdminDashboard from './pages/AdminDashboard';
import DriverDashboard from './pages/DriverDashboard';
import PassengerDashboard from './pages/PassengerDashboard';

// Páginas de administrador
import AdminDriversPage from './pages/admin/AdminDriversPage';
import AdminPassengersPage from './pages/admin/AdminPassengersPage';
import AdminReportsPage from './pages/admin/AdminReportsPage';

// Páginas de motorista
import DriverProfilePage from './pages/driver/DriverProfilePage';
import DriverHistoryPage from './pages/driver/DriverHistoryPage';

// Páginas de passageiro
import PassengerProfilePage from './pages/passenger/PassengerProfilePage';
import PassengerRideHistoryPage from './pages/passenger/PassengerRideHistoryPage';

// Componentes
import ProtectedRoute from './components/auth/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Páginas públicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Rotas de administrador */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/drivers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDriversPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/passengers" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminPassengersPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminReportsPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas de motorista */}
          <Route 
            path="/driver" 
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/driver/profile" 
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/driver/history" 
            element={
              <ProtectedRoute allowedRoles={['driver']}>
                <DriverHistoryPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rotas de passageiro */}
          <Route 
            path="/passenger" 
            element={
              <ProtectedRoute allowedRoles={['passenger']}>
                <PassengerDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/passenger/profile" 
            element={
              <ProtectedRoute allowedRoles={['passenger']}>
                <PassengerProfilePage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/passenger/history" 
            element={
              <ProtectedRoute allowedRoles={['passenger']}>
                <PassengerRideHistoryPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Rota padrão - redirecionar para a página inicial */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
