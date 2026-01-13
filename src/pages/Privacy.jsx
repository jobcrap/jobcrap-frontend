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
    const defaultContent = `Jobcrap ("we", "our", "us") respects your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our website and services.

1. Information We Collect
We may collect the following information:
- Email address (if you register)
- Content you post (stories, comments)
- Technical data (IP address, browser type, device, logs)
- Cookies and usage data

2. How We Use Your Information
We use your data to:
- Provide and maintain the service
- Improve the platform
- Prevent abuse and illegal activities
- Maintain security and stability
- Comply with legal obligations

3. Anonymity
Posts can be made anonymously. Even if a post is anonymous, we may still store internal technical data for moderation, security, and legal compliance.

4. Cookies
We use cookies to ensure basic functionality and improve user experience.

5. Data Sharing
We do not sell your personal data.
We only share data if:
- Required by law
- Necessary to protect the platform or users
- Necessary to operate the service (hosting, security, etc.)

6. Data Storage
Your data is stored securely. We take reasonable technical and organizational measures to protect it, but no system is 100% secure.

7. Your Rights
You have the right to:
- Request access to your data
- Request deletion of your data
- Request correction of your data

8. Account Deletion
You can request deletion of your account and associated data.

9. Changes to This Policy
We may update this Privacy Policy. Continued use of the platform means you accept the changes.

10. Contact
contact@jobcrap.de`;

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
                            Active Policy • January 2026
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
                            <div key={idx} className="mb-8">
                                {paragraph.split('\n').map((line, lIdx) => (
                                    <p key={lIdx} className="text-foreground/80 leading-relaxed font-medium text-lg whitespace-pre-wrap mb-1">
                                        {line}
                                    </p>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </Card>

            <div className="mt-12 text-center">
                <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
                    Questions? Reach out to <a href="mailto:contact@jobcrap.de" className="text-primary font-black hover:underline underline-offset-4">contact@jobcrap.de</a>
                </p>
            </div>
        </div>
    );
}
