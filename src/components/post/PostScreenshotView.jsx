import { ArrowLeft, Globe } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function PostScreenshotView({ post, displayText, category, onBack }) {
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

                        {/* Tags */}
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

                {/* Back Button */}
                <div className="mt-8 flex justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={onBack}
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
