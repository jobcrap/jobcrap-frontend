import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Info, Loader2 } from 'lucide-react';
import { settingsAPI } from '@/services/api.service';

export default function Impressum() {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchImpressum = async () => {
            try {
                const res = await settingsAPI.getSetting('impressum');
                if (res.success && res.data) {
                    setContent(res.data.value);
                }
            } catch (error) {
                console.error('Failed to fetch impressum', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchImpressum();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading legal information...</p>
            </div>
        );
    }

    // Default Fallback content
    const defaultContent = `Impressum (Legal Notice)

Information according to § 5 TMG:

jobcrap
[Your Name/Company Name]
[Address Line 1]
[Address Line 2]
[City, Zip Code, Country]

Contact:
Email: contact@jobcrap.de

Represented by:
[Name of Representative]

Registration:
[Registration Court]
[Registration Number]

Tax ID:
[Tax Identification Number]`;

    const displayContent = content || defaultContent;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="p-4 rounded-[2rem] bg-primary/10 border-2 border-primary/20 shadow-inner group transition-transform hover:scale-110">
                        <Info className="w-12 h-12 text-primary group-hover:animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                            Impressum
                        </h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                            Legal Notice • Information according to German Law
                        </p>
                    </div>
                </div>
            </div>

            <Card className="p-10 md:p-16 border-border/40 bg-card/40 backdrop-blur-2xl shadow-3xl rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Info className="w-64 h-64 -mr-20 -mt-20 transform rotate-12" />
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

            <div className="mt-12 text-center text-muted-foreground text-sm font-medium">
                <p>This information is required by § 5 of the German Telemedia Act (TMG).</p>
            </div>
        </div>
    );
}
