import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import { usePostsStore } from '@/store/postsStore';
import { useAuthStore } from '@/store/authStore';
import { useInfinitePosts, useVotePost } from '@/hooks/usePosts';
import toast from 'react-hot-toast';
import PostCard from '@/components/post/PostCard';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, COUNTRIES } from '@/utils/constants';
import { SlidersHorizontal, X, PenSquare, Loader2 } from 'lucide-react';
import { PostSkeleton } from '@/components/ui/skeleton';

export default function Feed() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const {
        selectedCategory,
        selectedCountry,
        sortBy,
        setCategory,
        setCountry,
        setSortBy,
        clearFilters
    } = usePostsStore();

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        isLoading,
        error
    } = useInfinitePosts({
        category: selectedCategory,
        country: selectedCountry,
        sort: sortBy === 'recent' ? '-createdAt' : (sortBy === 'top' ? '-upvotes' : 'controversial')
    });

    const voteMutation = useVotePost();

    const posts = data?.pages.flatMap(page => page.data.stories) || [];

    // Intersection Observer for infinite scroll
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px', // Load before reaching bottom
    });

    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // We don't need independent applyFilters effect anymore as fetchPosts handles it via API params


    const handleVote = async (postId, voteType) => {
        if (!isAuthenticated) {
            toast.error('Please login to vote');
            return;
        }
        voteMutation.mutate({ id: postId, type: voteType });
    };

    const hasActiveFilters = selectedCategory || selectedCountry;

    return (
        <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Main Content - Left Column */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Discovery Header */}
                    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/5 via-primary/[0.02] to-transparent p-8 border border-primary/10">
                        <div className="relative z-10 max-w-2xl">
                            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-4">
                                Workplace <span className="text-primary bg-clip-text">Truths</span>.
                            </h1>
                            <p className="text-muted-foreground text-lg leading-relaxed mb-6 font-medium">
                                Explore thousands of anonymous stories from employees worldwide.
                                Unfiltered, honest, and completely confidential.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <Badge variant="outline" className="px-3 py-1 bg-background/50 border-primary/20 text-primary">
                                    🔥 Hot Topics
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 bg-background/50 border-border/50 text-muted-foreground">
                                    🌍 Global Feed
                                </Badge>
                                <Badge variant="outline" className="px-3 py-1 bg-background/50 border-border/50 text-muted-foreground">
                                    🛡️ 100% Anonymous
                                </Badge>
                            </div>
                        </div>
                        {/* Decorative background element */}
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50"></div>
                    </div>

                    {/* Posts Feed */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold tracking-tight">Top Stories</h2>
                        <div className="h-px flex-1 bg-border/40 mx-4 hidden sm:block"></div>
                    </div>

                    {isLoading && posts.length === 0 ? (
                        <div className="text-center py-10">Loading stories...</div>
                    ) : posts && posts.length > 0 ? (
                        posts.map((post, index) => (
                            <div
                                key={post._id}
                                className="animate-fade-in-up"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <PostCard post={post} onVote={handleVote} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-16 bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 transition-colors">
                            <div className="text-6xl mb-4">📭</div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No stories found</h3>
                            <p className="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or check back later</p>
                            {hasActiveFilters && (
                                <Button onClick={clearFilters} variant="outline" className="dark:bg-gray-800 dark:text-white dark:border-gray-700">
                                    Clear Filters
                                </Button>
                            )}
                        </div>
                    )}

                    {/* Infinite Scroll Loader */}
                    {(hasNextPage || isFetchingNextPage) && (
                        <div ref={ref} className="py-8 flex justify-center w-full">
                            {isFetchingNextPage && (
                                <div className="flex flex-col items-center gap-2">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Loading more stories...</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar - Right Column */}
                <div className="hidden lg:block lg:col-span-4 space-y-6">
                    {/* Filters Widget - Premium Redesign */}
                    <div className="bg-card/50 backdrop-blur-sm border border-border/40 rounded-3xl p-6 shadow-xl shadow-primary/5 sticky top-24 overflow-hidden group">
                        {/* Subtle Glow */}
                        <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500"></div>

                        <div className="relative z-10">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-lg flex items-center gap-2.5">
                                    <div className="p-2 bg-primary/10 rounded-xl">
                                        <SlidersHorizontal className="w-4 h-4 text-primary" />
                                    </div>
                                    Discovery Filters
                                </h3>
                                {hasActiveFilters && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-[10px] h-6 px-2 text-muted-foreground hover:text-primary hover:bg-primary/5 font-bold uppercase tracking-wider"
                                    >
                                        Reset
                                    </Button>
                                )}
                            </div>

                            <div className="space-y-4">
                                {/* Sort */}
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                                        Sort By
                                    </label>
                                    <Select value={sortBy} onValueChange={setSortBy}>
                                        <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11 focus:ring-primary/20">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="recent">🕐 Recent</SelectItem>
                                            <SelectItem value="top">🔥 Top Rated</SelectItem>
                                            <SelectItem value="controversial">⚡ Controversial</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Category Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                                        Category
                                    </label>
                                    <Select
                                        value={selectedCategory || 'all'}
                                        onValueChange={(value) => setCategory(value === 'all' ? null : value)}
                                    >
                                        <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11 focus:ring-primary/20">
                                            <SelectValue placeholder="All categories" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Categories</SelectItem>
                                            {CATEGORIES.map(cat => (
                                                <SelectItem key={cat.value} value={cat.value}>
                                                    {cat.emoji} {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Country Filter */}
                                <div>
                                    <label className="text-xs font-semibold text-muted-foreground mb-1.5 block uppercase tracking-wider">
                                        Country
                                    </label>
                                    <Select
                                        value={selectedCountry || 'all'}
                                        onValueChange={(value) => setCountry(value === 'all' ? null : value)}
                                    >
                                        <SelectTrigger className="w-full bg-background/50 border-border/50 rounded-xl h-11 focus:ring-primary/20">
                                            <SelectValue placeholder="All countries" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Countries</SelectItem>
                                            {COUNTRIES.map(country => (
                                                <SelectItem key={country.value} value={country.value}>
                                                    {country.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-border/20">
                                <Button
                                    className="w-full rounded-2xl bg-gradient-to-r from-primary via-blue-600 to-primary/80 text-white font-bold h-12 shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 group"
                                    onClick={() => navigate('/create')}
                                >
                                    <PenSquare className="w-4 h-4 mr-2 group-hover:rotate-12 transition-transform" />
                                    Share Your Story
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
