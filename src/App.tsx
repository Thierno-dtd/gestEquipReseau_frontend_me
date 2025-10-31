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
const SiteDetailPage = lazy(() => import('@components/features/infrastructure/SiteDetailPage'));
const ZoneDetailPage = lazy(() => import('@components/features/infrastructure/ZoneDetailPage'));
const RackDetailPage = lazy(() => import('@components/features/infrastructure/RackDetailPage'));
const EquipmentDetailPage = lazy(() => import('@components/features/infrastructure/EquipmentDetailPage'));
const PortDetailPage = lazy(() => import('@components/features/infrastructure/PortDetailPage'));

//Scan
const QRScannerPage = lazy(() => import('@components/features/qr-scanner/QRScannerPage'));

// Modifications
const ProposedChangesPage = lazy(() => import('@components/features/modifications/ProposedChangesPage'));
const ChangeDetailModal = lazy(() => import('@components/features/modifications/ChangeDetailModal'));
const ValidationDashboard = lazy(() => import('@components/features/modifications/ValidationDashboard'));
const ChangeHistory = lazy(() => import('@components/features/modifications/ChangeHistory'));


// Admin
const UserManagementPage = lazy(() => import('@components/features/admin/UserManagementPage'));
const SystemSettingsPage = lazy(() => import('@components/features/admin/SystemSettingsPage'));
const HierarchyManagerPage = lazy(() => import('@components/features/admin/HierarchyManagerPage'));

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
        <Routes>
          {/* Route publique */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Routes protégées */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Suspense fallback={<Loading fullScreen text="Chargement..." />}>
                    <Routes>
                      {/* Dashboard */}
                      <Route path="/" element={<DashboardPage />} />

                      {/* Infrastructure */}
                      <Route 
                        path="/sites" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                            <SiteListPage />
                          </ProtectedRoute>
                        } 
                      />
                        <Route
                            path="/sites/:siteId"
                            element={
                                <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                                    <SiteDetailPage />
                                </ProtectedRoute>
                            }
                        />

                      <Route 
                        path="/zones/:zoneId" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                            <ZoneDetailPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/racks/:rackId" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                            <RackDetailPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/equipments/:equipmentId" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                            <EquipmentDetailPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/ports/:portId" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                            <PortDetailPage />
                          </ProtectedRoute>
                        } 
                      />

                        {/* QR Scanner */}
                        <Route
                            path="/scan"
                            element={
                                <ProtectedRoute requiredPermission={Permission.SCAN_QR}>
                                    <QRScannerPage />
                                </ProtectedRoute>
                            }
                        />

                      {/* Modifications */}
                      <Route 
                        path="/modifications" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.PROPOSE_MODIFICATION}>
                            <ProposedChangesPage />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/modifications/:modificationId" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VALIDATE_MODIFICATION}>
                            <ChangeDetailModal />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/modifications/dashboard" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VALIDATE_MODIFICATION}>
                            <ValidationDashboard />
                          </ProtectedRoute>
                        } 
                      />
                      <Route 
                        path="/modifications/history" 
                        element={
                          <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                            <ChangeHistory />
                          </ProtectedRoute>
                        } 
                      />

                        <Route
                            path="/history"
                            element={
                                <ProtectedRoute requiredPermission={Permission.VIEW_INFRASTRUCTURE}>
                                    <ChangeHistory />
                                </ProtectedRoute>
                            }
                        />

                        {/* Administration */}
                        <Route
                            path="/users"
                            element={
                                <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
                                    <UserManagementPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <SystemSettingsPage />
                            }
                        />
                        <Route
                            path="/hierarchy"
                            element={
                                <ProtectedRoute requiredPermission={Permission.EDIT_INFRASTRUCTURE}>
                                    <HierarchyManagerPage />
                                </ProtectedRoute>
                            }
                        />

                      {/* 404 */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </Suspense>
                </AppLayout>
              </ProtectedRoute>
            }
          />
        </Routes>

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