import { ThumbsUp, ThumbsDown, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { formatDate } from '@/utils/validation';

export default function CommentItem({ comment, user, onVote, onDelete }) {
    return (
        <Card className="p-4 shadow-sm border-border/40 bg-card/40 hover:bg-card transition-colors rounded-xl">
            <div className="flex flex-col gap-2">
                {/* Header: Author + Timestamp */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img
                            src={comment.author?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                            alt={comment.author?.username}
                            className="w-6 h-6 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                        />
                        <span className="font-semibold text-sm text-gray-900 dark:text-white">
                            {comment.author?.username || 'Anonymous'}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {formatDate(comment.createdAt)}
                        </span>
                    </div>
                </div>

                {/* Comment Text */}
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm whitespace-pre-wrap ml-8">
                    {comment.text}
                </p>

                {/* Actions Footer */}
                <div className="flex items-center gap-4 ml-8 mt-1">
                    {/* Vote Buttons */}
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVote(comment._id, 'upvote')}
                            className={`h-6 px-1.5 gap-1 hover:bg-transparent ${comment.userVote === 'upvote'
                                ? 'text-orange-600 dark:text-orange-400'
                                : 'text-gray-400 hover:text-orange-500'
                                }`}
                        >
                            <ThumbsUp className={`w-3.5 h-3.5 ${comment.userVote === 'upvote' ? 'fill-current' : ''}`} />
                            <span className={`text-xs font-bold ${comment.userVote === 'upvote' ? 'text-orange-500' : 'text-gray-500'}`}>
                                {comment.upvotes || 0}
                            </span>
                        </Button>

                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVote(comment._id, 'downvote')}
                            className={`h-6 px-1.5 gap-1 hover:bg-transparent ${comment.userVote === 'downvote'
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-gray-400 hover:text-blue-500'
                                }`}
                        >
                            <ThumbsDown className={`w-3.5 h-3.5 ${comment.userVote === 'downvote' ? 'fill-current' : ''}`} />
                            <span className={`text-xs font-bold ${comment.userVote === 'downvote' ? 'text-blue-500' : 'text-gray-500'}`}>
                                {comment.downvotes || 0}
                            </span>
                        </Button>
                    </div>

                    {/* Divide */}
                    <div className="w-px h-3 bg-gray-200 dark:bg-gray-700" />

                    {/* Delete Action */}
                    {(user?.id === comment.author?._id || user?.role === 'admin') && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(comment._id)}
                            className="ml-auto h-6 w-6 p-0 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
}
