import React from 'react';
import FlaggedPostCard from '../FlaggedPostCard';
import { Loader2 } from 'lucide-react';

export default function ReportsTab({ reports, onDismiss, onDelete, onNavigate, isLoading }) {
    if (isLoading && reports.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#343541] rounded-2xl border border-gray-100 dark:border-gray-800">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-tight">Loading reports...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {reports.map(report => (
                <FlaggedPostCard
                    key={report._id}
                    report={report}
                    onDismiss={onDismiss}
                    onDelete={onDelete}
                    onNavigate={onNavigate}
                />
            ))}
            {reports.length === 0 && !isLoading && (
                <div className="text-center py-20 bg-white dark:bg-[#343541] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500 font-medium">No pending user reports.</p>
                </div>
            )}
        </div>
    );
}
