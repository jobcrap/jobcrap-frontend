import React from 'react';
import {
    LayoutDashboard,
    FileText,
    Users,
    Flag,
    ShieldAlert,
    ChevronLeft,
    ChevronRight,
    Settings,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/store/authStore';

export default function AdminSidebar({
    activeTab,
    onTabChange,
    isCollapsed,
    setIsCollapsed,
    setIsMobileOpen
}) {
    const { user } = useAuthStore();
    const menuItems = [
        { id: 'feed', label: 'Main Feed', icon: LayoutDashboard, color: 'text-indigo-500' },
        { id: 'create', label: 'Create Story', icon: FileText, color: 'text-pink-500' },
        { id: 'profile', label: 'My Profile', icon: Users, color: 'text-violet-500' },
        { id: 'separator', type: 'separator' },
        { id: 'overview', label: 'Overview', icon: LayoutDashboard, color: 'text-blue-600' },
        { id: 'flagged', label: 'Flagged Stories', icon: ShieldAlert, color: 'text-amber-500' },
        { id: 'posts', label: 'All Stories', icon: FileText, color: 'text-blue-500' },
        { id: 'users', label: 'User Management', icon: Users, color: 'text-green-500' },
        { id: 'blocked', label: 'Blocked Users', icon: Users, color: 'text-red-500' },
        { id: 'reports', label: 'User Reports', icon: Flag, color: 'text-purple-500' },
        { id: 'settings', label: 'Site Settings', icon: Settings, color: 'text-gray-500' },
    ];

    const renderSidebarContent = () => (
        <div className="flex flex-col h-full py-6">
            {/* Desktop Collapse Toggle */}
            <Button
                variant="outline"
                size="icon"
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="hidden md:flex absolute -right-3 top-8 w-6 h-6 rounded-full border-border/40 bg-background hover:bg-primary/10 transition-all z-40 p-0 shadow-lg active:scale-90"
            >
                {isCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
            </Button>

            {/* Mobile Close Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden absolute right-4 top-4 text-muted-foreground hover:text-foreground"
            >
                <X className="w-6 h-6" />
            </Button>

            {/* Sidebar Title */}
            <div className={cn(
                "px-6 mb-12 flex items-center gap-3 transition-all duration-300",
                "justify-center md:justify-start",
                isCollapsed && "md:justify-center"
            )}>
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 flex items-center justify-center flex-shrink-0 shadow-inner">
                    <ShieldAlert className="w-6 h-6 text-primary" />
                </div>
                {!isCollapsed && (
                    <div className="hidden md:flex flex-col animate-fade-in-up">
                        <span className="font-black text-lg tracking-tighter text-foreground whitespace-nowrap">Platform</span>
                        <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] -mt-1">Admin</span>
                    </div>
                )}
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 overflow-y-auto scrollbar-hide">
                {menuItems.map((item) => {
                    if (item.type === 'separator') {
                        return (
                            <div key="separator" className="my-6 border-t border-border/40 mx-4" />
                        );
                    }

                    const Icon = item.icon;
                    const isActive = activeTab === item.id;

                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                onTabChange(item.id);
                                setIsMobileOpen(false);
                            }}
                            className={cn(
                                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-300 group relative overflow-hidden",
                                isActive
                                    ? "bg-primary/10 text-primary shadow-sm"
                                    : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                                "justify-center md:px-4 md:justify-start",
                                isCollapsed && "md:justify-center md:px-0"
                            )}
                        >
                            {isActive && (
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r-full" />
                            )}

                            <Icon className={cn(
                                "w-5 h-5 transition-all duration-300",
                                isActive ? "scale-110" : "group-hover:scale-110"
                            )} />

                            {!isCollapsed && (
                                <span className="hidden md:block text-sm font-black tracking-tight whitespace-nowrap animate-fade-in">{item.label}</span>
                            )}

                            {/* Tooltip for collapsed state or mobile */}
                            {isCollapsed && (
                                <div className={cn(
                                    "absolute left-full ml-4 px-3 py-1.5 bg-foreground text-background text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all duration-300 transform translate-x-[-10px] group-hover:translate-x-0 z-50 shadow-xl",
                                    !isActive && "md:block",
                                    !isCollapsed && "md:hidden"
                                )}>
                                    {item.label}
                                </div>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* Footer Info */}
            <div className={cn(
                "px-4 py-6 border-t border-border/40 mt-auto",
                "flex justify-center"
            )}>
                {!isCollapsed ? (
                    <div className="hidden md:flex items-center gap-3 p-3 rounded-2xl bg-secondary/30 border border-border/40 animate-fade-in-up">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 p-0.5 shadow-inner flex-shrink-0">
                            <img
                                src={user?.avatar || "https://cdn-icons-png.flaticon.com/512/149/149071.png"}
                                alt="Admin"
                                className="w-full h-full object-cover rounded-[10px]"
                            />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-black truncate text-foreground tracking-tight">
                                {user?.username || 'Administrator'}
                            </p>
                            <div className="flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest truncate">Live</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="w-10 h-10 rounded-xl bg-secondary/50 mx-auto animate-pulse flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-green-500" />
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <>
            {/* Sidebar */}
            <aside
                className={cn(
                    "bg-card/40 backdrop-blur-2xl border-r border-border/40 transition-all duration-500 ease-in-out z-40",
                    "flex flex-col relative flex-shrink-0",
                    // Mobile width (always collapsed)
                    "w-20",
                    // Desktop width
                    isCollapsed ? "md:w-20" : "md:w-72"
                )}
            >
                {renderSidebarContent()}
            </aside>
        </>
    );
}
