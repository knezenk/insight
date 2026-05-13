import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { ProtectedRoute } from './ProtectedRoute';
import { AppLayout } from '@/components/layout/AppLayout';
import { LoadingScreen } from '@/components/common/LoadingScreen';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const WorkbenchPage = lazy(() => import('@/pages/WorkbenchPage'));
const AlertsPage = lazy(() => import('@/pages/AlertsPage'));
const NarrativesPage = lazy(() => import('@/pages/NarrativesPage'));
const InfluencersPage = lazy(() => import('@/pages/InfluencersPage'));
const CompetitivePage = lazy(() => import('@/pages/CompetitivePage'));
const ReportsPage = lazy(() => import('@/pages/ReportsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

export function App(): JSX.Element {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/workbench" element={<WorkbenchPage />} />
            <Route path="/alerts" element={<AlertsPage />} />
            <Route path="/narratives" element={<NarrativesPage />} />
            <Route path="/influencers" element={<InfluencersPage />} />
            <Route path="/competitive" element={<CompetitivePage />} />
            <Route path="/reports" element={<ReportsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
