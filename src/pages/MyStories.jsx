import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useMyStories, useDeletePost } from '@/hooks/usePosts';
import toast from 'react-hot-toast';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Flag, MessageCircle, Eye, Clock, ShieldCheck, ThumbsUp } from 'lucide-react';
import { CATEGORIES } from '@/utils/constants';
import { formatDate } from '@/utils/validation';
import EditStoryModal from '@/components/post/EditStoryModal';
import ConfirmModal from '@/components/common/ConfirmModal';
import { PostSkeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

export default function MyStories() {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuthStore();

    const [editingStory, setEditingStory] = useState(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [storyToDelete, setStoryToDelete] = useState(null);

    const {
        data: storiesData,
        isLoading,
        refetch
    } = useMyStories();

    const deletePostMutation = useDeletePost();
    const stories = storiesData?.data?.stories || storiesData?.stories || [];

    const handleEdit = (story) => {
        setEditingStory(story);
    };

    const handleDeleteClick = (storyId) => {
        setStoryToDelete(storyId);
        setIsDeleteModalOpen(true);
    };

    const handleUpdateSuccess = async () => {
        await refetch();
        setEditingStory(null);
        toast.success('Story updated successfully');
    };

    if (!isAuthenticated) return null;

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            {/* Header */}
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-foreground mb-3 leading-tight">
                        Your <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Digital Footprint</span>
                    </h1>
                    <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                        Manage and refine the professional stories you've shared with the world.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/create')}
                    className="rounded-full px-6 h-11 font-bold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all"
                >
                    <Edit className="w-4 h-4 mr-2" /> Share Another
                </Button>
            </div>

            {/* Stories Grid/List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {isLoading ? (
                    <>
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                        <PostSkeleton />
                    </>
                ) : stories.length > 0 ? (
                    stories.map(story => {
                        const category = CATEGORIES.find(c => c.value === story.category);
                        const netVotes = story.upvotes - story.downvotes;

                        return (
                            <Card key={story._id} className="group overflow-hidden border-border/40 bg-card/60 backdrop-blur-md hover:bg-card hover:border-primary/20 shadow-sm transition-all duration-500 rounded-3xl p-6">
                                {/* Action Buttons - Top Right */}
                                <div className="absolute top-4 right-4 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => handleEdit(story)}
                                        className="h-9 w-9 rounded-full bg-background/80 hover:bg-background shadow-sm border border-border/40"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={() => handleDeleteClick(story._id)}
                                        className="h-9 w-9 rounded-full bg-background/80 hover:bg-red-500 hover:text-white shadow-sm border border-border/40"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="flex items-start gap-4 mb-4">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center border border-primary/20">
                                        <ShieldCheck className="w-5 h-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <span className="font-bold text-foreground truncate">
                                                {story.isAnonymous ? 'Anonymous' : (user?.username || 'Member')}
                                            </span>
                                            <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-medium bg-secondary/50 border-transparent">
                                                {category?.emoji} {category?.label}
                                            </Badge>
                                            {story.status === 'flagged' && (
                                                <Badge variant="destructive" className="text-[10px] h-5 px-1.5 animate-pulse">
                                                    Flagged
                                                </Badge>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                            <span>{story.profession}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDate(story.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-foreground/90 leading-relaxed text-[15px] mb-6 line-clamp-3">
                                    {story.text}
                                </p>

                                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "flex items-center gap-1.5 text-sm font-bold",
                                            netVotes > 0 ? "text-orange-500" : netVotes < 0 ? "text-blue-500" : "text-muted-foreground"
                                        )}>
                                            <ThumbsUp className="w-4 h-4 fill-current opacity-70" />
                                            <span>{netVotes}</span>
                                        </div>
                                        <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                                            <MessageCircle className="w-4 h-4" />
                                            <span>{story.commentsCount || 0}</span>
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => navigate(`/post/${story._id}`)}
                                        className="h-8 rounded-full text-xs font-bold gap-1.5 hover:bg-primary/10 hover:text-primary"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Full Story
                                    </Button>
                                </div>
                            </Card>
                        );
                    })
                ) : (
                    <div className="lg:col-span-2 py-16 text-center border-2 border-dashed border-border/40 rounded-[2.5rem] bg-card/20 backdrop-blur-sm">
                        <div className="text-5xl mb-4 opacity-50">📤</div>
                        <h3 className="text-2xl font-black text-foreground mb-2">Silence is over.</h3>
                        <p className="text-muted-foreground mb-8 text-lg font-medium">Your voice hasn't been heard yet. Ready to break the silence?</p>
                        <Button
                            onClick={() => navigate('/create')}
                            size="lg"
                            className="rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:scale-105 transition-all"
                        >
                            Share Your First Story
                        </Button>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingStory && (
                <EditStoryModal
                    isOpen={!!editingStory}
                    onClose={() => setEditingStory(null)}
                    story={editingStory}
                    onSuccess={handleUpdateSuccess}
                />
            )}

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                    await deletePostMutation.mutateAsync(storyToDelete);
                    toast.success('Story deleted successfully');
                    setIsDeleteModalOpen(false);
                }}
                title="Delete Story?"
                description="Are you sure you want to delete this story? This action cannot be undone."
                confirmText="Delete"
                variant="destructive"
            />
        </div>
    );
}
