import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Loader2 } from 'lucide-react';
import { settingsAPI } from '@/services/api.service';

export default function Privacy() {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPrivacy = async () => {
            try {
                const res = await settingsAPI.getSetting('privacy_policy');
                if (res.success && res.data) {
                    setContent(res.data.value);
                }
            } catch (error) {
                console.error('Failed to fetch privacy policy', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPrivacy();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Safeguarding your privacy...</p>
            </div>
        );
    }

    // Default Fallback content if DB is empty
    const defaultContent = `WorkStories ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.

Information We Collect:
Account Information: Email address, password (encrypted), and profile preferences.
Content You Create: Stories, comments, votes, and job/profession/country data.
Usage Data: IP address, browser type, device info, and interaction data.

How We Use Your Information:
- Provide and maintain our services
- Personalize your experience
- Detect and prevent technical issues
- Enforce our Terms of Service

Data Sharing:
We do not sell your personal information. We may share information only with your consent, to comply with legal obligations, or with trusted service providers.

Your Rights (GDPR):
You have rights to access, rectification, erasure, portability, and objection regarding your personal data. You can delete your account from your Profile settings.

Data Security:
We use industry-standard encryption and security audits to protect your data.`;

    const displayContent = content || defaultContent;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="p-4 rounded-[2rem] bg-primary/10 border-2 border-primary/20 shadow-inner group transition-transform hover:scale-110">
                        <Shield className="w-12 h-12 text-primary group-hover:animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                            Privacy <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent underline decoration-primary/20">Manifesto</span>
                        </h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                            Active Policy • December 2024
                        </p>
                    </div>
                </div>
            </div>

            <Card className="p-10 md:p-16 border-border/40 bg-card/40 backdrop-blur-2xl shadow-3xl rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Shield className="w-64 h-64 -mr-20 -mt-20 transform rotate-12" />
                </div>

                <div className="relative z-10">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        {displayContent.split('\n\n').map((paragraph, idx) => (
                            <p key={idx} className="text-foreground/80 leading-relaxed mb-8 font-medium text-lg whitespace-pre-wrap">
                                {paragraph}
                            </p>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="mt-12 text-center">
                <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
                    Questions? Reach out to <a href="mailto:privacy@workstories.com" className="text-primary font-black hover:underline underline-offset-4">privacy@workstories.com</a>
                </p>
            </div>
        </div>
    );
}
