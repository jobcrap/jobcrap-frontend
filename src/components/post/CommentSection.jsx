import { Link } from 'react-router-dom';
import { Send } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import CommentItem from './CommentItem';

export default function CommentSection({
    comments,
    isAuthenticated,
    user,
    newComment,
    onCommentChange,
    onAddComment,
    onVote,
    onDelete
}) {
    return (
        <div className="mt-8" id="comments-section">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                Comments ({comments.length})
            </h2>

            {/* Add Comment */}
            {isAuthenticated ? (
                <Card className="p-6 mb-6 shadow-md border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                    <Textarea
                        placeholder="Share your thoughts..."
                        value={newComment}
                        onChange={(e) => onCommentChange(e.target.value)}
                        rows={3}
                        className="mb-3 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                    />
                    <Button
                        onClick={onAddComment}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={!newComment.trim()}
                    >
                        <Send className="w-4 h-4 mr-2" />
                        Post Comment
                    </Button>
                </Card>
            ) : (
                <Card className="p-6 mb-6 text-center border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        Please login to comment on this story
                    </p>
                    <Link to="/login">
                        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                            Login to Comment
                        </Button>
                    </Link>
                </Card>
            )}

            {/* Comments List */}
            <div className="space-y-4">
                {comments.length > 0 ? (
                    comments.map(comment => (
                        <CommentItem
                            key={comment._id}
                            comment={comment}
                            user={user}
                            onVote={onVote}
                            onDelete={onDelete}
                        />
                    ))
                ) : (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        No comments yet. Be the first to share your thoughts!
                    </div>
                )}
            </div>
        </div>
    );
}
