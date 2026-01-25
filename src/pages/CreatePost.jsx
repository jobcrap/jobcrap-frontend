import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCreatePost } from '@/hooks/usePosts';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, TRIGGER_WARNINGS, POST_LIMITS, COUNTRIES } from '@/utils/constants';
import { validatePostContent, countSentences } from '@/utils/validation';
import { PenSquare, AlertCircle, Check, ChevronsUpDown, Eye, ShieldCheck, Clock, Globe, ThumbsUp, MessageCircle, Share2, ShieldQuestion, Tag, X } from 'lucide-react';
import { PostSkeleton } from '@/components/ui/skeleton';
import { countries } from 'countries-list';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
        .toUpperCase()
        .split('')
        .map(char => 127397 + char.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
}

const COUNTRY_OPTIONS = Object.entries(countries).map(([code, data]) => ({
    value: data.name,
    label: `${getFlagEmoji(code)} ${data.name}`
})).sort((a, b) => a.label.localeCompare(b.label));

export default function CreatePost() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthStore();
    const createPostMutation = useCreatePost();

    const [formData, setFormData] = useState({
        profession: '',
        country: '',
        category: '',
        text: '',
        triggerWarnings: [],
        tags: [],
        isAnonymous: false
    });
    const [tagInput, setTagInput] = useState('');
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [errors, setErrors] = useState({});
    const isLoading = createPostMutation.isPending;

    // Redirect if not authenticated
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleTriggerWarningToggle = (warning) => {
        setFormData(prev => ({
            ...prev,
            triggerWarnings: prev.triggerWarnings.includes(warning)
                ? prev.triggerWarnings.filter(w => w !== warning)
                : [...prev.triggerWarnings, warning]
        }));
    };

    const handleAddTag = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            const tag = tagInput.trim().toLowerCase();
            if (tag && !formData.tags.includes(tag)) {
                setFormData(prev => ({ ...prev, tags: [...prev.tags, tag] }));
                setTagInput('');
            }
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(t => t !== tagToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};

        // Validate required fields
        if (!formData.profession.trim()) {
            newErrors.profession = 'Profession is required';
        }
        if (!formData.country) {
            newErrors.country = 'Country is required';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        // Validate post content
        const contentErrors = validatePostContent(formData.text);
        if (Object.keys(contentErrors).length > 0) {
            Object.assign(newErrors, contentErrors);
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Add any pending tag input
        const finalFormData = { ...formData };
        if (tagInput.trim()) {
            const lastTag = tagInput.trim().toLowerCase();
            if (!finalFormData.tags.includes(lastTag)) {
                finalFormData.tags = [...finalFormData.tags, lastTag];
            }
        }

        createPostMutation.mutate(finalFormData, {
            onSuccess: () => navigate('/feed')
        });
    };


    const sentenceCount = countSentences(formData.text);


    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-foreground mb-3 leading-tight">
                    Share your <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Digital Truth</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                    Whether it's a victory, a warning, or a cry for help, your story matters. Always anonymous, always heard.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
                {/* Form Section */}
                <div className="lg:col-span-7 space-y-8">
                    <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-[2.5rem] shadow-xl">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {/* Text Area */}
                            <div className="space-y-3">
                                <Label className="text-sm font-bold ml-1 flex items-center gap-2">
                                    <PenSquare className="w-4 h-4 text-primary" /> What's on your mind?
                                </Label>
                                <Textarea
                                    name="text"
                                    value={formData.text}
                                    onChange={handleChange}
                                    placeholder="Write your professional story here... Keep it real, keep it professional."
                                    className="min-h-[250px] rounded-3xl border-border/40 bg-background/50 focus:border-primary/50 focus:ring-primary/20 transition-all text-lg p-6"
                                    required
                                />
                                <div className="flex justify-between text-[10px] uppercase font-bold tracking-widest px-2 text-muted-foreground">
                                    <span className={formData.text.length > POST_LIMITS.MAX_CHARACTERS ? 'text-red-500' : ''}>
                                        {formData.text.length} / {POST_LIMITS.MAX_CHARACTERS} Characters
                                    </span>
                                    <span>{sentenceCount} / {POST_LIMITS.MAX_SENTENCES} Sentences</span>
                                </div>
                            </div>

                            {/* Options Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Category */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold ml-1">Category</Label>
                                    <Select
                                        value={formData.category}
                                        onValueChange={(val) => setFormData({ ...formData, category: val })}
                                    >
                                        <SelectTrigger className="rounded-2xl border-border/40 bg-background/50 h-12">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl border-border/40">
                                            {CATEGORIES.map((cat) => (
                                                <SelectItem key={cat.value} value={cat.value} className="rounded-lg">
                                                    {cat.emoji} {cat.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Profession */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold ml-1">Your Profession</Label>
                                    <Input
                                        name="profession"
                                        placeholder="e.g. Senior Software Engineer"
                                        value={formData.profession}
                                        onChange={handleChange}
                                        className="rounded-2xl border-border/40 bg-background/50 h-12"
                                        required
                                    />
                                </div>

                                {/* Country Selector */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold ml-1">Country</Label>
                                    <Popover open={open} onOpenChange={(isOpen) => {
                                        setOpen(isOpen);
                                        if (isOpen) setSearchQuery('');
                                    }}>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                role="combobox"
                                                aria-expanded={open}
                                                className="w-full justify-between rounded-2xl border-border/40 bg-background/50 h-12 font-medium"
                                            >
                                                {formData.country ? (
                                                    <span className="flex items-center gap-2">
                                                        {COUNTRY_OPTIONS.find((c) => c.value === formData.country)?.label}
                                                    </span>
                                                ) : (
                                                    <span className="text-muted-foreground/60 tracking-tight">Search or scroll to select...</span>
                                                )}
                                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[350px] p-0 rounded-2xl border-border/40 shadow-2xl backdrop-blur-3xl overflow-hidden z-50">
                                            <div className="flex flex-col h-[400px]">
                                                {/* Search Box */}
                                                <div className="p-4 border-b border-white/5 bg-white/5 backdrop-blur-md">
                                                    <div className="relative">
                                                        <PenSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                                        <Input
                                                            placeholder="Type your country..."
                                                            value={searchQuery}
                                                            onChange={(e) => setSearchQuery(e.target.value)}
                                                            className="pl-10 h-10 bg-background/40 border-border/40 rounded-xl focus:ring-primary/20 text-sm font-medium"
                                                        />
                                                    </div>
                                                </div>

                                                {/* List */}
                                                <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                                                    {COUNTRY_OPTIONS.filter(c =>
                                                        c.value.toLowerCase().includes(searchQuery.toLowerCase())
                                                    ).map((c) => (
                                                        <button
                                                            key={c.value}
                                                            type="button"
                                                            onClick={() => {
                                                                setFormData({ ...formData, country: c.value });
                                                                setOpen(false);
                                                            }}
                                                            className={cn(
                                                                "w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 group text-left",
                                                                formData.country === c.value
                                                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                                                    : "hover:bg-white/10 text-foreground/80 hover:text-foreground"
                                                            )}
                                                        >
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-lg leading-none">{c.label.split(' ')[0]}</span>
                                                                <span className="text-sm font-bold tracking-tight">{c.value}</span>
                                                            </div>
                                                            {formData.country === c.value && <Check className="w-4 h-4 text-white" />}
                                                        </button>
                                                    ))}
                                                    {COUNTRY_OPTIONS.filter(c =>
                                                        c.value.toLowerCase().includes(searchQuery.toLowerCase())
                                                    ).length === 0 && (
                                                            <div className="py-12 text-center">
                                                                <p className="text-sm text-muted-foreground font-medium">No country found.</p>
                                                            </div>
                                                        )}
                                                </div>
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                </div>

                                {/* Anonymity */}
                                <div className="space-y-3">
                                    <Label className="text-sm font-bold ml-1">Identity Setting</Label>
                                    <div
                                        onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                                        className={cn(
                                            "h-12 w-full rounded-2xl border-2 flex items-center justify-between px-4 cursor-pointer transition-all duration-300",
                                            formData.isAnonymous
                                                ? "bg-primary/10 border-primary/40 text-primary shadow-inner"
                                                : "bg-background/50 border-border/40 text-muted-foreground"
                                        )}
                                    >
                                        <div className="flex items-center gap-2">
                                            <ShieldCheck className={cn("w-5 h-5 transition-transform duration-500", formData.isAnonymous ? "scale-110" : "scale-100")} />
                                            <span className="font-bold">Post Anonymously</span>
                                        </div>
                                        <div className={cn(
                                            "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                            formData.isAnonymous ? "bg-primary border-primary scale-110" : "border-muted/50"
                                        )}>
                                            {formData.isAnonymous && <Check className="w-4 h-4 text-white" />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tags Section */}
                            <div className="space-y-4">
                                <Label className="text-sm font-bold ml-1 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-primary" /> Topic Tags
                                </Label>
                                <div className="space-y-3">
                                    <div className="relative group">
                                        <Input
                                            value={tagInput}
                                            onChange={(e) => setTagInput(e.target.value)}
                                            onKeyDown={handleAddTag}
                                            placeholder="Add tags (e.g. IT, boss, burnout) and press Enter"
                                            className="rounded-2xl border-border/40 bg-background/50 h-12 focus:ring-primary/20"
                                        />
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="secondary"
                                                className="pl-3 pr-2 py-1.5 rounded-full bg-primary/10 text-primary dark:bg-primary/20 dark:text-white border-0 hover:bg-primary/20 transition-all font-bold gap-2 group/tag"
                                            >
                                                #{tag}
                                                <button
                                                    type="button"
                                                    onClick={() => handleRemoveTag(tag)}
                                                    className="p-0.5 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Trigger Warnings */}
                            <div className="space-y-4">
                                <Label className="text-sm font-bold ml-1 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4 text-amber-500" /> Sensitive Content Warnings
                                </Label>
                                <div className="flex flex-wrap gap-2">
                                    {TRIGGER_WARNINGS.map((tw) => (
                                        <Badge
                                            key={tw.value}
                                            variant={formData.triggerWarnings.includes(tw.value) ? 'default' : 'secondary'}
                                            onClick={() => handleTriggerWarningToggle(tw.value)}
                                            className={cn(
                                                "cursor-pointer px-4 py-2 rounded-full text-xs font-bold transition-all border-0",
                                                formData.triggerWarnings.includes(tw.value)
                                                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-500/20"
                                                    : "bg-secondary/50 hover:bg-secondary/80 text-muted-foreground"
                                            )}
                                        >
                                            {tw.label}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                size="lg"
                                disabled={isLoading}
                                className="w-full h-14 rounded-full text-xl font-black shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-[1.02] active:scale-[0.98] mt-4"
                            >
                                {isLoading ? "Sharing with the world..." : "Publish Final Truth"}
                            </Button>
                        </form>
                    </Card>
                </div>

                {/* Preview Section */}
                <div className="lg:col-span-5 sticky top-24">
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-2">
                            <h3 className="text-lg font-black tracking-tight text-foreground flex items-center gap-2">
                                <Eye className="w-5 h-5 text-primary" /> Live Preview
                            </h3>
                            <span className="text-[10px] uppercase font-black tracking-widest text-muted-foreground animate-pulse">Updating Real-time</span>
                        </div>

                        {/* Dummy Post Card */}
                        <Card className="relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl shadow-2xl rounded-[2.5rem] p-8">
                            <div className="absolute top-0 right-0 px-6 py-2 bg-primary/10 border-l border-b border-primary/20 rounded-bl-3xl text-[10px] font-black uppercase tracking-widest text-primary">
                                Preview Mode
                            </div>

                            <div className="flex items-start gap-4 mb-6">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-purple-500/10 flex items-center justify-center border-2 border-primary/20">
                                    {formData.isAnonymous ? (
                                        <ShieldCheck className="w-6 h-6 text-primary" />
                                    ) : (
                                        <img
                                            src={useAuthStore.getState().user?.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                            className="w-full h-full rounded-full object-cover"
                                            alt="Preview"
                                        />
                                    )}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-bold text-foreground truncate">
                                            {formData.isAnonymous ? 'Anonymous' : (useAuthStore.getState().user?.username || 'Member')}
                                        </span>
                                        {formData.category ? (
                                            <Badge className="bg-primary/10 text-primary border-0 text-[10px] h-5 px-2 font-bold uppercase transition-all">
                                                {CATEGORIES.find(c => c.value === formData.category)?.emoji} {formData.category}
                                            </Badge>
                                        ) : (
                                            <Badge variant="outline" className="text-[10px] h-5 text-muted-foreground/50 border-dashed">
                                                Category
                                            </Badge>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                                        <span className={!formData.profession ? "text-muted-foreground/30 italic" : "truncate"}>
                                            {formData.profession || 'Your Profession'}
                                        </span>
                                        <span>•</span>
                                        <span className={!formData.country ? "text-muted-foreground/30 italic" : ""}>
                                            {formData.country || 'Global'}
                                        </span>
                                        <span>•</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Just now</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-8 min-h-[150px]">
                                {formData.text ? (
                                    <p className="text-foreground/90 leading-relaxed text-lg font-medium tracking-tight whitespace-pre-wrap transition-opacity duration-300">
                                        {formData.text}
                                    </p>
                                ) : (
                                    <div className="space-y-3 pt-2">
                                        <div className="h-4 w-full bg-muted/20 animate-pulse rounded-full" />
                                        <div className="h-4 w-full bg-muted/20 animate-pulse rounded-full" />
                                        <div className="h-4 w-2/3 bg-muted/20 animate-pulse rounded-full" />
                                    </div>
                                )}

                                {formData.triggerWarnings.length > 0 && (
                                    <div className="flex flex-wrap gap-2 pt-2">
                                        {formData.triggerWarnings.map(tw => (
                                            <span key={tw} className="text-[10px] font-black uppercase text-amber-500/80 tracking-tighter">⚠️ {tw}</span>
                                        ))}
                                    </div>
                                )}

                                {formData.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {formData.tags.map(tag => (
                                            <span key={tag} className="text-xs font-bold text-primary/70 dark:text-white/80">#{tag}</span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between opacity-40 grayscale select-none pointer-events-none">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <ThumbsUp className="w-5 h-5" />
                                        <span>0</span>
                                    </div>
                                    <div className="flex items-center gap-1.5 text-muted-foreground">
                                        <MessageCircle className="w-5 h-5" />
                                        <span>0</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-bold bg-muted/10 px-3 py-1 rounded-full">
                                    <Globe className="w-4 h-4" />
                                    <span>English</span>
                                </div>
                            </div>
                        </Card>

                        {/* Tips Card */}
                        <Card className="p-6 rounded-3xl bg-primary/5 border border-primary/10 shadow-none">
                            <h4 className="font-bold text-sm mb-2 flex items-center gap-2 text-primary">
                                <ShieldQuestion className="w-4 h-4" /> Sharing Tips
                            </h4>
                            <ul className="space-y-2 text-xs text-muted-foreground font-medium">
                                <li className="flex items-start gap-2">• Describe the context clearly but keep it concise.</li>
                                <li className="flex items-start gap-2">• Use trigger warnings for sensitive topics.</li>
                                <li className="flex items-start gap-2">• Remember that once shared, truths cannot be easily retracted.</li>
                            </ul>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
