import { createPortal } from 'react-dom';
import { useState, useRef, useEffect } from 'react';
import { ThumbsUp, ThumbsDown, MessageCircle, Share2, Flag, AlertTriangle, Globe, Ban, MoreVertical } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/validation';
import { SUPPORTED_LANGUAGES } from '@/utils/languages';
import { countries } from 'countries-list';

export default function PostView({
    post,
    isBlurred,
    onToggleBlur,
    selectedLanguage,
    isTranslating,
    showLangMenu,
    onLangMenuToggle,
    onLanguageChange,
    onVote,
    onShare,
    onReport,
    langMenuRef,
    buttonRef,
    dropdownPosition,
    commentsCount,
    onBlock,
    isAuthenticated,
    currentUserId
}) {
    return (
        <Card className="overflow-visible border-border/40 bg-card/60 backdrop-blur-md shadow-2xl rounded-3xl">
            <div className="p-4 sm:p-5">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
                            {post.category_label || post.category}
                        </Badge>
                        <span className="text-sm font-bold text-foreground">
                            {post.isAnonymous ? 'Anonymous' : (post.author?.username || 'Member')}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {post.profession}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-gray-600">•</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {Object.values(countries).find(c => c.name === post.country)?.name || post.country}
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                            {formatDate(post.createdAt)}
                        </span>
                        {/* 3-Dot Menu - Top Right */}
                        <PostViewMoreMenu
                            onReport={onReport}
                            onBlock={onBlock}
                            isAuthenticated={isAuthenticated}
                            currentUserId={currentUserId}
                            post={post}
                        />
                    </div>
                </div>

                {/* Trigger Warning */}
                {isBlurred && (
                    <div className="bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                                <p className="font-semibold text-amber-900 dark:text-amber-200 text-sm">Content Warning</p>
                                <p className="text-xs text-amber-700 dark:text-amber-300 mt-1 mb-3">
                                    This story contains: {post.triggerWarnings?.join(', ')}
                                </p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={onToggleBlur}
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
                            onClick={onLangMenuToggle}
                            disabled={isTranslating}
                            className="h-8 text-xs bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-900/50 gap-1.5 px-3 rounded-full"
                        >
                            <Globe className="w-3.5 h-3.5" />
                            {isTranslating ? 'Translating...' : (selectedLanguage === 'original' ? 'Original' : (SUPPORTED_LANGUAGES.find(l => l.code === selectedLanguage)?.name || 'English'))}
                        </Button>

                        {post.originalLanguage && post.originalLanguage !== 'en' && (
                            <>
                                {selectedLanguage !== 'original' && (
                                    <Button variant="ghost" size="sm" onClick={() => onLanguageChange('original')} className="h-8 text-xs px-3 rounded-full text-muted-foreground">View Original</Button>
                                )}
                                {selectedLanguage === 'original' && (
                                    <Button variant="ghost" size="sm" onClick={() => onLanguageChange('en')} className="h-8 text-xs px-3 rounded-full text-muted-foreground">View Translation</Button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {/* Language Dropdown Portal */}
                {showLangMenu && createPortal(
                    <div
                        ref={langMenuRef}
                        className="absolute bg-white dark:bg-gray-900 border-2 border-primary/30 rounded-xl shadow-2xl z-[99999] min-w-[220px] max-h-[420px] overflow-y-auto backdrop-blur-xl"
                        style={{
                            top: `${dropdownPosition.top}px`,
                            left: `${dropdownPosition.left}px`
                        }}
                    >
                        {SUPPORTED_LANGUAGES.filter(l => l.code !== 'original').map((lang) => (
                            <button
                                key={lang.code}
                                onClick={() => onLanguageChange(lang.code)}
                                className={`w-full text-left px-4 py-2.5 text-sm hover:bg-primary/5 transition-colors flex items-center gap-2 ${selectedLanguage === lang.code ? 'bg-primary/10 text-primary font-bold' : 'text-foreground'}`}
                            >
                                <span className="text-base">{lang.flag}</span>
                                <span>{lang.name}</span>
                            </button>
                        ))}
                    </div>,
                    document.body
                )}

                {/* Actions Bar */}
                <div className="flex items-center justify-start gap-1 pt-3 border-t border-gray-100 dark:border-gray-800">
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVote('upvote')}
                        className={`flex items-center gap-1 h-9 px-3 ${post.userVote === 'upvote' ? 'text-orange-600 bg-orange-100 dark:bg-orange-900/40' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                        <ThumbsUp className={`w-5 h-5 ${post.userVote === 'upvote' ? 'fill-current' : ''}`} />
                    </Button>
                    <span className={`text-sm font-bold ${post.userVote === 'upvote' ? 'text-orange-500' : 'text-gray-600'}`}>{post.upvotes || 0}</span>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onVote('downvote')}
                        className={`flex items-center gap-1 h-9 px-3 ${post.userVote === 'downvote' ? 'text-blue-600 bg-blue-100 dark:bg-blue-900/40' : 'text-gray-600 dark:text-gray-400'}`}
                    >
                        <ThumbsDown className={`w-5 h-5 ${post.userVote === 'downvote' ? 'fill-current' : ''}`} />
                    </Button>
                    <span className={`text-sm font-bold ${post.userVote === 'downvote' ? 'text-blue-500' : 'text-gray-600'}`}>{post.downvotes || 0}</span>

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700 mx-2" />

                    <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1.5 h-9 px-3 text-gray-600 dark:text-gray-400"
                        onClick={() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth' })}
                    >
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm font-medium">{commentsCount}</span>
                    </Button>

                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onShare}
                        className="flex items-center gap-1.5 h-9 px-3 text-gray-600 dark:text-gray-400"
                    >
                        <Share2 className="w-4 h-4" />
                        <span className="text-sm font-medium hidden sm:inline">Share</span>
                    </Button>
                </div>
            </div>
        </Card>
    );
}

// Internal 3-dot menu component for PostView
function PostViewMoreMenu({ onReport, onBlock, isAuthenticated, currentUserId, post }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        if (open) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [open]);

    return (
        <div className="relative" ref={ref}>
            <Button
                variant="ghost"
                size="sm"
                onClick={() => setOpen(!open)}
                className="flex items-center h-8 w-8 p-0 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            >
                <MoreVertical className="w-5 h-5" />
            </Button>

            {open && (
                <div className="absolute right-0 top-full mt-1 bg-white dark:bg-gray-900 border border-border/60 rounded-xl shadow-xl z-50 min-w-[200px] overflow-hidden">
                    <button
                        onClick={() => { setOpen(false); onReport(); }}
                        className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-2.5 text-gray-700 dark:text-gray-300"
                    >
                        <Flag className="w-4 h-4 text-orange-500" />
                        Report Post
                    </button>
                    {isAuthenticated && !post.isAnonymous && currentUserId !== post.author?._id && (
                        <button
                            onClick={() => { setOpen(false); onBlock(); }}
                            className="w-full text-left px-4 py-2.5 text-sm hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-2.5 text-red-600 dark:text-red-400"
                        >
                            <Ban className="w-4 h-4" />
                            Block {post.author?.username}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
