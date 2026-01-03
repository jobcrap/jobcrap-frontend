import React from 'react';
import FlaggedPostCard from '../FlaggedPostCard';
import { Loader2 } from 'lucide-react';

export default function FlaggedTab({ posts, onApprove, onDelete, onNavigate, isLoading }) {
    if (isLoading && posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#343541] rounded-2xl border border-gray-100 dark:border-gray-800">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-tight">Loading flagged stories...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 gap-6">
            {posts.map(post => (
                <FlaggedPostCard
                    key={post._id}
                    post={post}
                    onApprove={onApprove}
                    onDelete={onDelete}
                    onNavigate={onNavigate}
                />
            ))}
            {posts.length === 0 && !isLoading && (
                <div className="text-center py-24 bg-white dark:bg-[#343541] rounded-2xl border border-dashed border-gray-200 dark:border-gray-800">
                    <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <p className="text-gray-900 dark:text-gray-100 font-bold text-lg">All caught up!</p>
                    <p className="text-gray-500 mt-1">No flagged stories require attention right now.</p>
                </div>
            )}
        </div>
    );
}
