import { useState, useEffect } from 'react';
import { settingsAPI } from '@/services/api.service';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Loader2, Save, Globe, Info } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SettingsTab() {
    const [settings, setSettings] = useState({
        privacy_policy: '',
        terms_of_service: '',
        support_email: '',
        impressum: '',
        landing_sample_story: {
            text: '',
            profession: '',
            country: '',
            category: '',
            upvotes: '1.2k',
            comments: '42'
        }
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        setIsLoading(true);
        try {
            const res = await settingsAPI.getSettings();
            const data = res.data || [];

            const newSettings = { ...settings };
            data.forEach(s => {
                if (s.key === 'privacy_policy') newSettings.privacy_policy = s.value;
                if (s.key === 'terms_of_service') newSettings.terms_of_service = s.value;
                if (s.key === 'support_email') newSettings.support_email = s.value;
                if (s.key === 'impressum') newSettings.impressum = s.value;
                if (s.key === 'landing_sample_story') newSettings.landing_sample_story = s.value;
            });
            setSettings(newSettings);
        } catch (error) {
            console.error('Failed to load settings', error);
            toast.error('Failed to load site settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (key) => {
        setIsSaving(true);
        try {
            await settingsAPI.updateSetting(key, settings[key]);
            toast.success('Setting updated successfully');
        } catch (error) {
            toast.error('Failed to update setting');
        } finally {
            setIsSaving(false);
        }
    };

    const updateNestedValue = (key, field, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: {
                ...prev[key],
                [field]: value
            }
        }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-fade-in-up">
            {/* General Settings Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">General Settings</h2>
                        <p className="text-muted-foreground font-medium">Core platform identification and contact points.</p>
                    </div>
                    <Button
                        onClick={() => handleSave('support_email')}
                        disabled={isSaving}
                        className="rounded-full px-6"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Settings
                    </Button>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <Label className="font-bold ml-1">Support Email</Label>
                        <Input
                            value={settings.support_email}
                            onChange={(e) => setSettings(prev => ({ ...prev, support_email: e.target.value }))}
                            placeholder="e.g. contact@jobcrap.de"
                            className="rounded-xl border-border/40 bg-background/50"
                        />
                        <p className="text-xs text-muted-foreground flex items-center gap-2 ml-1">
                            <Globe className="w-3 h-3" />
                            This email is displayed in the footer and legal pages.
                        </p>
                    </div>
                </div>
            </Card>

            {/* Terms of Service Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Terms of Service</h2>
                        <p className="text-muted-foreground font-medium">Manage the legal agreement between you and your users.</p>
                    </div>
                    <Button
                        onClick={() => handleSave('terms_of_service')}
                        disabled={isSaving}
                        className="rounded-full px-6"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Terms
                    </Button>
                </div>
                <div className="space-y-4">
                    <Textarea
                        value={settings.terms_of_service}
                        onChange={(e) => setSettings(prev => ({ ...prev, terms_of_service: e.target.value }))}
                        placeholder="Enter Terms of Service content here..."
                        className="min-h-[300px] rounded-2xl border-border/40 bg-background/50 font-medium leading-relaxed"
                    />
                </div>
            </Card>
            {/* Privacy Policy Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Privacy Policy</h2>
                        <p className="text-muted-foreground font-medium">Manage the text displayed on the Privacy Policy page.</p>
                    </div>
                    <Button
                        onClick={() => handleSave('privacy_policy')}
                        disabled={isSaving}
                        className="rounded-full px-6"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Policy
                    </Button>
                </div>
                <Textarea
                    value={settings.privacy_policy}
                    onChange={(e) => setSettings(prev => ({ ...prev, privacy_policy: e.target.value }))}
                    placeholder="Enter Privacy Policy content here..."
                    className="min-h-[300px] rounded-2xl border-border/40 bg-background/50 font-medium leading-relaxed"
                />
                <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Plain text only. Support for Markdown is coming soon.
                </p>
            </Card>

            {/* Impressum Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Impressum (Legal Notice)</h2>
                        <p className="text-muted-foreground font-medium">Manage the legal information required by German Law.</p>
                    </div>
                    <Button
                        onClick={() => handleSave('impressum')}
                        disabled={isSaving}
                        className="rounded-full px-6"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Impressum
                    </Button>
                </div>
                <Textarea
                    value={settings.impressum}
                    onChange={(e) => setSettings(prev => ({ ...prev, impressum: e.target.value }))}
                    placeholder="Enter Impressum content here (e.g., Address, Represented by, etc.)..."
                    className="min-h-[300px] rounded-2xl border-border/40 bg-background/50 font-medium leading-relaxed"
                />
                <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    Focus on § 5 TMG requirements: Name, Address, Email, Representatives, and Reg. numbers.
                </p>
            </Card>

            {/* Landing Page Sample Story Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Landing Sample Story</h2>
                        <p className="text-muted-foreground font-medium">The dummy story shown on the landing page for new visitors.</p>
                    </div>
                    <Button
                        onClick={() => handleSave('landing_sample_story')}
                        disabled={isSaving}
                        className="rounded-full px-6"
                    >
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                        Save Story
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="font-bold ml-1">Profession</Label>
                            <Input
                                value={settings.landing_sample_story.profession}
                                onChange={(e) => updateNestedValue('landing_sample_story', 'profession', e.target.value)}
                                className="rounded-xl border-border/40 bg-background/50"
                                placeholder="e.g. Senior Lead Engineer"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold ml-1">Country</Label>
                            <Input
                                value={settings.landing_sample_story.country}
                                onChange={(e) => updateNestedValue('landing_sample_story', 'country', e.target.value)}
                                className="rounded-xl border-border/40 bg-background/50"
                                placeholder="e.g. United States"
                            />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label className="font-bold ml-1">Category & Emoji</Label>
                            <Input
                                value={settings.landing_sample_story.category}
                                onChange={(e) => updateNestedValue('landing_sample_story', 'category', e.target.value)}
                                className="rounded-xl border-border/40 bg-background/50"
                                placeholder="e.g. 🤢 Toxic Boss"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="font-bold ml-1">Upvotes</Label>
                                <Input
                                    value={settings.landing_sample_story.upvotes}
                                    onChange={(e) => updateNestedValue('landing_sample_story', 'upvotes', e.target.value)}
                                    className="rounded-xl border-border/40 bg-background/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold ml-1">Comments</Label>
                                <Input
                                    value={settings.landing_sample_story.comments}
                                    onChange={(e) => updateNestedValue('landing_sample_story', 'comments', e.target.value)}
                                    className="rounded-xl border-border/40 bg-background/50"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label className="font-bold ml-1">Story Text</Label>
                    <Textarea
                        value={settings.landing_sample_story.text}
                        onChange={(e) => updateNestedValue('landing_sample_story', 'text', e.target.value)}
                        placeholder="Enter the dummy story text..."
                        className="min-h-[150px] rounded-2xl border-border/40 bg-background/50 font-medium leading-relaxed"
                    />
                </div>
            </Card>
        </div>
    );
}
