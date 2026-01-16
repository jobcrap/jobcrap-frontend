import { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ThumbsUp, ThumbsDown, MessageCircle, Share2, AlertTriangle, Send, Globe, Flag } from 'lucide-react';
import { postsAPI } from '@/services/api.service';
import { usePost, useVotePost } from '@/hooks/usePosts';
import { useComments, useCreateComment, useVoteComment } from '@/hooks/useComments';
import { CATEGORIES } from '@/utils/constants';
import { formatDate } from '@/utils/validation';
import ShareModal from '@/components/post/ShareModal';
import ReportModal from '@/components/post/ReportModal';
import { PostSkeleton, CommentSkeleton } from '@/components/ui/skeleton';
import { SUPPORTED_LANGUAGES } from '@/utils/languages';

export default function PostDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const fromAdmin = location.state?.fromAdmin;
    const { isAuthenticated } = useAuthStore();

    const { data: postRes, isLoading: isPostLoading } = usePost(id);
    const { data: commentsRes } = useComments(id);
    const voteMutation = useVotePost();
    const commentMutation = useCreateComment(id);
    const commentVoteMutation = useVoteComment(id);

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

    const isMultiLanguage = post.originalLanguage && post.originalLanguage !== 'en';

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

    if (isShareMode) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4 sm:p-8 animate-fade-in">
                <div className="max-w-2xl w-full">
                    <Card className="overflow-hidden border-2 border-primary/20 bg-card shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] rounded-[2.5rem] p-10 relative">
                        {/* Branding Header */}
                        <div className="flex items-center justify-between mb-10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                                    <Globe className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight text-foreground leading-none">JobCrap</h3>
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em] mt-1">Workplace Truths</p>
                                </div>
                            </div>
                            <Badge variant="outline" className="border-primary/20 text-primary font-bold px-4 py-1 rounded-full">
                                {category?.emoji} {category?.label}
                            </Badge>
                        </div>

                        {/* Post Content */}
                        <div className="space-y-6 mb-10">
                            <p className="text-2xl sm:text-3xl font-bold leading-snug tracking-tight text-foreground/90 whitespace-pre-wrap">
                                {displayText}
                            </p>

                            {/* Tags in Share Mode */}
                            {post.tags && post.tags.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-2">
                                    {post.tags.map((tag) => (
                                        <Badge
                                            key={tag}
                                            variant="secondary"
                                            className="bg-primary/5 text-primary dark:bg-primary/20 dark:text-white border-transparent text-[10px] font-bold px-3 py-1 rounded-full"
                                        >
                                            #{tag}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* Metadata Footer */}
                            <div className="flex items-center gap-4 pt-8 border-t border-border/40">
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-foreground">{post.profession}</span>
                                    <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{post.country}</span>
                                </div>
                                <div className="h-8 w-px bg-border/40" />
                                <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                    Verified Anonymous Story
                                </div>
                            </div>
                        </div>

                        {/* URL Badge */}
                        <div className="absolute bottom-6 right-10 flex items-center gap-2 opacity-50">
                            <span className="text-[10px] font-black uppercase tracking-widest">jobcrap.com/post/{post.shareId || post._id.substring(0, 8)}</span>
                        </div>
                    </Card>

                    {/* Share Mode Controls - Hidden in actual screenshot usually, but here for the user */}
                    <div className="mt-8 flex justify-center gap-4">
                        <Button
                            variant="outline"
                            onClick={() => setIsShareMode(false)}
                            className="rounded-full px-8 border-border/40 hover:bg-background/80"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Post
                        </Button>
                        <Button
                            onClick={() => window.print()}
                            className="rounded-full px-8 bg-primary hover:bg-primary/90 text-white font-bold"
                        >
                            Save / Print View
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
            {/* Back Button */}
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

            {/* Post Card - Same UI as PostCard */}
            <Card className="overflow-visible border-border/40 bg-card/60 backdrop-blur-md shadow-2xl rounded-3xl">
                <div className="p-4 sm:p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                                {category?.emoji} {category?.label}
                            </Badge>
                            <span className="text-sm font-bold text-foreground">
                                {post.isAnonymous ? 'Anonymous' : (post.author?.username || 'Member')}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                                {post.profession}
                            </span>
                            <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">{post.country}</span>
                        </div>
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            {formatDate(post.createdAt)}
                        </span>
                    </div>

                    {/* Trigger Warning */}
                    {isBlurred && (
                        <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="flex-1">
                                    <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">Content Warning</p>
                                    <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 mb-3">
                                        This story contains: {post.triggerWarnings.join(', ')}
                                    </p>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setIsBlurred(false)}
                                        className="border-amber-300 dark:border-amber-700 hover:bg-amber-100 dark:hover:bg-amber-900 dark:text-amber-200 dark:bg-amber-950"
                                    >
                                        Show Content
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Post Content */}
                    <div className={`mb-6 relative ${isBlurred ? 'blur-md select-none pointer-events-none' : ''}`}>
                        {selectedLanguage === 'original' && post.originalText ? (
                            <div className="space-y-6">
                                {/* Original Text */}
                                <div className="relative pl-4 border-l-2 border-primary/30">
                                    <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block tracking-tight">Original Perspective</span>
                                    <p className="text-foreground/90 leading-relaxed text-base font-medium whitespace-pre-wrap">
                                        {post.originalText}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <p className="text-foreground/90 dark:text-gray-200 leading-relaxed text-base tracking-tight whitespace-pre-wrap">
                                {post.text}
                            </p>
                        )}
                    </div>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    className="bg-primary/5 text-primary dark:bg-primary/20 dark:text-white border-transparent text-xs font-bold px-3 py-1 rounded-full"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    {/* Language Selector */}
                    <div className="mb-4 relative">
                        <div className="flex items-center gap-2" ref={buttonRef}>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowLangMenu(!showLangMenu)}
                                disabled={isTranslating}
                                className="h-8 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 gap-1.5 px-3 rounded-full"
                            >
                                <Globe className="w-3.5 h-3.5" />
                                {isTranslating ? 'Translating...' : (selectedLanguage === 'original' ? 'Original' : (SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'))}
                            </Button>

                            {isMultiLanguage && selectedLanguage !== 'original' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLanguageChange('original')}
                                    className="h-8 text-xs px-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                >
                                    View Original
                                </Button>
                            )}

                            {selectedLanguage === 'original' && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleLanguageChange('en')}
                                    className="h-8 text-xs px-3 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                                >
                                    View Translation
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Language Dropdown Portal */}
                    {showLangMenu && createPortal(
                        <div
                            ref={langMenuRef}
                            className="absolute bg-white dark:bg-gray-900 border-2 border-primary/30 rounded-xl shadow-2xl z-[99999] min-w-[220px] max-h-[420px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/30 scrollbar-track-transparent backdrop-blur-xl"
                            style={{
                                top: `${dropdownPosition.top}px`,
                                left: `${dropdownPosition.left}px`
                            }}
                        >
                            {SUPPORTED_LANGUAGES.filter(l => l.code !== 'original').map((lang) => (
                                <button
                                    key={lang.code}
                                    onClick={() => handleLanguageChange(lang.code)}
                                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors flex items-center gap-2 ${selectedLanguage === lang.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground'
                                        }`}
                                >
                                    <span className="text-base">{lang.flag}</span>
                                    <span>{lang.name}</span>
                                </button>
                            ))}
                        </div>,
                        document.body
                    )}

                    {/* Actions Bar - Left Aligned */}
                    <div className="flex items-center justify-start gap-1 pt-3 border-t border-gray-100 dark:border-gray-800">
                        {/* Upvote */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote('upvote')}
                            className={`flex items-center gap-1 h-9 px-3 transition-colors ${post.userVote === 'upvote'
                                ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950'
                                }`}
                        >
                            <ThumbsUp className={`w-5 h-5 ${post.userVote === 'upvote' ? 'fill-current' : ''}`} />
                        </Button>

                        {/* Upvote Count */}
                        <span className={`text-sm font-bold ${post.userVote === 'upvote' ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {post.upvotes || 0}
                        </span>

                        {/* Downvote */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleVote('downvote')}
                            className={`flex items-center gap-1 h-9 px-3 transition-colors ${post.userVote === 'downvote'
                                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950'
                                }`}
                        >
                            <ThumbsDown className={`w-5 h-5 ${post.userVote === 'downvote' ? 'fill-current' : ''}`} />
                        </Button>

                        {/* Downvote Count */}
                        <span className={`text-sm font-bold ${post.userVote === 'downvote' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {post.downvotes || 0}
                        </span>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                        {/* Comments */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="flex items-center gap-1.5 h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            onClick={() => document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' })}
                        >
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{post.commentsCount || comments.length}</span>
                        </Button>

                        {/* Share */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowShareModal(true)}
                            className="flex items-center gap-1.5 h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm font-medium hidden sm:inline">Share</span>
                        </Button>

                        {/* Report */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowReportModal(true)}
                            className="flex items-center gap-1.5 h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                            <Flag className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </Card >

            {/* Comments Section */}
            < div className="mt-8" id="comments-section" >
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                    Comments ({comments.length})
                </h2>

                {/* Add Comment */}
                {
                    isAuthenticated ? (
                        <Card className="p-6 mb-6 shadow-md border-gray-200 dark:border-gray-800 dark:bg-gray-900">
                            <Textarea
                                placeholder="Share your thoughts..."
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                rows={3}
                                className="mb-3 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <Button
                                onClick={handleAddComment}
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
                    )
                }

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length > 0 ? (
                        comments.map(comment => {

                            return (
                                <Card key={comment._id} className="p-5 shadow-sm border-border/40 bg-card/40 hover:bg-card transition-colors rounded-2xl">
                                    <div className="flex items-start gap-4">
                                        <div className="flex flex-col items-center gap-1 mr-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCommentVote(comment._id, 'upvote')}
                                                className={`h-6 w-6 p-0 hover:bg-transparent ${comment.userVote === 'upvote'
                                                    ? 'text-orange-600 dark:text-orange-400'
                                                    : 'text-gray-400 hover:text-orange-500'
                                                    }`}
                                            >
                                                <ThumbsUp className={`w-5 h-5 ${comment.userVote === 'upvote' ? 'fill-current' : ''}`} />
                                            </Button>

                                            <span className={`text-xs font-bold ${comment.userVote === 'upvote' ? 'text-orange-500' : 'text-gray-500'}`}>
                                                {comment.upvotes || 0}
                                            </span>

                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleCommentVote(comment._id, 'downvote')}
                                                className={`h-6 w-6 p-0 hover:bg-transparent ${comment.userVote === 'downvote'
                                                    ? 'text-blue-600 dark:text-blue-400'
                                                    : 'text-gray-400 hover:text-blue-500'
                                                    }`}
                                            >
                                                <ThumbsDown className={`w-5 h-5 ${comment.userVote === 'downvote' ? 'fill-current' : ''}`} />
                                            </Button>

                                            <span className={`text-sm font-bold ${comment.userVote === 'downvote' ? 'text-blue-500' : 'text-gray-500'}`}>
                                                {comment.downvotes || 0}
                                            </span>
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <img
                                                    src={comment.author?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                                    alt={comment.author?.username}
                                                    className="w-6 h-6 rounded-full object-cover border border-gray-100 dark:border-gray-800"
                                                />
                                                <span className="font-semibold text-sm text-gray-900 dark:text-white">
                                                    {comment.author?.username || 'Anonymous'}
                                                </span>
                                                <span className="text-sm text-gray-400 dark:text-gray-500">•</span>
                                                <span className="text-xs text-gray-500 dark:text-gray-400">
                                                    {formatDate(comment.createdAt)}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
                                                {comment.text}
                                            </p>
                                        </div>
                                    </div>
                                </Card>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                            No comments yet. Be the first to share your thoughts!
                        </div>
                    )}
                </div>
            </div >

            {/* Report Modal */}
            < ReportModal
                isOpen={showReportModal}
                onClose={() => setShowReportModal(false)
                }
                postId={post._id}
            />

            {/* Share Modal */}
            < ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                postId={post._id}
                profession={post.profession}
                country={post.country}
            />
        </div >
    );
}
