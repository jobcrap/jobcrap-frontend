import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { cn } from '@/lib/utils';

export default function Layout() {
    const location = useLocation();
    const isAuthPath = ['/login', '/register'].includes(location.pathname);
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className={cn(
                isAdminPath ? "" : "py-6 sm:py-8",
                isAuthPath && "py-0 sm:py-0"
            )}>
                <Outlet />
            </main>
        </div>
    );
}
