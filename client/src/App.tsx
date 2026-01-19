import { Navigate, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/Login';
import HomePage from './pages/Home';
import ParkingDetailPage from './pages/ParkingDetail';
import MyPage from './pages/MyPage';
import { useAuthStore } from './store/auth';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token } = useAuthStore();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <HomePage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/parking/:id"
        element={
          <ProtectedRoute>
            <ParkingDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/my"
        element={
          <ProtectedRoute>
            <MyPage />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
