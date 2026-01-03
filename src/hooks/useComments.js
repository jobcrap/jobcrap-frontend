import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { commentsAPI } from '@/services/api.service';
import toast from 'react-hot-toast';

export const useComments = (storyId) => {
    return useQuery({
        queryKey: ['comments', storyId],
        queryFn: () => commentsAPI.getComments(storyId),
        enabled: !!storyId,
    });
};

export const useCreateComment = (storyId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (text) => commentsAPI.createComment(storyId, text),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', storyId] });
            toast.success('Comment posted successfully!');
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to post comment');
        },
    });
};

export const useVoteComment = (storyId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ commentId, type }) => commentsAPI.voteComment(commentId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Voting failed');
        }
    });
};

export const useDeleteComment = (storyId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId) => commentsAPI.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
            toast.success('Comment deleted');
        },
    });
};
