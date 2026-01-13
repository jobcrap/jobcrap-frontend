import { Card } from '@/components/ui/card';
import { Scale, Info } from 'lucide-react';

export default function Terms() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
            {/* Header */}
            <div className="mb-12 text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
                    <div className="p-4 rounded-[2rem] bg-primary/10 border-2 border-primary/20 shadow-inner group transition-transform hover:scale-110">
                        <Scale className="w-12 h-12 text-primary group-hover:animate-pulse" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-tight">
                            Terms of <span className="underline decoration-primary/20">Service</span>
                        </h1>
                        <p className="text-muted-foreground font-bold mt-2 uppercase tracking-widest text-xs flex items-center justify-center md:justify-start gap-2">
                            Last Updated • January 2026
                        </p>
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <Card className="p-8 md:p-12 border-border/40 bg-card/40 backdrop-blur-2xl shadow-xl rounded-[2.5rem]">
                    <div className="prose prose-lg dark:prose-invert max-w-none">
                        <p className="text-foreground/90 font-bold text-xl mb-8">
                            Welcome to Jobcrap. By accessing or using this website, you agree to be bound by these Terms of Service. If you do not agree, do not use the platform.
                        </p>

                        <div className="space-y-10">
                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">1</span>
                                    Intended Audience
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    This platform is not intended for children or minors. By using Jobcrap, you confirm that you are not a minor and that you are legally allowed to use this service in your country.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">2</span>
                                    Platform Description
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    Jobcrap is a platform where users can share workplace-related stories and content, including anonymous posts.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">3</span>
                                    User Responsibility
                                </h2>
                                <div className="space-y-3">
                                    <p className="text-foreground/80 leading-relaxed font-medium">You are solely responsible for the content you post. You agree NOT to post:</p>
                                    <ul className="list-disc list-inside space-y-2 text-foreground/75 font-medium ml-4">
                                        <li>Illegal content</li>
                                        <li>Hate speech, threats, or harassment</li>
                                        <li>Defamation or false accusations</li>
                                        <li>Personal data of other people</li>
                                        <li>Content that violates any law</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">4</span>
                                    Anonymity
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    You may post anonymously. However, we reserve the right to store technical data and to identify users if required by law or for platform safety and abuse prevention.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">5</span>
                                    Moderation and Enforcement
                                </h2>
                                <div className="space-y-3">
                                    <p className="text-foreground/80 leading-relaxed font-medium">We reserve the right to:</p>
                                    <ul className="list-disc list-inside space-y-2 text-foreground/75 font-medium ml-4">
                                        <li>Remove or edit any content</li>
                                        <li>Suspend or ban any account</li>
                                        <li>Moderate the platform at our own discretion</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">6</span>
                                    No Warranty
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    The service is provided "as is" without any warranty. We do not guarantee uptime, availability, or error-free operation.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">7</span>
                                    Limitation of Liability
                                </h2>
                                <div className="space-y-3">
                                    <p className="text-foreground/80 leading-relaxed font-medium">Jobcrap is not responsible for:</p>
                                    <ul className="list-disc list-inside space-y-2 text-foreground/75 font-medium ml-4">
                                        <li>User-generated content</li>
                                        <li>Any damages resulting from the use of the platform</li>
                                        <li>Data loss or service interruptions</li>
                                    </ul>
                                </div>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">8</span>
                                    Account Termination
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    We may terminate or suspend access to the service at any time without prior notice if these terms are violated.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">9</span>
                                    Changes to Terms
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    We may update these Terms of Service at any time. Continued use of the platform means you accept the new terms.
                                </p>
                            </section>

                            <section>
                                <h2 className="text-2xl font-black text-foreground mb-4 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary text-sm">10</span>
                                    Contact
                                </h2>
                                <p className="text-foreground/80 leading-relaxed font-medium">
                                    contact@jobcrap.de
                                </p>
                            </section>
                        </div>
                    </div>
                </Card>

                <div className="mt-12 text-center text-muted-foreground p-8 rounded-3xl bg-secondary/30 backdrop-blur-sm border border-border/40">
                    <p className="font-medium flex items-center justify-center gap-2">
                        <Info className="w-4 h-4 text-primary" />
                        Questions about our Terms? Contact us at{' '}
                        <a href="mailto:contact@jobcrap.de" className="text-primary font-black hover:underline underline-offset-4">
                            contact@jobcrap.de
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
