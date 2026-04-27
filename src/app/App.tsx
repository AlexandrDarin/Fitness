import { RouterProvider } from 'react-router';
import { router } from './routes';
import { Toaster } from './components/ui/sonner';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';

export default function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <RouterProvider router={router} />
        <Toaster richColors position="top-right" />
      </AppProvider>
    </AuthProvider>
  );
}