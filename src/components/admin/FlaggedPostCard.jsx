import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Flag,
    Trash2,
    CheckCircle,
    Eye,
    AlertTriangle,
    ShieldAlert,
    User,
    MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function FlaggedPostCard({
    post,
    report,
    onApprove,
    onDelete,
    onDismiss,
    onNavigate
}) {
    const isReport = !!report;
    const content = isReport ? report.story : post;

    if (!content) return null;

    return (
        <Card className={cn(
            "p-6 transition-all duration-300 border bg-white dark:bg-[#343541]",
            isReport
                ? "border-orange-200 dark:border-orange-900/50 hover:border-orange-300 shadow-orange-500/5"
                : "border-amber-200 dark:border-amber-900/50 hover:border-amber-300 shadow-amber-500/5",
            "hover:shadow-xl"
        )}>
            <div className="flex flex-col gap-6">
                {/* Top Info Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        {isReport ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-orange-500/10 text-orange-600 dark:text-orange-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                User Reported
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                <ShieldAlert className="w-3.5 h-3.5" />
                                System Flagged
                            </div>
                        )}
                        <Badge variant="outline" className="text-[10px] dark:border-gray-700 uppercase tracking-tight">
                            {content.category || 'Legacy'}
                        </Badge>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] text-gray-500 font-medium uppercase tracking-widest">
                        <span className="flex items-center gap-1">
                            <User className="w-3 h-3" />
                            {content.profession || 'Anonymous'}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(content.createdAt).toLocaleDateString()}
                        </span>
                    </div>
                </div>

                {/* Content Section */}
                <div className="relative group">
                    <p className="text-gray-800 dark:text-gray-200 text-base leading-relaxed whitespace-pre-wrap">
                        {content.text}
                    </p>
                    {content.triggerWarnings?.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                            {content.triggerWarnings.map((tw, i) => (
                                <span key={i} className="text-[10px] px-2 py-0.5 bg-red-500/10 text-red-500 rounded font-bold">
                                    TW: {tw}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Report Context Card IF it exists */}
                {isReport && (
                    <div className="bg-orange-50/50 dark:bg-orange-950/20 rounded-xl p-4 border border-orange-100 dark:border-orange-900/30">
                        <div className="flex items-start gap-3">
                            <div className="mt-1">
                                <MessageCircle className="w-4 h-4 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-xs font-bold text-orange-900 dark:text-orange-300 uppercase">Report Reason</p>
                                <p className="text-sm text-orange-800 dark:text-orange-200 mt-1">{report.reason}</p>
                                <p className="text-[10px] text-orange-600/60 dark:text-orange-400/60 mt-2">
                                    Reporter: {report.reporter?.email || 'System'}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Footer Actions */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onNavigate(`/post/${content._id}`, { state: { fromAdmin: true } })}
                            className="text-gray-500 hover:text-primary hover:bg-primary/5"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Full Story
                        </Button>
                    </div>

                    <div className="flex items-center gap-2">
                        {isReport ? (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => onDismiss(report._id)}
                                    className="bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 border-none px-6"
                                >
                                    Dismiss Report
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onDelete(report._id, content._id)}
                                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-6 font-bold"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Post
                                </Button>
                            </>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    onClick={() => onApprove(content._id)}
                                    className="bg-green-600 hover:bg-green-700 text-white border-none px-6 font-bold"
                                >
                                    <CheckCircle className="w-4 h-4 mr-2" />
                                    Approve Content
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => onDelete(content._id)}
                                    className="border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 px-6 font-bold"
                                >
                                    <Trash2 className="w-4 h-4 mr-2" />
                                    Delete Story
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}

// Internal Local Helper for Icon
function Calendar({ className }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={className}
        >
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
            <line x1="16" x2="16" y1="2" y2="6" />
            <line x1="8" x2="8" y1="2" y2="6" />
            <line x1="3" x2="21" y1="10" y2="10" />
        </svg>
    );
}
