import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { adminAPI } from '@/services/api.service';
import { cn } from '@/lib/utils';
import { Menu, Loader2 } from 'lucide-react';

// New Modular Components
import AdminSidebar from '@/components/admin/AdminSidebar';
import StatsOverview from '@/components/admin/StatsOverview';
import ConfirmModal from '@/components/common/ConfirmModal';
import { Button } from '@/components/ui/button';

// Extracted Tab Sections
import FlaggedTab from '@/components/admin/sections/FlaggedTab';
import StoriesTab from '@/components/admin/sections/StoriesTab';
import UsersTab from '@/components/admin/sections/UsersTab';
import ReportsTab from '@/components/admin/sections/ReportsTab';
import OverviewTab from '@/components/admin/sections/OverviewTab';
import SettingsTab from '@/components/admin/sections/SettingsTab';

// Main Platform Pages (Integrated)
import Feed from '@/pages/Feed';
import CreatePost from '@/pages/CreatePost';
import Profile from '@/pages/Profile';

export default function AdminPanel() {
    const navigate = useNavigate();
    const { tab: activeTab = 'overview' } = useParams();
    const { isAuthenticated, user } = useAuthStore();

    // Layout State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    // Data State
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [reports, setReports] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalPosts: 0,
        totalUsers: 0,
        pendingReports: 0,
        activeUsers: 0,
        flaggedPosts: 0,
        blockedUsers: 0
    });

    const [pagination, setPagination] = useState({
        posts: { page: 1, total: 0 },
        users: { page: 1, total: 0 },
        reports: { page: 1, total: 0 }
    });

    const [confirmConfig, setConfirmConfig] = useState({
        isOpen: false,
        title: "",
        description: "",
        confirmText: "Confirm",
        onConfirm: () => { },
        variant: "default"
    });

    // Admin access check
    const adminEmails = import.meta.env.VITE_ADMIN_EMAILS?.split(',').map(email => email.trim()) || [];
    const isAdmin = user?.role === 'admin' || adminEmails.includes(user?.email);

    // Tab switching with navigation
    const setActiveTab = (newTab) => navigate(`/admin/${newTab}`);

    // Redirect if not authenticated or not admin
    useEffect(() => {
        if (!isAuthenticated || !isAdmin) {
            navigate('/');
        }
    }, [isAuthenticated, isAdmin, navigate]);

    // Data Fetchers
    const fetchStats = async () => {
        try {
            const res = await adminAPI.getStats();
            setStats(res.data.data || res.data || {});
        } catch (error) {
            console.error('Failed to load stats', error);
        }
    };

    const fetchStories = async (page = 1, status = null) => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getAllStories({ page, limit: 12, status });
            setPosts(res.data.stories || []);
            setPagination(prev => ({
                ...prev,
                posts: { page, total: res.data.pagination.totalItems }
            }));
        } catch (error) {
            toast.error('Failed to load stories');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUsers = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getAllUsers({ page, limit: 10 });
            setUsers(res.data.users || []);
            setPagination(prev => ({
                ...prev,
                users: { page, total: res.data.pagination.totalItems }
            }));
        } catch (error) {
            toast.error('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchReports = async (page = 1) => {
        setIsLoading(true);
        try {
            const res = await adminAPI.getReports({ page, limit: 10, status: 'pending' });
            setReports(res.data.reports || []);
            setPagination(prev => ({
                ...prev,
                reports: { page, total: res.data.pagination.totalItems }
            }));
        } catch (error) {
            toast.error('Failed to load reports');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    useEffect(() => {
        // Clear previous state to avoid "flashing" old data
        setPosts([]);
        setUsers([]);
        setReports([]);
        setIsLoading(true);

        if (activeTab === 'flagged') fetchStories(1, 'flagged');
        else if (activeTab === 'posts') fetchStories(1);
        else if (activeTab === 'users' || activeTab === 'blocked') fetchUsers(1);
        else if (activeTab === 'reports') fetchReports(1);
        else setIsLoading(false); // For feed, profile, create
    }, [activeTab]);

    // Handlers
    const handleAction = (action, item) => {
        if (action === 'delete') {
            setConfirmConfig({
                isOpen: true,
                title: "Confirm Deletion",
                description: "Are you sure? This action is permanent.",
                confirmText: "Delete",
                variant: "destructive",
                onConfirm: async () => {
                    try {
                        await adminAPI.deleteStory(item._id);
                        setPosts(posts.filter(p => p._id !== item._id));
                        toast.success('Deleted successfully');
                    } catch (err) { toast.error('Action failed'); }
                }
            });
        } else if (action === 'block') {
            setConfirmConfig({
                isOpen: true,
                title: "Block User",
                description: `Block ${item.email}?`,
                confirmText: "Block",
                variant: "destructive",
                onConfirm: async () => {
                    try {
                        await adminAPI.toggleBlockUser(item._id);
                        setUsers(users.map(u => u._id === item._id ? { ...u, isBlocked: true } : u));
                        toast.success('User blocked');
                    } catch (err) { toast.error('Action failed'); }
                }
            });
        } else if (action === 'unblock') {
            handleUnblockUser(item._id, item.email);
        }
    };

    const handleUnblockUser = async (userId, userEmail) => {
        try {
            await adminAPI.toggleBlockUser(userId);
            setUsers(users.map(u => u._id === userId ? { ...u, isBlocked: false } : u));
            toast.success('User unblocked');
        } catch (err) { toast.error('Action failed'); }
    };

    const handleApprovePost = async (postId) => {
        try {
            await adminAPI.updateStoryStatus(postId, 'approved');
            setPosts(posts.filter(p => p._id !== postId));
            toast.success('Approved');
        } catch (err) { toast.error('Action failed'); }
    };

    const handleDismissReport = async (reportId) => {
        try {
            await adminAPI.updateReportStatus(reportId, 'resolved');
            setReports(reports.filter(r => r._id !== reportId));
            toast.success('Report dismissed');
        } catch (err) { toast.error('Action failed'); }
    };

    const handleDeleteReportedPost = (reportId, postId) => {
        setConfirmConfig({
            isOpen: true,
            title: "Delete Reported Content",
            description: "Delete this post and resolve the report?",
            confirmText: "Delete",
            variant: "destructive",
            onConfirm: async () => {
                try {
                    await adminAPI.deleteStory(postId);
                    await adminAPI.updateReportStatus(reportId, 'resolved');
                    setPosts(posts.filter(p => p._id !== postId));
                    setReports(reports.filter(r => r._id !== reportId));
                    toast.success('Content removed');
                } catch (err) { toast.error('Action failed'); }
            }
        });
    };

    if (!isAuthenticated || !isAdmin) return null;

    const currentPagination = (activeTab === 'users' || activeTab === 'blocked')
        ? pagination.users
        : activeTab === 'reports' ? pagination.reports : pagination.posts;

    const filteredUsers = activeTab === 'blocked' ? users.filter(u => u.isBlocked) : users;

    return (
        <div className="flex h-[calc(100vh-3.5rem)] bg-background overflow-hidden animate-fade-in">
            {/* Navigation Sidebar */}
            <AdminSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab}
                isCollapsed={isCollapsed}
                setIsCollapsed={setIsCollapsed}
                isMobileOpen={isMobileOpen}
                setIsMobileOpen={setIsMobileOpen}
            />

            {/* Main Content Area */}
            <div className="flex-1 h-full overflow-y-auto transition-all duration-300 scrollbar-hide overflow-x-hidden">
                <div className="p-6 md:p-12 xl:p-16 max-w-[1600px] mx-auto pb-32">
                    {/* Page Branding */}
                    <div className="mb-12 flex items-center justify-between">
                        <div className="animate-fade-in-up">
                            <h1 className="text-4xl md:text-6xl font-black text-foreground capitalize tracking-tighter">
                                {activeTab.replace('-', ' ')}
                            </h1>
                            <p className="text-muted-foreground font-bold uppercase tracking-[0.3em] text-[10px] mt-3 flex items-center gap-3">
                                <span className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.5)]" />
                                Platform Management • Dashboard Overview
                            </p>
                        </div>

                        {/* Right Actions */}
                        <div className="hidden sm:flex items-center gap-4">
                            <Button
                                className="rounded-2xl bg-primary text-primary-foreground font-black px-8 h-12 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
                                onClick={() => navigate('/feed')}
                            >
                                Live Feed
                            </Button>
                        </div>
                    </div>

                    {/* Active Section Content */}
                    <div className="space-y-10 animate-fade-in-up delay-150">
                        {/* Platform Integration Tabs */}
                        {activeTab === 'overview' && (
                            <OverviewTab stats={stats} isLoading={isLoading} />
                        )}
                        {activeTab === 'feed' && <Feed />}
                        {activeTab === 'create' && <CreatePost />}
                        {activeTab === 'profile' && <Profile />}

                        {/* Admin Management Tabs */}
                        {activeTab === 'flagged' && (
                            <FlaggedTab
                                posts={posts}
                                onApprove={handleApprovePost}
                                onDelete={(id) => handleAction('delete', { _id: id })}
                                onNavigate={navigate}
                                isLoading={isLoading}
                            />
                        )}

                        {activeTab === 'posts' && (
                            <StoriesTab
                                posts={posts}
                                onDelete={handleAction}
                                onNavigate={navigate}
                                isLoading={isLoading}
                            />
                        )}

                        {(activeTab === 'users' || activeTab === 'blocked') && (
                            <UsersTab
                                users={filteredUsers}
                                onAction={handleAction}
                                onNavigate={navigate}
                                isLoading={isLoading}
                            />
                        )}

                        {activeTab === 'reports' && (
                            <ReportsTab
                                reports={reports}
                                onDismiss={handleDismissReport}
                                onDelete={handleDeleteReportedPost}
                                onNavigate={navigate}
                                isLoading={isLoading}
                            />
                        )}

                        {activeTab === 'settings' && <SettingsTab />}

                        {/* Pagination Bar */}
                        {currentPagination.total > 0 && (
                            <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-6 px-4 py-8 rounded-[2.5rem] bg-card/30 backdrop-blur-xl border border-border/40">
                                <p className="text-sm text-muted-foreground font-bold uppercase tracking-widest">
                                    {activeTab} • {currentPagination.total} Results
                                </p>
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        disabled={currentPagination.page === 1}
                                        onClick={() => {
                                            const fetchFn = activeTab === 'users' ? fetchUsers : activeTab === 'reports' ? fetchReports : fetchStories;
                                            fetchFn(currentPagination.page - 1, activeTab === 'flagged' ? 'flagged' : null);
                                        }}
                                        className="h-12 rounded-2xl border-border/40 bg-background/50 hover:bg-primary/10 hover:text-primary transition-all font-bold px-6"
                                    >
                                        Earlier
                                    </Button>
                                    <div className="h-12 w-12 flex items-center justify-center bg-primary text-white rounded-2xl text-lg font-black shadow-lg shadow-primary/20">
                                        {currentPagination.page}
                                    </div>
                                    <Button
                                        variant="outline"
                                        size="lg"
                                        disabled={currentPagination.page * (activeTab === 'posts' ? 12 : 10) >= currentPagination.total}
                                        onClick={() => {
                                            const fetchFn = activeTab === 'users' ? fetchUsers : activeTab === 'reports' ? fetchReports : fetchStories;
                                            fetchFn(currentPagination.page + 1, activeTab === 'flagged' ? 'flagged' : null);
                                        }}
                                        className="h-12 rounded-2xl border-border/40 bg-background/50 hover:bg-primary/10 hover:text-primary transition-all font-bold px-6"
                                    >
                                        Later
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <ConfirmModal
                isOpen={confirmConfig.isOpen}
                onClose={() => setConfirmConfig({ ...confirmConfig, isOpen: false })}
                onConfirm={confirmConfig.onConfirm}
                title={confirmConfig.title}
                description={confirmConfig.description}
                confirmText={confirmConfig.confirmText}
                variant={confirmConfig.variant}
            />
        </div>
    );
}
