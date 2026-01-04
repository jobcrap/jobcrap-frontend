import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import { cn } from '@/lib/utils';

export default function Layout() {
    const location = useLocation();
    const isAuthPath = ['/login', '/register'].includes(location.pathname);
    const isAdminPath = location.pathname.startsWith('/admin');

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-950 transition-colors">
            <Navbar />
            <main className={cn(
                "flex-1",
                isAdminPath ? "" : "py-6 sm:py-8",
                isAuthPath && "py-0 sm:py-0"
            )}>
                <Outlet />
            </main>
            {!isAuthPath && <Footer />}
        </div>
    );
}
