import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
import { LoadingState } from './shared/LoadingState';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'client' | 'trainer' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (!user?.role) {
      navigate('/role-select');
      return;
    }

    if (requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard
      navigate(`/${user.role}`);
    }
  }, [isAuthenticated, user, requiredRole, navigate]);

  if (!isAuthenticated || !user?.role) {
    return <LoadingState />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <LoadingState />;
  }

  return <>{children}</>;
}
