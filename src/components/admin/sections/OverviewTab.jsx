import React from 'react';
import StatsOverview from '../StatsOverview';
import { Loader2, TrendingUp, AlertCircle } from 'lucide-react';

export default function OverviewTab({ stats, isLoading }) {
    if (isLoading && !stats.totalPosts) {
        return (
            <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium">Loading platform insights...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Main Stats Grid */}
            <StatsOverview stats={stats} />

            {/* Quick Insights / Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-[#343541] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-amber-500/10 rounded-lg">
                            <AlertCircle className="w-5 h-5 text-amber-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">Priority Attention</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        There are {stats.flaggedPosts || 0} flagged stories and {stats.pendingReports || 0} user reports pending review.
                    </p>
                    <button
                        onClick={() => window.location.hash = '#/admin/flagged'}
                        className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        Go to Moderation Center →
                    </button>
                </div>

                <div className="p-6 bg-white dark:bg-[#343541] rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-500/10 rounded-lg">
                            <TrendingUp className="w-5 h-5 text-green-500" />
                        </div>
                        <h3 className="font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider text-xs">Growth Metrics</h3>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        The platform currently hosts {stats.totalUsers || 0} registered users with {stats.activeUsers || 0} active in the last session.
                    </p>
                    <button
                        onClick={() => window.location.hash = '#/admin/users'}
                        className="text-sm font-bold text-primary hover:underline flex items-center gap-1"
                    >
                        Browse Users →
                    </button>
                </div>
            </div>
        </div>
    );
}
