import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { validateEmail, validatePassword } from '@/utils/validation';
import { Mail, Lock, User, Eye, EyeOff, ShieldCheck, ArrowRight, Fingerprint } from 'lucide-react';
import Logo from '@/components/common/Logo';

export default function Register() {
    const navigate = useNavigate();
    const register = useAuthStore(state => state.register);
    const loginWithGoogle = useAuthStore(state => state.loginWithGoogle);
    const authError = useAuthStore(state => state.error);
    const clearError = useAuthStore(state => state.clearError);

    useEffect(() => {
        clearError();
    }, []);

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        if (!formData.username || formData.username.length < 3) {
            newErrors.username = 'Username must be at least 3 characters';
        }
        if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!validatePassword(formData.password)) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsLoading(true);
        const success = await register(formData.email, formData.password, formData.username);

        if (success) {
            toast.success('Identity Created. Welcome to the movement!');
            navigate('/');
        } else {
            toast.error(authError || 'Creation failed. Please try again.');
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoading(true);
        const success = await loginWithGoogle();
        if (success) {
            toast.success('Welcome, Truth Seeker!');
            navigate('/');
        } else {
            toast.error(authError || 'Google authentication failed');
            setIsLoading(false);
        }
    };

    return (
        <div className="h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)] overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-mesh selection:bg-primary/30">
            {/* Left Side: Branding (Immersive) */}
            <div className="hidden lg:flex flex-col justify-center p-20 relative overflow-hidden bg-black/20">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] animate-float" />
                <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-float" style={{ animationDelay: '-3s' }} />

                <div className="relative z-10 max-w-xl">
                    <div className="mb-12 inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md">
                        <Fingerprint className="w-4 h-4 text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground">Certified Secure</span>
                    </div>

                    <Logo size="xl" className="mb-8" />

                    <h1 className="text-7xl font-black text-white leading-[1.05] tracking-tight mb-8">
                        Join the Truth <br />
                        <span className="text-shine">Movement.</span>
                    </h1>

                    <p className="text-xl text-muted-foreground font-medium leading-relaxed mb-12">
                        Create an identity and start sharing. Your voice matters, your identity is yours. Join 10,000+ professionals today.
                    </p>

                    <div className="space-y-6 pt-8 border-t border-white/5">
                        <div className="flex items-center gap-4 text-white font-bold group">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <ShieldCheck className="w-5 h-5 text-primary group-hover:text-white" />
                            </div>
                            <span>Encrypted Story Submissions</span>
                        </div>
                        <div className="flex items-center gap-4 text-white font-bold group">
                            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary transition-colors">
                                <User className="absolute w-5 h-5 text-primary group-hover:text-white" />
                            </div>
                            <span>Verified Industry Identity</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side: Form (Focused) */}
            <div className="flex items-center justify-center p-6 sm:p-12 lg:p-20 relative bg-background/80 backdrop-blur-xl lg:border-l lg:border-white/5">
                <div className="absolute lg:hidden top-0 left-0 w-full h-full bg-mesh -z-10" />

                <div className="w-full max-w-[440px] animate-fade-in-up">
                    <div className="mb-8">
                        <div className="lg:hidden mb-6 text-center" style={{ transform: 'scale(0.8)' }}>
                            <Logo size="xl" className="mx-auto" />
                        </div>
                        <h2 className="text-4xl font-black text-foreground mb-2 leading-tight">Create Account</h2>
                        <p className="text-muted-foreground font-medium text-lg">
                            Join the community today.
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-muted-foreground/80">Username</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    name="username"
                                    placeholder="truth_seeker_99"
                                    value={formData.username}
                                    onChange={handleChange}
                                    className={cn(
                                        "pl-12 h-13 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 text-base transition-all duration-300",
                                        errors.username && "border-red-500/50"
                                    )}
                                />
                            </div>
                            {errors.username && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.username}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-muted-foreground/80">Email Address</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                <Input
                                    name="email"
                                    type="email"
                                    placeholder="email@company.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={cn(
                                        "pl-12 h-13 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 text-base transition-all duration-300",
                                        errors.email && "border-red-500/50"
                                    )}
                                />
                            </div>
                            {errors.email && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.email}</p>}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-muted-foreground/80">Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={cn(
                                            "pl-12 pr-10 h-13 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 text-base transition-all duration-300",
                                            errors.password && "border-red-500/50"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[11px] font-black uppercase tracking-widest ml-1 text-muted-foreground/80">Confirm Password</Label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                                    <Input
                                        name="confirmPassword"
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={cn(
                                            "pl-12 pr-10 h-13 rounded-2xl border-white/10 bg-white/5 focus:bg-white/10 text-base transition-all duration-300",
                                            errors.confirmPassword && "border-red-500/50"
                                        )}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 min-h-[1.25rem]">
                            {errors.password && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.password}</p>}
                            {errors.confirmPassword && <p className="text-[10px] text-red-500 font-bold ml-1">{errors.confirmPassword}</p>}
                        </div>

                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 rounded-2xl text-base font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all active:scale-[0.98] bg-primary group"
                        >
                            {isLoading ? "Creating Account..." : (
                                <span className="flex items-center gap-2">
                                    Sign Up
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            )}
                        </Button>
                    </form>

                    <div className="relative my-6 flex items-center justify-center">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border/40" />
                        </div>
                        <span className="relative bg-background px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em]">
                            Or continue with
                        </span>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full h-14 rounded-2xl border-white/10 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-3 text-sm font-bold active:scale-[0.98]"
                    >
                        <svg width="20" height="20" viewBox="-3 0 262 262" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid"><path d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" fill="#4285F4" /><path d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" fill="#34A853" /><path d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" fill="#FBBC05" /><path d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" fill="#EB4335" /></svg>
                        Join with Google
                    </Button>

                    <p className="text-center mt-6 text-sm font-medium text-muted-foreground">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary font-black hover:underline underline-offset-8 transition-all">
                            Login here
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
