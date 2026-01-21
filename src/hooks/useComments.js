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
        onMutate: async ({ commentId, type }) => {
            // Cancel outgoing refetches
            await queryClient.cancelQueries({ queryKey: ['comments', storyId] });

            // Snapshot previous comments
            const previousComments = queryClient.getQueryData(['comments', storyId]);

            // Optimistically update
            queryClient.setQueryData(['comments', storyId], (old) => {
                if (!old) return old;

                const getNewVoteState = (comment) => {
                    const oldVote = comment.userVote;
                    let newVote = type;
                    let upvotes = comment.upvotes || 0;
                    let downvotes = comment.downvotes || 0;

                    if (oldVote === type) {
                        newVote = null;
                        if (type === 'upvote') upvotes = Math.max(0, upvotes - 1);
                        else downvotes = Math.max(0, downvotes - 1);
                    } else {
                        if (oldVote === 'upvote') upvotes = Math.max(0, upvotes - 1);
                        if (oldVote === 'downvote') downvotes = Math.max(0, downvotes - 1);

                        if (type === 'upvote') upvotes += 1;
                        if (type === 'downvote') downvotes += 1;
                    }

                    return { ...comment, userVote: newVote, upvotes, downvotes };
                };

                return {
                    ...old,
                    data: {
                        ...old.data,
                        comments: (old.data.comments || []).map(c =>
                            c._id === commentId ? getNewVoteState(c) : c
                        )
                    }
                };
            });

            return { previousComments };
        },
        onError: (err, variables, context) => {
            if (context?.previousComments) {
                queryClient.setQueryData(['comments', storyId], context.previousComments);
            }
            toast.error(err.response?.data?.message || 'Voting failed');
        },
        onSettled: () => {
            // Background sync
            queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
        }
    });
};

export const useDeleteComment = (storyId) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (commentId) => commentsAPI.deleteComment(commentId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['comments', storyId] });
            queryClient.invalidateQueries({ queryKey: ['posts'] });
            queryClient.invalidateQueries({ queryKey: ['post', storyId] });
            toast.success('Comment deleted');
        },
    });
};
