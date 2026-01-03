import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/context/ThemeContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PenSquare, User, LogOut, Moon, Sun, Shield, Menu, X } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isAuthenticated, user, logout } = useAuthStore();
    const { theme, toggleTheme } = useTheme();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    // Track scroll for premium "glass" effect
    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Admin check
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    const isAdmin = user?.role === 'admin' || adminEmails.includes(user?.email);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMenuOpen(false);
    };

    const navItems = [
        { name: 'Feed', path: '/feed', icon: null },
        { name: 'My Stories', path: '/my-stories', icon: null, auth: true },
        { name: 'Dashboard', path: '/admin', icon: Shield, auth: true, admin: true },
    ];

    const isActive = (path) => location.pathname === path;

    return (
        <nav className={cn(
            "sticky top-0 z-50 w-full transition-all duration-300 border-b",
            scrolled
                ? "bg-background/80 backdrop-blur-xl border-border/40 py-1"
                : "bg-background border-transparent py-2"
        )}>
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-14">

                    {/* Left: Logo & Home */}
                    <div className="flex items-center gap-4 lg:gap-10">
                        <Link
                            to="/"
                            className="flex items-center gap-3 group transition-transform active:scale-95"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Logo size="md" className="transition-opacity duration-300 group-hover:opacity-80" />
                        </Link>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-1">
                            {navItems.filter(item => {
                                if (item.auth && !isAuthenticated) return false;
                                if (item.admin && !isAdmin) return false;
                                return true;
                            }).map((item) => (
                                <Button
                                    key={item.path}
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => navigate(item.path)}
                                    className={cn(
                                        "relative px-4 h-9 rounded-full transition-all duration-300 font-bold text-sm",
                                        isActive(item.path)
                                            ? "text-primary bg-primary/5"
                                            : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                    )}
                                >
                                    {item.icon && <item.icon className="w-4 h-4 mr-2" />}
                                    {item.name}
                                    {isActive(item.path) && (
                                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                                    )}
                                </Button>
                            ))}
                        </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={toggleTheme}
                            className="rounded-full w-9 h-9 transition-transform active:scale-90"
                        >
                            {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                        </Button>

                        <div className="h-4 w-[1px] bg-border/40 mx-1 hidden sm:block" />

                        {isAuthenticated ? (
                            <>
                                <Button
                                    onClick={() => navigate('/create')}
                                    className="hidden sm:flex rounded-full bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 h-9 px-5 text-sm font-bold transition-all hover:scale-105 active:scale-95"
                                >
                                    <PenSquare className="w-4 h-4 mr-2" />
                                    Post
                                </Button>

                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/profile')}
                                    className={cn(
                                        "pl-1.5 pr-2.5 sm:pr-4 rounded-full gap-2 border transition-all h-9",
                                        isActive('/profile')
                                            ? "border-primary/30 bg-primary/5 text-primary"
                                            : "border-transparent hover:border-border/40 hover:bg-secondary/50"
                                    )}
                                >
                                    <div className="relative">
                                        <img
                                            src={user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                            alt={user?.username}
                                            className="w-6 h-6 rounded-full object-cover border border-border mt-0.5"
                                        />
                                        {isAdmin && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-primary border-2 border-background rounded-full" />}
                                    </div>
                                    <span className="max-w-[100px] truncate text-xs font-black hidden sm:block">
                                        {user?.username}
                                    </span>
                                </Button>

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={handleLogout}
                                    className="rounded-full w-9 h-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                </Button>
                            </>
                        ) : (
                            <div className="flex items-center gap-1.5">
                                <Button
                                    variant="ghost"
                                    onClick={() => navigate('/login')}
                                    className="rounded-sm h-8 px-4 text-xs font-bold"
                                >
                                    Log In
                                </Button>
                                <Button
                                    onClick={() => navigate('/register')}
                                    className="rounded-sm h-8 px-5 bg-foreground text-background hover:opacity-90 transition-all font-bold text-xs"
                                >
                                    Sign Up
                                </Button>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden ml-1 rounded-full w-9 h-9"
                        >
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div className={cn(
                "md:hidden absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-b border-border shadow-2xl transition-all duration-300 origin-top overflow-hidden",
                isMenuOpen ? "max-h-[80vh] py-6 opacity-100" : "max-h-0 py-0 opacity-0"
            )}>
                <div className="px-6 flex flex-col gap-4">
                    <div className="grid grid-cols-1 gap-1">
                        {navItems.filter(item => {
                            if (item.auth && !isAuthenticated) return false;
                            if (item.admin && !isAdmin) return false;
                            return true;
                        }).map((item) => (
                            <Button
                                key={item.path}
                                variant="ghost"
                                onClick={() => { navigate(item.path); setIsMenuOpen(false); }}
                                className={cn(
                                    "justify-start h-12 rounded-xl px-4 text-base font-bold",
                                    isActive(item.path) ? "text-primary bg-primary/5" : "text-muted-foreground"
                                )}
                            >
                                {item.icon && <item.icon className="w-5 h-5 mr-3" />}
                                {item.name}
                            </Button>
                        ))}
                        {isAuthenticated && (
                            <Button
                                variant="ghost"
                                onClick={() => { navigate('/profile'); setIsMenuOpen(false); }}
                                className={cn(
                                    "justify-start h-12 rounded-xl px-4 text-base font-bold",
                                    isActive('/profile') ? "text-primary bg-primary/5" : "text-muted-foreground"
                                )}
                            >
                                <User className="w-5 h-5 mr-3" />
                                Profile
                            </Button>
                        )}
                    </div>

                    {isAuthenticated ? (
                        <Button
                            onClick={() => { navigate('/create'); setIsMenuOpen(false); }}
                            className="w-full h-12 rounded-xl bg-primary text-white text-base font-black shadow-lg shadow-primary/20"
                        >
                            <PenSquare className="w-5 h-5 mr-2" />
                            Create New Story
                        </Button>
                    ) : (
                        <div className="grid grid-cols-2 gap-3 pt-2">
                            <Button variant="outline" onClick={() => { navigate('/login'); setIsMenuOpen(false); }} className="h-12 rounded-xl font-bold">Log In</Button>
                            <Button onClick={() => { navigate('/register'); setIsMenuOpen(false); }} className="h-12 rounded-xl bg-foreground text-background font-black">Sign Up</Button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}