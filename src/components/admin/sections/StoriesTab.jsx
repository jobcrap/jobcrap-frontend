import React from 'react';
import AdminStoryCard from '../AdminStoryCard';
import { Loader2 } from 'lucide-react';

export default function StoriesTab({ posts, onDelete, onNavigate, isLoading }) {
    if (isLoading && posts.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-white dark:bg-[#343541] rounded-2xl border border-gray-100 dark:border-gray-800">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-gray-500 font-medium tracking-tight">Loading stories...</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {posts.map(post => (
                <AdminStoryCard
                    key={post._id}
                    post={post}
                    onDelete={onDelete}
                    onNavigate={onNavigate}
                />
            ))}
            {posts.length === 0 && !isLoading && (
                <div className="col-span-full text-center py-20 bg-white dark:bg-[#343541] rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                    <p className="text-gray-500">No stories found.</p>
                </div>
            )}
        </div>
    );
}
