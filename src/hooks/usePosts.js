import { useQuery, useMutation, useQueryClient, useInfiniteQuery } from '@tanstack/react-query';
import { postsAPI } from '@/services/api.service';
import toast from 'react-hot-toast';

export const usePosts = (params) => {
    return useQuery({
        queryKey: ['posts', params],
        queryFn: () => postsAPI.getPosts(params),
    });
};

export const useMyStories = (params) => {
    return useQuery({
        queryKey: ['posts', 'mine', params],
        queryFn: () => postsAPI.getMyStories(params),
    });
};

export const useInfinitePosts = (params) => {
    return useInfiniteQuery({
        queryKey: ['posts', 'infinite', params],
        queryFn: ({ pageParam = 1 }) => postsAPI.getPosts({ ...params, page: pageParam }),
        getNextPageParam: (lastPage) => {
            const { pagination } = lastPage.data;
            return pagination.hasNext ? pagination.currentPage + 1 : undefined;
        },
        initialPageParam: 1,
    });
};

export const usePost = (id) => {
    return useQuery({
        queryKey: ['post', id],
        queryFn: () => postsAPI.getPost(id),
        enabled: !!id,
    });
};

export const useCreatePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (postData) => postsAPI.createPost(postData),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Story posted successfully!');
        },
        onError: (error) => {
            const data = error.response?.data;
            let message = data?.message || 'Failed to post story';

            // If there are validation errors, show the first one
            if (data?.errors && Array.isArray(data.errors) && data.errors.length > 0) {
                message = data.errors[0].msg || message;
            }

            toast.error(message);
        },
    });
};

export const useVotePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, type }) => postsAPI.votePost(id, type),
        onMutate: async ({ id, type }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['posts'] });
            await queryClient.cancelQueries({ queryKey: ['post', id] });

            // Snapshot the previous values
            const previousPost = queryClient.getQueryData(['post', id]);
            const previousInfinitePosts = queryClient.getQueryData(['posts', 'infinite']);

            // Helper to compute new votes
            const getNewVoteState = (post) => {
                const oldVote = post.userVote;
                let newVote = type;
                let upvotes = post.upvotes || 0;
                let downvotes = post.downvotes || 0;

                if (oldVote === type) {
                    // Toggle off
                    newVote = null;
                    if (type === 'upvote') upvotes = Math.max(0, upvotes - 1);
                    else downvotes = Math.max(0, downvotes - 1);
                } else {
                    // New vote or switch
                    if (oldVote === 'upvote') upvotes = Math.max(0, upvotes - 1);
                    if (oldVote === 'downvote') downvotes = Math.max(0, downvotes - 1);

                    if (type === 'upvote') upvotes += 1;
                    if (type === 'downvote') downvotes += 1;
                }

                return { ...post, userVote: newVote, upvotes, downvotes };
            };

            // Optimistically update single post
            queryClient.setQueryData(['post', id], (old) => {
                if (!old) return old;
                return {
                    ...old,
                    data: getNewVoteState(old.data)
                };
            });

            // Optimistically update infinite queries
            queryClient.setQueriesData({ queryKey: ['posts', 'infinite'] }, (old) => {
                if (!old) return old;
                return {
                    ...old,
                    pages: old.pages.map(page => ({
                        ...page,
                        data: {
                            ...page.data,
                            stories: page.data.stories.map(post =>
                                post._id === id ? getNewVoteState(post) : post
                            )
                        }
                    }))
                };
            });

            return { previousPost, previousInfinitePosts };
        },
        onError: (err, variables, context) => {
            if (context?.previousPost) {
                queryClient.setQueryData(['post', variables.id], context.previousPost);
            }
            if (context?.previousInfinitePosts) {
                queryClient.setQueriesData({ queryKey: ['posts', 'infinite'] }, context.previousInfinitePosts);
            }
            toast.error(err.response?.data?.message || 'Voting failed');
        },
        onSettled: (data, error, variables) => {
            // Refetch to sync with server, but hopefully React Query handles 
            // the background refetch without UI jump if the data is similar.
            // We avoid full invalidation that causes fresh "empty" state.
            queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
            // For infinite posts, we don't invalidate to avoid jump, 
            // it will sync on next fetch or manual refresh.
        }
    });
};

export const useDeletePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => postsAPI.deletePost(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            toast.success('Post deleted successfully');
        },
    });
};
