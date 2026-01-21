import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Share2 } from 'lucide-react';
import { postsAPI } from '@/services/api.service';
import { usePost, useVotePost } from '@/hooks/usePosts';
import { useComments, useCreateComment, useVoteComment, useDeleteComment } from '@/hooks/useComments';
import { CATEGORIES } from '@/utils/constants';
import PostView from '@/components/post/PostView';
import CommentSection from '@/components/post/CommentSection';
import PostScreenshotView from '@/components/post/PostScreenshotView';
import { PostSkeleton, CommentSkeleton } from '@/components/ui/skeleton';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fromAdmin = location.state?.fromAdmin;
    const { isAuthenticated, user } = useAuthStore();

    const { data: postRes, isLoading: isPostLoading } = usePost(id);
    const { data: commentsRes } = useComments(id);
    const voteMutation = useVotePost();
    const commentMutation = useCreateComment(id);
    const commentVoteMutation = useVoteComment(id);
    const deleteCommentMutation = useDeleteComment(id);

    const post = postRes?.data;
    const comments = commentsRes?.data?.comments || commentsRes?.data || [];

    const [newComment, setNewComment] = useState('');
    const [isBlurred, setIsBlurred] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [selectedLanguage, setSelectedLanguage] = useState('en');
    const [translations, setTranslations] = useState({});
    const [isTranslating, setIsTranslating] = useState(false);
    const [showLangMenu, setShowLangMenu] = useState(false);
    const [isShareMode, setIsShareMode] = useState(false);
    const langMenuRef = useRef(null);
    const buttonRef = useRef(null);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        if (post?.triggerWarnings?.length > 0) {
            setIsBlurred(true);
        }
    }, [post]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
                setShowLangMenu(false);
            }
        };

        if (showLangMenu) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showLangMenu]);

    // Update dropdown position when menu opens
    useEffect(() => {
        if (showLangMenu && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + window.scrollY + 8,
                left: rect.left + window.scrollX
            });
        }
    }, [showLangMenu]);

    if (isPostLoading) return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <PostSkeleton />
            <div className="mt-8 space-y-4">
                <CommentSkeleton />
                <CommentSkeleton />
            </div>
        </div>
    );
    if (!post) return <div className="text-center py-20 text-muted-foreground">Post not found</div>;

    const category = CATEGORIES.find(c => c.value === post.category);
    // Enrich post object for PostView
    const enrichedPost = {
        ...post,
        category_label: category?.label,
        category_emoji: category?.emoji,
        category_item: category
    };

    const handleVote = async (voteType) => {
        if (!isAuthenticated) {
            toast.error('Please login to vote');
            return;
        }
        voteMutation.mutate({ id: post._id, type: voteType });
    };

    const handleAddComment = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to comment');
            return;
        }
        if (!newComment.trim()) return;

        commentMutation.mutate(newComment, {
            onSuccess: () => setNewComment('')
        });
    };

    const getDisplayText = () => {
        if (selectedLanguage === 'original' && post.originalText) {
            return post.originalText;
        }
        if (selectedLanguage === 'en' || selectedLanguage === post.originalLanguage) {
            return post.text;
        }
        return translations[selectedLanguage] || post.text;
    };

    const displayText = getDisplayText();

    const handleLanguageChange = async (langCode) => {
        setSelectedLanguage(langCode);
        setShowLangMenu(false);

        if (langCode === 'original' || langCode === 'en' || langCode === post.originalLanguage) {
            return;
        }

        if (translations[langCode]) {
            return;
        }

        setIsTranslating(true);
        try {
            const sourceText = post.originalText || post.text;
            const result = await postsAPI.translateText(sourceText, langCode);
            setTranslations(prev => ({
                ...prev,
                [langCode]: result.data.translated
            }));
        } catch {
            toast.error('Translation failed');
            setSelectedLanguage('en');
        } finally {
            setIsTranslating(false);
        }
    };

    const handleCommentVote = async (commentId, voteType) => {
        if (!isAuthenticated) {
            toast.error('Please login to vote');
            return;
        }
        commentVoteMutation.mutate({ commentId, type: voteType });
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            deleteCommentMutation.mutate(commentId);
        }
    };

    if (isShareMode) {
        return (
            <PostScreenshotView
                post={enrichedPost}
                displayText={displayText}
                category={category}
                onBack={() => setIsShareMode(false)}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="flex items-center justify-between mb-6">
                <Button
                    variant="ghost"
                    onClick={() => navigate(fromAdmin ? '/admin' : '/feed')}
                    className="dark:text-gray-300 group"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    {fromAdmin ? 'Back to Dashboard' : 'Back to Feed'}
                </Button>

                <Button
                    variant="outline"
                    onClick={() => setIsShareMode(true)}
                    className="rounded-full border-primary/20 text-primary hover:bg-primary/5 font-bold px-5"
                >
                    <Share2 className="w-4 h-4 mr-2" />
                    Screenshot Mode
                </Button>
            </div>

            <PostView
                post={enrichedPost}
                isBlurred={isBlurred}
                onToggleBlur={() => setIsBlurred(false)}
                selectedLanguage={selectedLanguage}
                isTranslating={isTranslating}
                showLangMenu={showLangMenu}
                onLangMenuToggle={() => setShowLangMenu(!showLangMenu)}
                onLanguageChange={handleLanguageChange}
                onVote={handleVote}
                onShare={() => setShowShareModal(true)}
                onReport={() => setShowReportModal(true)}
                langMenuRef={langMenuRef}
                buttonRef={buttonRef}
                dropdownPosition={dropdownPosition}
                commentsCount={post.commentsCount || comments.length}
            />

            <CommentSection
                comments={comments}
                isAuthenticated={isAuthenticated}
                user={user}
                newComment={newComment}
                onCommentChange={setNewComment}
                onAddComment={handleAddComment}
                onVote={handleCommentVote}
                onDelete={handleDeleteComment}
            />

            {/* Modals are still lazily rendered here or we can put them in common if reused */}
            {/* For now keeping Modals in PostDetail as they depend on show/hide state here */}
            {/* But we should import them from their paths */}
            {/* They were already imported in the original file */}
            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                postId={post._id}
                profession={post.profession}
                country={post.country}
            />

            <ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)}
                postId={post._id}
            />
        </div>
    );
}

// Fixed missing imports in the block above before applying
import ShareModal from '@/components/post/ShareModal';
import ReportModal from '@/components/post/ReportModal';
