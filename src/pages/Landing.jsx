import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/authStore';
import { ThumbsUp, MessageCircle, Share2, Globe, Clock, ShieldCheck, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { settingsAPI } from '@/services/api.service';

const SamplePost = ({ story }) => (
    <div className="relative w-full max-w-xl mx-auto mt-16 group">
        {/* Glow behind the card */}
        <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-purple-500/30 rounded-[2.5rem] blur-2xl opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>

        <Card className="relative overflow-hidden border-border/40 bg-card/40 backdrop-blur-2xl shadow-2xl rounded-[2.2rem] p-8 transition-all duration-500 hover:translate-y-[-4px]">
            {/* Sample Label */}
            <div className="absolute top-0 right-0 px-6 py-2 bg-primary/10 border-l border-b border-primary/20 rounded-bl-[1.5rem] text-[10px] font-black uppercase tracking-widest text-primary">
                Sample Truth
            </div>

            <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center border-2 border-primary/20">
                    <ShieldCheck className="w-6 h-6 text-primary" />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-foreground">Anonymous</span>
                        <Badge className="bg-primary/10 text-primary border-0 text-[10px] h-5 px-2">
                            {story.category || '🤢 Toxic Work'}
                        </Badge>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <span>{story.profession || 'Senior Professional'}</span>
                        <span>•</span>
                        <span>{story.country || 'Global'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just now</span>
                    </div>
                </div>
            </div>

            <div className="space-y-4 mb-8">
                <p className="text-foreground/90 leading-relaxed text-lg font-medium tracking-tight">
                    "{story.text || "Loading the next workplace truth..."}"
                </p>
                <div className="flex items-center gap-2">
                    <div className="h-px flex-1 bg-gradient-to-r from-border/50 to-transparent"></div>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-orange-500 font-bold">
                        <ThumbsUp className="w-5 h-5 fill-current" />
                        <span>{story.upvotes || '1.1k'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <MessageCircle className="w-5 h-5" />
                        <span>{story.comments || '12'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Share2 className="w-5 h-5" />
                    </div>
                </div>
                <div className="flex items-center gap-1.5 text-blue-500 text-sm font-bold bg-blue-500/10 px-3 py-1 rounded-full">
                    <Globe className="w-4 h-4" />
                    <span>English</span>
                </div>
            </div>
        </Card>

        {/* Floating Decorative Elements */}
        <div className="absolute -top-6 -left-6 w-12 h-12 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute -bottom-8 -right-8 w-16 h-16 bg-purple-500/20 rounded-full blur-xl animate-pulse delay-700"></div>
    </div>
);

export default function Landing() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const [sampleStory, setSampleStory] = useState({
        text: "My manager just told me to 'cancel my wedding' because the Q4 release is more important. When I said no, they literally started crying in the Zoom call. I've been here 5 years and this is the thank you I get? Updating my resume as we speak.",
        profession: "Senior Lead Engineer",
        country: "United States",
        category: "🤢 Toxic Boss",
        upvotes: "1.2k",
        comments: "42"
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLandingContent = async () => {
            try {
                const res = await settingsAPI.getSetting('landing_sample_story');
                if (res.success && res.data) {
                    setSampleStory(res.data.value);
                }
            } catch (error) {
                console.error('Failed to fetch landing sample story', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLandingContent();
    }, []);

    const handleGetStarted = () => {
        if (isAuthenticated) {
            navigate('/feed');
        } else {
            navigate('/register');
        }
    };

    // Auto-redirect if already logged in
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/feed');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center text-center px-4 relative overflow-hidden">
            {/* Background Decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full -z-10 opacity-60"></div>

            <div className="max-w-4xl mx-auto space-y-8 animate-fade-in-up">
                <h1 className="text-5xl md:text-7xl font-black tracking-tight text-foreground drop-shadow-sm leading-tight">
                    Stories your job <br />
                    <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                        never wanted told.
                    </span>
                </h1>

                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
                    The anonymous platform for the darkest, funniest, and most heartbreaking stories from your professional life.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Button
                        size="lg"
                        onClick={handleGetStarted}
                        className="w-full sm:w-auto rounded-full px-8 h-14 text-lg font-bold shadow-xl shadow-primary/20 hover:shadow-primary/30 transition-all hover:scale-105"
                    >
                        Share Your Story
                    </Button>
                    <Button
                        variant="outline"
                        size="lg"
                        onClick={() => navigate('/feed')}
                        className="w-full sm:w-auto rounded-full px-8 h-14 text-lg font-semibold bg-background/50 backdrop-blur-sm border-2 border-border/50 hover:bg-background/80"
                    >
                        Browse Anonymous Stories
                    </Button>
                </div>

                {isLoading ? (
                    <div className="mt-16 flex items-center justify-center min-h-[300px]">
                        <Loader2 className="w-8 h-8 animate-spin text-primary/50" />
                    </div>
                ) : (
                    <SamplePost story={sampleStory} />
                )}

                <div className="pt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-left max-w-4xl mx-auto">
                    <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40 hover:bg-card/60 transition-colors">
                        <div className="text-3xl mb-3">👻</div>
                        <h3 className="font-bold text-lg mb-2">Anonymous</h3>
                        <p className="text-muted-foreground text-sm">Speak freely without fear. Your identity is protected.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40 hover:bg-card/60 transition-colors">
                        <div className="text-3xl mb-3">🔥</div>
                        <h3 className="font-bold text-lg mb-2">Unfiltered</h3>
                        <p className="text-muted-foreground text-sm">Real stories from real workplaces. No HR involvement.</p>
                    </div>
                    <div className="p-6 rounded-2xl bg-card/40 backdrop-blur-sm border border-border/40 hover:bg-card/60 transition-colors">
                        <div className="text-3xl mb-3">🌍</div>
                        <h3 className="font-bold text-lg mb-2">Global</h3>
                        <p className="text-muted-foreground text-sm">Connect with professionals worldwide who just "get it".</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
