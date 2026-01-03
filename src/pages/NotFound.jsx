import { useNavigate, Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, AlertCircle } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export default function NotFound() {
    const navigate = useNavigate();
    const { isAuthenticated, isLoading } = useAuthStore();

    if (isLoading) return null;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }
    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10" />
            <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -z-10" />

            <div className="max-w-md w-full">
                <div className="mb-6 relative">
                    <div className="text-9xl font-extrabold text-gray-200 dark:text-gray-800 animate-pulse">
                        404
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertCircle className="w-20 h-20 text-blue-600 dark:text-blue-500 opacity-80" />
                    </div>
                </div>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
                    Page Not Found
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Oops! The page you're looking for seems to have wandered off into another story.
                    Let's get you back on track.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Back to Home
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => navigate(-1)}
                        className="dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
                    >
                        Go Back
                    </Button>
                </div>
            </div>

            {/* Quote decoration */}
            <div className="mt-16 italic text-gray-500 dark:text-gray-500 text-sm">
                "Not all those who wander are lost... but this page definitely is."
            </div>
        </div>
    );
}
