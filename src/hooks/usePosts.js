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
            toast.error(error.response?.data?.message || 'Failed to post story');
        },
    });
};

export const useVotePost = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, type }) => postsAPI.votePost(id, type),
        onSuccess: (data, variables) => {
            // Optimistically update or just invalidate
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', variables.id] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Voting failed');
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
