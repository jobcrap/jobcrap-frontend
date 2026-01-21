import PostCard from '@/components/post/PostCard';
import { PostSkeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function FeedList({
    posts,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    loadMoreRef,
    onVote,
    isFetching,
    onClearFilters,
    hasActiveFilters
}) {
    return (
        <div className="space-y-8">
            {/* Refreshing Indicator */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isFetching && !isLoading && !isFetchingNextPage ? 'h-12 opacity-100' : 'h-0 opacity-0'}`}>
                <div className="flex items-center justify-center gap-2 bg-primary/5 border border-primary/10 rounded-2xl h-10 animate-pulse">
                    <Loader2 className="w-4 h-4 text-primary animate-spin" />
                    <span className="text-xs font-bold text-primary uppercase tracking-[0.2em]">Updating rankings...</span>
                </div>
            </div>

            {isLoading && posts.length === 0 ? (
                <div className="space-y-6">
                    {[1, 2, 3].map((n) => (
                        <PostSkeleton key={n} />
                    ))}
                </div>
            ) : posts && posts.length > 0 ? (
                <div className="space-y-8">
                    {posts.map((post, index) => (
                        <div
                            key={post._id}
                            className="animate-fade-in-up"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <PostCard post={post} onVote={onVote} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors">
                    <div className="text-6xl mb-4">📭</div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No stories found</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or check back later</p>
                    {hasActiveFilters && (
                        <Button onClick={onClearFilters} variant="outline" className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                            Clear Filters
                        </Button>
                    )}
                </div>
            )}

            {/* Infinite Scroll Loader */}
            {(hasNextPage || isFetchingNextPage) && (
                <div ref={loadMoreRef} className="py-8 flex justify-center w-full">
                    {isFetchingNextPage && (
                        <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading more stories...</span>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
