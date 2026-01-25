import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, TRIGGER_WARNINGS, POST_LIMITS } from '@/utils/constants';
import { validatePostContent } from '@/utils/validation';
import { postsAPI } from '@/services/api.service';
import toast from 'react-hot-toast';
import { AlertCircle, ShieldCheck, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { countries } from 'countries-list';

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

export default function EditStoryModal({ isOpen, onClose, story, onSuccess }) {
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
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (story) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                profession: story.profession || '',
                country: story.country || '',
                category: story.category || '',
                text: story.text || '',
                triggerWarnings: story.triggerWarnings || [],
                tags: story.tags || [],
                isAnonymous: story.isAnonymous || false
            });
        }
    }, [story]);

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

        if (!formData.profession.trim()) {
            newErrors.profession = 'Profession is required';
        }
        if (!formData.country) {
            newErrors.country = 'Country is required';
        }
        if (!formData.category) {
            newErrors.category = 'Category is required';
        }

        const contentErrors = validatePostContent(formData.text);
        if (Object.keys(contentErrors).length > 0) {
            Object.assign(newErrors, contentErrors);
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);

        // Add any pending tag input
        const finalFormData = { ...formData };
        if (tagInput.trim()) {
            const lastTag = tagInput.trim().toLowerCase();
            if (!finalFormData.tags.includes(lastTag)) {
                finalFormData.tags = [...finalFormData.tags, lastTag];
            }
        }

        try {
            await postsAPI.updateStory(story._id, finalFormData);
            onSuccess?.();
            onClose();
        } catch (error) {
            toast.error('Failed to update story');
            console.error(error);
            setIsSubmitting(false);
        }
    };

    const charCount = formData.text.length;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="dark:text-white">Edit Your Story</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    {/* Profession */}
                    <div>
                        <Label htmlFor="profession" className="dark:text-gray-300">
                            Job / Profession *
                        </Label>
                        <Input
                            id="profession"
                            name="profession"
                            placeholder="e.g., Software Engineer"
                            value={formData.profession}
                            onChange={handleChange}
                            className={`mt-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.profession ? 'border-red-500' : ''}`}
                        />
                        {errors.profession && (
                            <p className="text-sm text-red-600 mt-1">{errors.profession}</p>
                        )}
                    </div>

                    {/* Country and Category */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <Label htmlFor="country" className="dark:text-gray-300">Country *</Label>
                            <Select value={formData.country} onValueChange={(value) => setFormData(prev => ({ ...prev, country: value }))}>
                                <SelectTrigger className={`mt-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.country ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select country" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700 max-h-[300px]">
                                    {COUNTRY_OPTIONS.map(country => (
                                        <SelectItem key={country.value} value={country.value} className="dark:text-white">
                                            {country.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.country && <p className="text-sm text-red-600 mt-1">{errors.country}</p>}
                        </div>

                        <div>
                            <Label htmlFor="category" className="dark:text-gray-300">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                                <SelectTrigger className={`mt-1.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.category ? 'border-red-500' : ''}`}>
                                    <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat.value} value={cat.value} className="dark:text-white">
                                            {cat.emoji} {cat.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-red-600 mt-1">{errors.category}</p>}
                        </div>
                    </div>

                    {/* Story Text */}
                    <div>
                        <Label htmlFor="text" className="dark:text-gray-300">Your Story *</Label>
                        <Textarea
                            id="text"
                            name="text"
                            placeholder="Edit your story..."
                            value={formData.text}
                            onChange={handleChange}
                            rows={6}
                            className={`mt-1.5 resize-none dark:bg-gray-800 dark:border-gray-700 dark:text-white ${errors.text ? 'border-red-500' : ''}`}
                        />
                        <div className="flex items-center justify-between mt-1">
                            <span className={`text-xs ${charCount > POST_LIMITS.MAX_CHARACTERS * 0.8 ? 'text-orange-600 font-semibold' : 'text-gray-500 dark:text-gray-400'}`}>
                                {charCount}/{POST_LIMITS.MAX_CHARACTERS} characters
                            </span>
                        </div>
                        {(errors.text || errors.sentences) && (
                            <p className="text-sm text-red-600 mt-1">{errors.text || errors.sentences}</p>
                        )}
                    </div>

                    {/* Trigger Warnings */}
                    <div>
                        <Label className="dark:text-gray-300 mb-2 block">
                            Trigger Warnings (Optional)
                        </Label>
                        <div className="flex flex-wrap gap-2">
                            {TRIGGER_WARNINGS.map(warning => (
                                <Badge
                                    key={warning.value}
                                    variant={formData.triggerWarnings.includes(warning.value) ? "default" : "outline"}
                                    className={`cursor-pointer transition-colors ${formData.triggerWarnings.includes(warning.value)
                                        ? 'bg-amber-500 hover:bg-amber-600 text-white'
                                        : 'hover:bg-gray-100 dark:hover:bg-gray-800 dark:text-gray-300'
                                        }`}
                                    onClick={() => handleTriggerWarningToggle(warning.value)}
                                >
                                    {formData.triggerWarnings.includes(warning.value) && <AlertCircle className="w-3 h-3 mr-1" />}
                                    {warning.label}
                                </Badge>
                            ))}
                        </div>
                        {formData.triggerWarnings.length > 0 && (
                            <p className="text-xs text-amber-600 dark:text-amber-500 mt-2">
                                Note: Stories with trigger warnings will be flagged for admin review
                            </p>
                        )}
                    </div>

                    {/* Tags Section */}
                    <div>
                        <Label className="dark:text-gray-300 mb-2 block">
                            Topic Tags
                        </Label>
                        <div className="space-y-3">
                            <Input
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyDown={handleAddTag}
                                placeholder="Add tags and press Enter"
                                className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            />
                            <div className="flex flex-wrap gap-2">
                                {formData.tags.map((tag) => (
                                    <Badge
                                        key={tag}
                                        variant="secondary"
                                        className="pl-3 pr-2 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border-0 hover:bg-blue-500/20 transition-all font-bold gap-2"
                                    >
                                        #{tag}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="p-0.5 hover:bg-red-500 hover:text-white rounded-full transition-colors"
                                        >
                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Anonymity Toggle */}
                    <div className="space-y-2">
                        <Label className="dark:text-gray-300">Identity Setting</Label>
                        <div
                            onClick={() => setFormData({ ...formData, isAnonymous: !formData.isAnonymous })}
                            className={cn(
                                "h-12 w-full rounded-xl border-2 flex items-center justify-between px-4 cursor-pointer transition-all duration-300",
                                formData.isAnonymous
                                    ? "bg-blue-500/10 border-blue-500/40 text-blue-600 dark:text-blue-400"
                                    : "bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500"
                            )}
                        >
                            <div className="flex items-center gap-2">
                                <ShieldCheck className={cn("w-5 h-5 transition-transform duration-500", formData.isAnonymous ? "scale-110" : "scale-100")} />
                                <span className="font-bold">Post Anonymously</span>
                            </div>
                            <div className={cn(
                                "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                                formData.isAnonymous ? "bg-blue-600 border-blue-600 scale-110" : "border-gray-300 dark:border-gray-600"
                            )}>
                                {formData.isAnonymous && <Check className="w-4 h-4 text-white" />}
                            </div>
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Updating...' : 'Update Story'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
