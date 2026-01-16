import { create } from 'zustand';
import { postsAPI } from '@/services/api.service';

/**
 * Posts Store
 * Manages posts state and filtering
 */
export const usePostsStore = create((set, get) => ({
    posts: [],
    filteredPosts: [], // Can probably be removed if backend handles filtering
    pagination: {
        page: 1,
        limit: 10,
        total: 0,
        pages: 0,
        hasMore: true
    },
    sortBy: 'recent',
    selectedCategory: null,
    selectedCountry: null,
    selectedTag: null,
    searchQuery: '',
    isLoading: false,
    error: null,
    lastFetched: null,
    cacheExpiry: 5 * 60 * 1000, // 5 minutes

    // Actions
    fetchPosts: async (force = false) => {
        const { posts, lastFetched, cacheExpiry, selectedCategory, selectedCountry, selectedTag, searchQuery, sortBy, pagination } = get();

        // Cache Check: Don't fetch if we have posts and they are fresh (and not forced)
        const now = Date.now();
        if (!force && posts.length > 0 && lastFetched && (now - lastFetched < cacheExpiry)) {
            console.log('Using cached posts');
            return;
        }

        set({ isLoading: true, error: null });
        try {
            // Map store sort to backend sort
            let backendSort;
            if (sortBy === 'recent') backendSort = '-createdAt';
            if (sortBy === 'top') backendSort = '-upvotes';
            if (sortBy === 'trending') backendSort = 'trending';
            if (sortBy === 'discussed') backendSort = 'discussed';
            if (sortBy === 'controversial') backendSort = 'controversial';

            const params = {
                page: pagination.page,
                limit: pagination.limit,
                category: selectedCategory,
                country: selectedCountry,
                tag: selectedTag,
                search: searchQuery,
                sort: backendSort
            };

            const data = await postsAPI.getPosts(params);

            set({
                posts: data.data.stories,
                pagination: {
                    ...data.data.pagination,
                    page: data.data.pagination.currentPage,
                    limit: data.data.pagination.itemsPerPage,
                    pages: data.data.pagination.totalPages,
                    hasMore: data.data.pagination.hasNext
                },
                lastFetched: now,
                isLoading: false
            });
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to fetch posts',
                isLoading: false
            });
        }
    },

    loadMorePosts: async () => {
        const { pagination, isLoading, selectedCategory, selectedCountry, selectedTag, searchQuery, sortBy } = get();

        if (isLoading || !pagination.hasMore) return;

        set({ isLoading: true });

        try {
            // Map store sort to backend sort
            let backendSort;
            if (sortBy === 'recent') backendSort = '-createdAt';
            if (sortBy === 'top') backendSort = '-upvotes';
            if (sortBy === 'trending') backendSort = 'trending';
            if (sortBy === 'discussed') backendSort = 'discussed';
            if (sortBy === 'controversial') backendSort = 'controversial';

            const nextPage = pagination.page + 1;
            const params = {
                page: nextPage,
                limit: pagination.limit,
                category: selectedCategory,
                country: selectedCountry,
                tag: selectedTag,
                search: searchQuery,
                sort: backendSort
            };

            const data = await postsAPI.getPosts(params);

            set(state => ({
                posts: [...state.posts, ...data.data.stories], // Append new posts
                pagination: {
                    ...data.data.pagination,
                    page: data.data.pagination.currentPage,
                    limit: data.data.pagination.itemsPerPage,
                    pages: data.data.pagination.totalPages,
                    hasMore: data.data.pagination.hasNext
                },
                isLoading: false
            }));
        } catch (error) {
            set({
                error: error.response?.data?.message || 'Failed to load more posts',
                isLoading: false
            });
        }
    },

    addPost: async (postData) => {
        set({ isLoading: true });
        try {
            await postsAPI.createPost(postData);
            // Re-fetch to ensure order/consistency or prepend
            // set((state) => ({ posts: [data.data, ...state.posts], isLoading: false }));
            await get().fetchPosts(true); // Force fetch to update cache and clear loading state
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message, isLoading: false });
            return false;
        }
    },

    deletePost: async (id) => {
        try {
            await postsAPI.deletePost(id);
            set((state) => ({
                posts: state.posts.filter(p => p._id !== id)
            }));
            return true;
        } catch (error) {
            console.error(error);
            return false;
        }
    },

    votePost: async (id, voteType) => {
        // Optimistic update
        set(state => ({
            posts: state.posts.map(p => {
                if (p._id === id) {
                    // This is simple but doesn't handle toggles perfectly without knowing previous vote
                    // The backend handles it, so we'll mainly rely on the response
                    return p;
                }
                return p;
            })
        }));

        try {
            const response = await postsAPI.votePost(id, voteType);
            // response = { success: true, data: { vote, story: { upvotes, downvotes } } }

            if (response.success && response.data.story) {
                set(state => ({
                    posts: state.posts.map(p =>
                        p._id === id
                            ? { ...p, ...response.data.story, userVote: response.data.vote }
                            : p
                    )
                }));
            }
        } catch (error) {
            console.error('Voting failed', error);
            // Re-fetch posts on error to restore correct state
            get().fetchPosts();
        }
    },

    setCategory: (category) => {
        set({
            selectedCategory: category,
            pagination: { ...get().pagination, page: 1 },
            lastFetched: null // Invalidate cache for new filters
        });
        get().fetchPosts(true);
    },

    setCountry: (country) => {
        set({
            selectedCountry: country,
            pagination: { ...get().pagination, page: 1 },
            lastFetched: null // Invalidate cache for new filters
        });
        get().fetchPosts(true);
    },

    setSortBy: (sort) => {
        set({
            sortBy: sort,
            pagination: { ...get().pagination, page: 1 },
            lastFetched: null // Invalidate cache for new filters
        });
        get().fetchPosts(true);
    },

    setTag: (tag) => {
        set({
            selectedTag: tag,
            pagination: { ...get().pagination, page: 1 },
            lastFetched: null
        });
        get().fetchPosts(true);
    },

    setSearchQuery: (query) => {
        set({
            searchQuery: query,
            pagination: { ...get().pagination, page: 1 },
            lastFetched: null
        });
        get().fetchPosts(true);
    },

    setPage: (page) => {
        set(state => ({ pagination: { ...state.pagination, page } }));
        get().fetchPosts();
    },

    clearFilters: () => {
        set({
            selectedCategory: null,
            selectedCountry: null,
            selectedTag: null,
            searchQuery: '',
            sortBy: 'recent',
            pagination: { ...get().pagination, page: 1 }
        });
        get().fetchPosts(true);
    }
}));
