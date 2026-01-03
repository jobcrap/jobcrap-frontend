import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Trash2,
    Eye,
    MessageCircle,
    ThumbsUp,
    ThumbsDown,
    User,
    Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function AdminStoryCard({ post, onDelete, onNavigate }) {
    if (!post) return null;

    const netVotes = (post.upvotes || 0) - (post.downvotes || 0);

    return (
        <Card className="group overflow-hidden bg-white dark:bg-[#343541] border border-gray-200 dark:border-gray-800 hover:border-primary/30 dark:hover:border-primary/50 transition-all duration-300 shadow-sm hover:shadow-md">
            <div className="p-5 flex flex-col h-full">
                {/* Header Info */}
                <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex flex-wrap items-center gap-2">
                        <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary dark:bg-primary/20 dark:text-blue-400 border-none text-[10px] py-0 px-2 uppercase tracking-wider font-bold"
                        >
                            {post.category}
                        </Badge>
                        <span className="text-[10px] font-medium text-gray-500 uppercase tracking-widest flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {post.profession}
                        </span>
                    </div>
                    <span className="text-[10px] text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>

                {/* Content */}
                <div className="flex-1 mb-6">
                    <p className="text-gray-800 dark:text-gray-200 text-sm leading-relaxed line-clamp-4 group-hover:line-clamp-none transition-all duration-300">
                        {post.text}
                    </p>
                </div>

                {/* Footer Metrics & Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800 mt-auto">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-gray-500">
                            <div className={cn(
                                "flex items-center gap-1 px-1.5 py-0.5 rounded-md",
                                netVotes > 0 ? "text-green-600 bg-green-500/10" : netVotes < 0 ? "text-red-600 bg-red-500/10" : "text-gray-500"
                            )}>
                                {netVotes > 0 ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                                <span className="text-xs font-bold tabular-nums">{Math.abs(netVotes)}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors cursor-default">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-xs font-medium">{post.commentsCount || 0}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onNavigate(`/post/${post._id}`, { state: { fromAdmin: true } })}
                            className="h-8 px-3 text-xs hover:bg-primary/5 hover:text-primary"
                        >
                            <Eye className="w-3.5 h-3.5 mr-1.5" />
                            Open
                        </Button>
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onDelete('delete', post)}
                            className="h-8 w-8 p-0 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10"
                        >
                            <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                    </div>
                </div>
            </div>
        </Card>
    );
}

function CalendarIcon({ className }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" /></svg>
    );
}
