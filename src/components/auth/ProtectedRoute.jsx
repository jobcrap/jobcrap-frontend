import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import NotFound from '@/pages/NotFound';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { isAuthenticated, user, isLoading } = useAuthStore();
    const location = useLocation();

    // Check admin by email from env or role
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    const isAdmin = user?.role === 'admin' || adminEmails.includes(user?.email);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (requireAdmin && !isAdmin) {
        return <NotFound />;
    }

    return children;
};

export default ProtectedRoute;
