import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES, COUNTRIES, TRIGGER_WARNINGS, POST_LIMITS } from '@/utils/constants';
import { validatePostContent } from '@/utils/validation';
import { postsAPI } from '@/services/api.service';
import toast from 'react-hot-toast';
import { AlertCircle } from 'lucide-react';

export default function EditStoryModal({ isOpen, onClose, story, onSuccess }) {
    const [formData, setFormData] = useState({
        profession: '',
        country: '',
        category: '',
        text: '',
        triggerWarnings: []
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (story) {
            setFormData({
                profession: story.profession || '',
                country: story.country || '',
                category: story.category || '',
                text: story.text || '',
                triggerWarnings: story.triggerWarnings || []
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

        try {
            await postsAPI.updateStory(story._id, formData);
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
                                <SelectContent className="dark:bg-gray-800 dark:border-gray-700">
                                    {COUNTRIES.map(country => (
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
