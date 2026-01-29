import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Shield, Loader2, AlertCircle } from 'lucide-react';
import { settingsAPI } from '@/services/api.service';

export default function CSAE() {
    const [content, setContent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const res = await settingsAPI.getSetting('csae_policy');
                if (res.success && res.data) {
                    setContent(res.data.value);
                }
            } catch (error) {
                console.error('Failed to fetch CSAE policy', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchPolicy();
    }, []);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-muted-foreground font-medium animate-pulse">Loading Safety Policy...</p>
            </div>
        );
    }

    // Default Fallback content if DB is empty
    const defaultContent = `Child Sexual Abuse and Exploitation (CSAE) Policy
Zero Tolerance Policy
JobCrap maintains a zero-tolerance policy for Child Sexual Abuse and Exploitation (CSAE). We prohibit any content or behavior that sexually exploits, abuses, or endangers children.

What is CSAE?
CSAE refers to child sexual abuse and exploitation, including content or behavior that sexually exploits, abuses, or endangers children. This includes, for example:
Grooming a child for sexual exploitation
Sextorting a child
Trafficking of a child for sex
Otherwise sexually exploiting a child
Creating, sharing, or distributing child sexual abuse material (CSAM)
Soliciting sexual content from minors
Engaging in sexual conversations with minors
Any attempt to contact minors for sexual purposes

Prohibited Content and Behavior
The following are strictly prohibited on our platform and will result in immediate account termination and reporting to law enforcement:
Any form of child sexual abuse or exploitation
Content that depicts, describes, or promotes sexual abuse of minors
Attempts to groom, solicit, or exploit minors
Sharing or distributing child sexual abuse material
Any communication with minors for sexual purposes
Content that normalizes or encourages child sexual abuse

Reporting CSAE Content
If you encounter content or behavior that violates this policy:
Report immediately using our in-app reporting feature
Contact our safety team directly at [your-safety-email@jobcrap.com]
Report to appropriate authorities:
National Center for Missing & Exploited Children (NCMEC): report.cybertip.org
Your local law enforcement agency

Our Response to Violations
When we become aware of CSAE content or behavior:
We immediately remove the reported content
We permanently terminate the accounts of violators
We cooperate fully with law enforcement investigations
We report violations to NCMEC and relevant authorities
We preserve evidence for legal proceedings

Age Verification
JobCrap is intended for users 18 years and older. By using this platform, you confirm that:
You are at least 18 years of age
You will not engage in any activity that endangers children
You understand that violations of this policy may result in criminal prosecution

Your Responsibility
All users are responsible for:
Reporting suspected CSAE content immediately upon discovery
Not sharing, saving, or engaging with such content in any way
Understanding that violations may result in both account termination and legal action
Complying with all applicable laws regarding child protection

Support Resources
If you or someone you know has been affected by child sexual abuse or exploitation, please seek help:
National Sexual Assault Hotline: 1-800-656-4673
Childhelp National Child Abuse Hotline: 1-800-4-A-CHILD (1-800-422-4453)
Crisis Text Line: Text HOME to 741741
National Center for Missing & Exploited Children: www.missingkids.org

Legal Consequences
Violations of this policy are serious crimes. We will:
Report all violations to law enforcement
Cooperate fully with criminal investigations
Provide evidence to support prosecution
Support victims in seeking justice

Contact Us
If you have questions about this policy or need to report a violation, please contact our safety team at [your-safety-email@jobcrap.com].

Last Updated: January 29, 2026
Effective Date: January 29, 2026`;

    const displayContent = content || defaultContent;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="p-4 rounded-[2rem] bg-red-500/10 border-2 border-red-500/20 shadow-inner group transition-transform hover:scale-110">
                        <AlertCircle className="w-12 h-12 text-red-500 group-hover:animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-tight">
                            CSAE <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent underline decoration-red-500/20">Policy</span>
                        </h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                            Zero Tolerance Protocol • January 2026
                        </p>
                    </div>
                </div>
            </div>

            <Card className="p-10 md:p-16 border-red-500/20 bg-card/40 backdrop-blur-2xl shadow-3xl rounded-[3rem] relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.05] transition-opacity pointer-events-none">
                    <Shield className="w-64 h-64 -mr-20 -mt-20 transform rotate-12 text-red-500" />
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
                    Urgent Concern? Contact safety at <a href="mailto:safety@jobcrap.com" className="text-red-500 font-black hover:underline underline-offset-4">safety@jobcrap.com</a>
                </p>
            </div>
        </div>
    );
}
