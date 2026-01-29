import { Link } from 'react-router-dom';
import Logo from '@/components/common/Logo';

export default function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/50 backdrop-blur-xl mt-auto">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* About */}
                    <div className="col-span-1 md:col-span-1">
                        <Logo size="md" className="mb-6" />
                        <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                            The anonymous platform for workplace truths. Unfiltered, honest, and completely confidential.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-bold text-foreground mb-6 uppercase tracking-widest text-[11px]">Quick Links</h3>
                        <ul className="space-y-4 text-sm font-semibold">
                            <li>
                                <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/feed" className="text-muted-foreground hover:text-primary transition-colors">
                                    Browse Stories
                                </Link>
                            </li>
                            <li>
                                <Link to="/create" className="text-muted-foreground hover:text-primary transition-colors">
                                    Post Story
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-bold text-foreground mb-6 uppercase tracking-widest text-[11px]">Legal</h3>
                        <ul className="space-y-4 text-sm font-semibold">
                            <li>
                                <Link to="/privacy" className="text-muted-foreground hover:text-primary transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-muted-foreground hover:text-primary transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/csae-policy" className="text-muted-foreground hover:text-primary transition-colors">
                                    CSAE Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/impressum" className="text-muted-foreground hover:text-primary transition-colors">
                                    Impressum
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-bold text-foreground mb-6 uppercase tracking-widest text-[11px]">Contact</h3>
                        <p className="text-sm text-muted-foreground mb-4 font-medium">
                            Have feedback?
                        </p>
                        <a
                            href="mailto:contact@jobcrap.de"
                            className="text-sm font-bold text-primary hover:underline underline-offset-4 transition-all"
                        >
                            contact@jobcrap.de
                        </a>
                    </div>
                </div>

                <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">
                    <p>&copy; {new Date().getFullYear()} jobcrap. All rights reserved.</p>
                    <div className="flex items-center gap-6">
                        <span>Built for Truth</span>
                        <div className="w-1 h-1 rounded-full bg-primary/40"></div>
                        <span>Anonymous Forever</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}
