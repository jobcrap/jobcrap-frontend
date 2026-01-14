import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, AlertTriangle, Globe, Flag } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { CATEGORIES } from '@/utils/constants';
import { formatDate } from '@/utils/validation';
import { postsAPI } from '@/services/api.service';
import { usePostsStore } from '@/store/postsStore';
import ReportModal from './ReportModal';
import ShareModal from './ShareModal';

export default function PostCard({ post, onVote, showFullText = false }) {
    const [isBlurred, setIsBlurred] = useState(post.triggerWarnings?.length > 0);
    const [selectedLanguage, setSelectedLanguage] = useState(post.originalLanguage || 'en');
    const [translations, setTranslations] = useState(post.translations || {});
    const [showReportModal, setShowReportModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { setTag } = usePostsStore();

    const category = CATEGORIES.find(c => c.value === post.category);


    const displayText = translations[selectedLanguage] || post.text;
    const isTranslated = selectedLanguage !== post.originalLanguage;

    return (
        <Card className="group overflow-hidden border-border/40 bg-card/60 backdrop-blur-md hover:bg-card hover:border-primary/20 shadow-sm hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 rounded-3xl">
            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <img
                                src={post.isAnonymous ? 'https://cdn-icons-png.flaticon.com/512/149/149071.png' : (post.author?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png')}
                                alt={post.isAnonymous ? 'Anonymous' : post.author?.username}
                                className="w-10 h-10 rounded-full object-cover border-2 border-background shadow-sm"
                            />
                            {!post.isAnonymous && <div className="absolute -bottom-1 -right-1 bg-green-500 w-3 h-3 rounded-full border-2 border-background"></div>}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className={cn(
                                    "text-sm font-bold text-foreground transition-colors",
                                    !post.isAnonymous && "hover:text-primary cursor-pointer"
                                )}>
                                    {post.isAnonymous ? 'Anonymous' : (post.author?.username || 'Member')}
                                </span>
                                <Badge variant="secondary" className="text-[10px] px-1.5 h-5 font-medium border-transparent bg-secondary hover:bg-secondary/80">
                                    {category?.emoji} {category?.label}
                                </Badge>
                            </div>
                            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                                <span className="font-medium text-foreground/80">{post.profession}</span>
                                <span>•</span>
                                <span>{post.country}</span>
                                <span>•</span>
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Trigger Warning */}
                {isBlurred && (
                    <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-5 backdrop-blur-sm">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-destructive text-sm">Content Warning</p>
                                <p className="text-xs text-destructive/80 mt-1 mb-3">
                                    This story contains: {post.triggerWarnings.join(', ')}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => setIsBlurred(false)}
                                    className="border-destructive/30 hover:bg-destructive/10 text-destructive hover:text-destructive h-8 text-xs"
                                >
                                    Show Content
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Post Content */}
                <div className={`mb-6 relative ${isBlurred ? 'blur-md select-none pointer-events-none opacity-50' : ''}`}>
                    {isTranslated ? (
                        <div className="space-y-6">
                            {/* Original Text */}
                            <div className="relative pl-4 border-l-2 border-muted">
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2 block">Original Context</span>
                                <p className="text-foreground/60 leading-relaxed text-[14px] italic">
                                    {showFullText || isExpanded ? post.text : post.text.substring(0, 200) + (post.text.length > 200 ? '...' : '')}
                                </p>
                            </div>

                            {/* Translated Text */}
                            <div className="relative pl-4 border-l-2 border-primary/30">
                                <span className="text-[10px] font-bold text-primary uppercase tracking-widest mb-2 block tracking-tight">English Translation</span>
                                <p className="text-foreground/90 leading-relaxed text-[16px] font-medium">
                                    {showFullText || isExpanded ? displayText : displayText.substring(0, 280) + (displayText.length > 280 ? '...' : '')}
                                </p>
                            </div>
                        </div>
                    ) : (
                        <p className="text-foreground/90 leading-relaxed text-[16px] whitespace-pre-wrap font-normal tracking-tight mb-4">
                            {showFullText || isExpanded ? displayText : displayText.substring(0, 280) + (displayText.length > 280 ? '...' : '')}
                        </p>
                    )}

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                                <Badge
                                    key={tag}
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setTag(tag);
                                    }}
                                    className="cursor-pointer bg-primary/5 hover:bg-primary/10 text-primary dark:bg-primary/20 dark:text-white border-transparent text-[11px] font-bold px-2.5 py-0.5 rounded-full transition-all"
                                >
                                    #{tag}
                                </Badge>
                            ))}
                        </div>
                    )}
                    {/* Read More / Less Toggle */}
                    {!showFullText && displayText.length > 280 && (
                        <div className={`mt-2 ${!isExpanded ? 'absolute bottom-0 left-0 w-full h-12 bg-gradient-to-t from-card to-transparent pointer-events-none' : ''}`}>
                            {/* Placeholder for layout */}
                        </div>
                    )}
                </div>

                {!showFullText && displayText.length > 280 && (
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            setIsExpanded(!isExpanded);
                        }}
                        className="text-primary hover:text-primary/80 font-medium text-sm mb-4 flex items-center gap-1 transition-colors focus:outline-none"
                    >
                        {isExpanded ? 'Show less' : 'Continue reading'}
                    </button>
                )}

                {/* Translation UI */}
                {post.originalLanguage && post.originalLanguage !== 'en' && (
                    <div className="mb-5">
                        <Button
                            variant="secondary"
                            size="sm"
                            onClick={async () => {
                                if (isTranslated) {
                                    setSelectedLanguage(post.originalLanguage);
                                } else {
                                    if (translations.en) {
                                        setSelectedLanguage('en');
                                    } else {
                                        try {
                                            const result = await postsAPI.translateText(post.text, 'en');
                                            setTranslations(prev => ({
                                                ...prev,
                                                en: result.data.translated
                                            }));
                                            setSelectedLanguage('en');
                                        } catch (err) {
                                            toast.error('Translation failed');
                                        }
                                    }
                                }
                            }}
                            className="h-7 text-xs gap-1.5 px-3 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40 border border-blue-100 dark:border-blue-800"
                        >
                            <Globe className="w-3 h-3" />
                            {isTranslated ? 'Show Original' : 'Translate to English'}
                        </Button>
                    </div>
                )}

                {/* Actions Bar */}
                <div className="flex items-center justify-between pt-4 border-t border-border/40">
                    <div className="flex items-center gap-1">
                        {/* Upvote */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVote?.(post._id, 'upvote')}
                            className={`flex items-center gap-1 h-9 px-3 transition-colors ${post.userVote === 'upvote'
                                ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/40 dark:text-orange-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-orange-500 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950'
                                }`}
                        >
                            <ThumbsUp className={`w-4 h-4 ${post.userVote === 'upvote' ? 'fill-current' : ''}`} />
                        </Button>

                        {/* Upvote Count */}
                        <span className={`text-sm font-bold ${post.userVote === 'upvote' ? 'text-orange-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {post.upvotes || 0}
                        </span>

                        {/* Downvote */}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onVote?.(post._id, 'downvote')}
                            className={`flex items-center gap-1 h-9 px-3 transition-colors ${post.userVote === 'downvote'
                                ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/40 dark:text-blue-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950'
                                }`}
                        >
                            <ThumbsDown className={`w-4 h-4 ${post.userVote === 'downvote' ? 'fill-current' : ''}`} />
                        </Button>

                        {/* Downvote Count */}
                        <span className={`text-sm font-bold ${post.userVote === 'downvote' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'}`}>
                            {post.downvotes || 0}
                        </span>

                        {/* Divider */}
                        <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                        {/* Comments */}
                        <Link to={`/post/${post._id}`}>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="flex items-center gap-1.5 h-9 px-3 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                            >
                                <MessageCircle className="w-4 h-4" />
                                <span className="text-sm font-medium">{post.commentCount || 0}</span>
                            </Button>
                        </Link>

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

                {/* Report Modal */}
                <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    postId={post._id}
                />

                {/* Share Modal */}
                <ShareModal
                    isOpen={showShareModal}
                    onClose={() => setShowShareModal(false)}
                    postId={post._id}
                    profession={post.profession}
                    country={post.country}
                />
            </div>
        </Card>
    );
}
