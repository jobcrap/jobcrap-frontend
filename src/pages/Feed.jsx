import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { usePostsStore } from '@/store/postsStore';
import { useAuthStore } from '@/store/authStore';
import { useInfinitePosts, useVotePost } from '@/hooks/usePosts';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SlidersHorizontal, X, PenSquare } from 'lucide-react';

import FeedHeader from '@/components/feed/FeedHeader';
import FeedSearchBar from '@/components/feed/FeedSearchBar';
import FeedFilters from '@/components/feed/FeedFilters';
import FeedList from '@/components/feed/FeedList';

export default function Feed() {
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();
    const queryClient = useQueryClient();
    const { isAuthenticated } = useAuthStore();
    const {
        selectedCategory,
        selectedCountry,
        selectedTag,
        sortBy,
        searchQuery,
        setCategory,
        setCountry,
        setTag,
        setSortBy,
        setSearchQuery,
        clearFilters
    } = usePostsStore();

    const [localSearch, setLocalSearch] = useState(searchParams.get('search') || searchQuery || '');

    // Sync URL params To Store on mount
    useEffect(() => {
        const urlCategory = searchParams.get('category');
        const urlCountry = searchParams.get('country');
        const urlTag = searchParams.get('tag');
        const urlSort = searchParams.get('sort');
        const urlSearch = searchParams.get('search');

        if (urlCategory) setCategory(urlCategory);
        if (urlCountry) setCountry(urlCountry);
        if (urlTag) setTag(urlTag);
        if (urlSort) setSortBy(urlSort);
        if (urlSearch) {
            setSearchQuery(urlSearch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Run once on mount

    // Debounced search update
    useEffect(() => {
        const timer = setTimeout(() => {
            if (localSearch !== searchQuery) {
                setSearchQuery(localSearch);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [localSearch, searchQuery, setSearchQuery]);

    // Sync Store To URL 
    useEffect(() => {
        const params = {};
        if (selectedCategory) params.category = selectedCategory;
        if (selectedCountry) params.country = selectedCountry;
        if (selectedTag) params.tag = selectedTag;
        if (sortBy) params.sort = sortBy;
        if (searchQuery) params.search = searchQuery;

        setSearchParams(params, { replace: true });

        // Scroll to top when filters change
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Invalidate queries to ensure fresh data when switching filters
        queryClient.invalidateQueries({ queryKey: ['posts', 'infinite'] });
    }, [selectedCategory, selectedCountry, selectedTag, sortBy, searchQuery, setSearchParams, queryClient]);

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isFetching,
        isLoading,
        refetch
    } = useInfinitePosts({
        category: selectedCategory,
        country: selectedCountry,
        tag: selectedTag,
        search: searchQuery,
        sort: sortBy === 'recent' ? '-createdAt' : (sortBy === 'top' ? '-upvotes' : (sortBy === 'trending' ? 'trending' : (sortBy === 'discussed' ? 'discussed' : 'controversial')))
    });

    // Auto-refresh on scroll up at top (Pull-to-refresh style)
    useEffect(() => {
        let lastTouchY = 0;
        let pullThreshold = 80;

        const handleWheel = (e) => {
            // Check if at top and scrolling UP (deltaY is negative)
            if (window.scrollY <= 0 && e.deltaY < -50 && !isFetching) {
                refetch();
            }
        };

        const handleTouchStart = (e) => {
            lastTouchY = e.touches[0].clientY;
        };

        const handleTouchMove = (e) => {
            if (window.scrollY <= 0 && !isFetching) {
                const currentY = e.touches[0].clientY;
                const pullDistance = currentY - lastTouchY;
                if (pullDistance > pullThreshold) {
                    refetch();
                    lastTouchY = currentY; // Reset to prevent multiple triggers
                    toast.success('Refreshing feed...', { id: 'pull-refresh', duration: 1000 });
                }
            }
        };

        window.addEventListener('wheel', handleWheel, { passive: true });
        window.addEventListener('touchstart', handleTouchStart, { passive: true });
        window.addEventListener('touchmove', handleTouchMove, { passive: true });

        return () => {
            window.removeEventListener('wheel', handleWheel);
            window.removeEventListener('touchstart', handleTouchStart);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, [isFetching, refetch]);

    const voteMutation = useVotePost();

    const posts = data?.pages.flatMap(page => page.data.stories) || [];

    // Intersection Observer for infinite scroll
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px', // Load before reaching bottom
    });

    const [showFilters, setShowFilters] = useState(false);
    const hasActiveFilters = !!(selectedCategory || selectedCountry || selectedTag || searchQuery || (sortBy && sortBy !== 'recent'));

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);


    const handleVote = async (postId, voteType) => {
        if (!isAuthenticated) {
            toast.error('Please login to vote');
            return;
        }
        voteMutation.mutate({ id: postId, type: voteType });
    };

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content - Left Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Discovery Header & Search */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-8 border border-primary/10">
                        <FeedHeader />

                        <FeedSearchBar
                            value={localSearch}
                            onChange={(val) => setLocalSearch(val)}
                            onClear={() => {
                                setLocalSearch('');
                                setSearchQuery('');
                            }}
                        />

                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    {/* Posts Feed Header */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold tracking-tight">
                                {selectedTag ? `#${selectedTag}` : 'Top Stories'}
                            </h2>
                            {selectedTag && (
                                <Badge
                                    variant="secondary"
                                    className="cursor-pointer hover:bg-destructive hover:text-white transition-colors"
                                    onClick={() => setTag(null)}
                                >
                                    <X className="w-3 h-3 mr-1" /> Clear Tag
                                </Badge>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowFilters(!showFilters)}
                                className={`lg:hidden h-8 text-xs font-bold gap-2 ${showFilters ? 'bg-primary text-white border-primary' : 'bg-background/50 backdrop-blur border-border/40'}`}
                            >
                                <SlidersHorizontal className="w-3.5 h-3.5" />
                                Filters
                                {hasActiveFilters && <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />}
                            </Button>
                            <div className="h-px w-24 bg-border/40 hidden sm:block"></div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refetch()}
                                className="text-xs font-bold text-muted-foreground hover:text-primary"
                                disabled={isFetching}
                            >
                                {isFetching ? 'Refreshing...' : 'Refresh'}
                            </Button>
                        </div>
                    </div>

                    {/* Mobile Filters Panel */}
                    {showFilters && (
                        <div className="lg:hidden mt-4 p-4 bg-card border border-border/40 rounded-2xl shadow-lg mb-6 relative z-10">
                            <FeedFilters
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setCategory}
                                selectedCountry={selectedCountry}
                                onCountryChange={setCountry}
                                onClearFilters={() => {
                                    clearFilters();
                                    setShowFilters(false);
                                }}
                                hasActiveFilters={hasActiveFilters}
                            />
                        </div>
                    )}

                    {/* Posts List */}
                    <FeedList
                        posts={posts}
                        isLoading={isLoading}
                        isFetchingNextPage={isFetchingNextPage}
                        hasNextPage={hasNextPage}
                        loadMoreRef={ref}
                        onVote={handleVote}
                        isFetching={isFetching}
                        onClearFilters={clearFilters}
                        hasActiveFilters={hasActiveFilters}
                    />
                </div>

                {/* Sidebar - Right Column */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl p-6 shadow-xl shadow-primary/5 sticky top-24 overflow-hidden group">
                        {/* Subtle Glow */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>

                        <div className="relative z-10">
                            <FeedFilters
                                sortBy={sortBy}
                                onSortChange={setSortBy}
                                selectedCategory={selectedCategory}
                                onCategoryChange={setCategory}
                                selectedCountry={selectedCountry}
                                onCountryChange={setCountry}
                                onClearFilters={clearFilters}
                                hasActiveFilters={hasActiveFilters}
                                onShareClick={() => navigate('/create')}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
