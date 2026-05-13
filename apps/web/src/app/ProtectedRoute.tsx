import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuthStore } from '@/stores/auth.store';

export function ProtectedRoute(): JSX.Element {
  const location = useLocation();
  const { user, accessToken } = useAuthStore();
  if (!user || !accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <Outlet />;
}
