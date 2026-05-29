import { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../contexts/AuthContext';
<<<<<<< HEAD
=======
import { LoadingState } from './shared/LoadingState';
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: 'client' | 'trainer' | 'admin';
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
<<<<<<< HEAD
  const { user, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/login');
      } else if (requiredRole && user?.role !== requiredRole) {
        navigate(`/${user?.role || 'role-select'}`);
      }
    }
  }, [isAuthenticated, user, requiredRole, navigate, isLoading]);

  if (isLoading || !isAuthenticated) return null;
  if (requiredRole && user?.role !== requiredRole) return null;
=======
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
>>>>>>> 76ad5ad406f60de07e05bda58a7f824a44f50e14

  return <>{children}</>;
}
