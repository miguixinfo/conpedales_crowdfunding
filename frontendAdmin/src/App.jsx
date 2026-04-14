import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './admin/context/AuthContext';
import { DataProvider } from './context/DataContext';
import Home from './pages/Home';
import Donar from './pages/Donar';
import DonarExito from './pages/DonarExito';
import DonarCancelar from './pages/DonarCancelar';
import Diario from './pages/Diario';
import StageDetail from './pages/StageDetail';
import ElViaje from './pages/ElViaje';
import Mapa from './pages/Mapa';
import Comunidad from './pages/Comunidad';
import LoginPage from './admin/pages/LoginPage';
import AdminLayout from './admin/components/AdminLayout';
import DashboardPage from './admin/pages/DashboardPage';
import DonationsPage from './admin/pages/DonationsPage';
import StagesPage from './admin/pages/StagesPage';
import WaypointsPage from './admin/pages/WaypointsPage';
import TripPage from './admin/pages/TripPage';
import PreviousTripsPage from './admin/pages/PreviousTripsPage';
import SettingsPage from './admin/pages/SettingsPage';

function ProtectedRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <AdminLayout>{children}</AdminLayout>;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/donar" element={<Donar />} />
      <Route path="/donar/exito" element={<DonarExito />} />
      <Route path="/donar/cancelar" element={<DonarCancelar />} />
      <Route path="/diario" element={<Diario />} />
      <Route path="/diario/:id" element={<StageDetail />} />
      <Route path="/viaje" element={<ElViaje />} />
      <Route path="/mapa" element={<Mapa />} />
      <Route path="/comunidad" element={<Comunidad />} />
      
      <Route path="/admin/login" element={<LoginPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/donations"
        element={
          <ProtectedRoute>
            <DonationsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/stages"
        element={
          <ProtectedRoute>
            <StagesPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/waypoints"
        element={
          <ProtectedRoute>
            <WaypointsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/trip"
        element={
          <ProtectedRoute>
            <TripPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/previous-trips"
        element={
          <ProtectedRoute>
            <PreviousTripsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/settings"
        element={
          <ProtectedRoute>
            <SettingsPage />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <DataProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </DataProvider>
  );
}

export default App;