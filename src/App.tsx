import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import { useAuthStore } from '@store/authStore';
import AppLayout from '@components/layouts/AppLayout';
import LoginPage from '@components/features/auth/LoginPage';
import ProtectedRoute from '@components/features/auth/ProtectedRoute';

// Lazy loading des pages
import { lazy, Suspense } from 'react';
import Loading from '@components/shared/Common/Loading';

const DashboardPage = lazy(() => import('@components/features/dashboard/DashboardPage'));
const SiteListPage = lazy(() => import('@components/features/infrastructure/SiteListPage'));

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

          {/* Routes protégées */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout>
                  <Suspense fallback={<Loading fullScreen text="Chargement..." />}>
                    <Routes>
                      <Route path="/" element={<DashboardPage />} />
                      <Route path="/sites" element={<SiteListPage />} />
                      {/* TODO: Ajouter les autres routes */}
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
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;