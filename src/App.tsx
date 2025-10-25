import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import AppLayout from '@components/layouts/AppLayout';
import LoginPage from '@components/features/auth/LoginPages';
import ProtectedRoute from '@components/features/auth/ProtectedRoute';
import UnauthorizedPage from '@components/features/auth/UnauthorizedPage';

// Lazy loading des pages
import { lazy, Suspense } from 'react';
import Loading from '@components/shared/Common/Loading';
import { Permission } from '@models/auth';

// Dashboard
const DashboardPage = lazy(() => import('@components/features/dashboard/DashboardPage'));

// Infrastructure
const SiteListPage = lazy(() => import('@components/features/infrastructure/SiteListPage'));
const ZoneDetailPage = lazy(() => import('@components/features/infrastructure/ZoneDetailPage'));
const RackDetailPage = lazy(() => import('@components/features/infrastructure/RackDetailPage'));
const EquipmentDetailPage = lazy(() => import('@components/features/infrastructure/EquipmentDetailPage'));
const PortDetailPage = lazy(() => import('@components/features/infrastructure/PortDetailPage'));

// Modifications
const ProposedChangesPage = lazy(() => import('@components/features/modifications/ProposedChangesPage'));
const ChangeDetailModal = lazy(() => import('@components/features/modifications/ChangeDetailModal'));
const ValidationDashboard = lazy(() => import('@components/features/modifications/ValidationDashboard'));
const ChangeHistory = lazy(() => import('@components/features/modifications/ChangeHistory'));

// Configuration React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Suspense fallback={<Loading fullScreen text="Chargement..." />}>
          <Routes>
            {/* Route publique */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/unauthorized" element={<UnauthorizedPage />} />

            {/* Routes protégées - UNE SEULE VÉRIFICATION */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppLayout>
                    <Suspense fallback={<Loading fullScreen text="Chargement..." />}>
                      <Routes>
                        {/* Dashboard */}
                        <Route index element={<DashboardPage />} />

                        {/* Infrastructure */}
                        <Route path="sites" element={<SiteListPage />} />
                        <Route path="zones/:zoneId" element={<ZoneDetailPage />} />
                        <Route path="racks/:rackId" element={<RackDetailPage />} />
                        <Route path="equipments/:equipmentId" element={<EquipmentDetailPage />} />
                        <Route path="ports/:portId" element={<PortDetailPage />} />

                        {/* Modifications */}
                        <Route path="modifications" element={<ProposedChangesPage />} />
                        <Route path="modifications/:modificationId" element={<ChangeDetailModal />} />
                        <Route path="modifications/dashboard" element={<ValidationDashboard />} />
                        <Route path="modifications/history" element={<ChangeHistory />} />

                        {/* 404 */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </Suspense>
                  </AppLayout>
                </ProtectedRoute>
              }
            />
          </Routes>
        </Suspense>

        {/* Toast notifications */}
        <Toaster 
          position="top-right"
          theme="dark"
          richColors
          closeButton
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;