import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function Login() {
    const navigate = useNavigate();
    const login = useAuthStore(state => state.login);
    const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
    const authError = useAuthStore(state => state.error);
    const clearError = useAuthStore(state => state.clearError);

    useEffect(() => {
        clearError();
    }, []);

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newErrors = {};
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        const success = await login(formData.email, formData.password);

        if (success) {
            toast.success('Welcome back to the Vault!');
            // Redirect based on role
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            toast.error(authError || 'Access denied. Check your credentials.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const success = await loginWithGoogle();
        if (success) {
            toast.success('Identity verified!');
            // Redirect based on role
            const currentUser = useAuthStore.getState().user;
            if (currentUser?.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        } else {
            toast.error(authError || 'Google authentication failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-mesh selection:bg-primary/30">
            {/* Left Side: Branding (Immersive) */}
            <div className="hidden lg:flex flex-col justify-center p-20 relative overflow-hidden bg-black/20">
                {/* Background Blobs */}
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-3s' }} />

                <div className="relative z-10 max-w-xl">
                    <div className="mb-12 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <ShieldCheck className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Certified Secure</span>
                    </div>

                    <Logo size="xl" className="mb-8" />

                    <h1 className="text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
                        The Professional <br />
                        <span className="text-shine">Vault of Truth.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-12">
                        Share your real work experiences, salary insights, and office culture anonymously. No filters, just pure professional transparency.
                    </p>

                    <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/5">
                        <div>
                            <div className="text-3xl font-black text-white mb-1">10k+</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Anonymous Stories</div>
                        </div>
                        <div>
                            <div className="text-3xl font-black text-white mb-1">100%</div>
                            <div className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Identity Protection</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form (Focused) */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-background/80 backdrop-blur-xl lg:border-l lg:border-white/5 max-lg:bg-transparent max-lg:text-white">
                {/* Mobile Background Blobs */}
                <div className="absolute lg:hidden top-0 left-0 w-full h-full bg-mesh -z-10" />

                <div className="w-full max-w-[440px] animate-fade-in-up">
                    <div className="mb-8">
                        <div className="lg:hidden mb-6 text-center">
                            <Logo size="xl" className="mx-auto max-lg:[&_path]:fill-white" />
                        </div>
                        <h2 className="text-4xl font-black text-foreground max-lg:text-white mb-2 leading-tight">Welcome Back</h2>
                        <p className="text-muted-foreground max-lg:text-white/70 font-medium text-lg">
                            Login to access your profile.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-muted-foreground/80 max-lg:text-white/60">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground max-lg:text-white/60 group-focus-within:text-primary transition-colors" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="name@company.com"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={cn(
                                        "pl-12 h-13 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 text-base transition-all duration-300 max-lg:text-white max-lg:placeholder:text-white/40",
                                        errors.email && "border-red-500/50"
                                    )}
                                />
                                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-muted-foreground/80 max-lg:text-white/60">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground max-lg:text-white/60 group-focus-within:text-primary transition-colors" />
                                <Input
                                    name="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="••••••••"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={cn(
                                        "pl-12 pr-12 h-13 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 text-base transition-all duration-300 max-lg:text-white max-lg:placeholder:text-white/40",
                                        errors.password && "border-red-500/50"
                                    )}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground max-lg:text-white/60 hover:text-primary transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-focus-within:opacity-100 pointer-events-none transition-opacity duration-300" />
                            </div>
                            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] bg-primary group"
                        >
                            {isLoading ? (
                                <span className="flex items-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Logging in...
                                </span>
                            ) : (
                                <span className="flex items-center gap-2">
                                    Login
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-8 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/40 max-lg:border-white/10" />
                        </div>
                        <span className="relative bg-background max-lg:bg-transparent px-4 text-[10px] font-black text-muted-foreground max-lg:text-white/60 uppercase tracking-[0.2em]">
                            Or continue with
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm font-bold active:scale-[0.98] max-lg:text-white"
                    >
                        <svg width="20" height="20" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
                        Sign in with Google
                    </Button>

                    <p className="text-center mt-8 text-sm font-medium text-muted-foreground max-lg:text-white/70">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-primary font-black hover:underline underline-offset-8 transition-all">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
