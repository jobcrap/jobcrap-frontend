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
        csae_policy: `Zero Tolerance Policy\nJobCrap maintains a zero-tolerance policy for Child Sexual Abuse and Exploitation (CSAE). We prohibit any content or behavior that sexually exploits, abuses, or endangers children.\n\nWhat is CSAE?\nCSAE refers to child sexual abuse and exploitation, including content or behavior that sexually exploits, abuses, or endangers children. This includes, for example:\nGrooming a child for sexual exploitation\nSextorting a child\nTrafficking of a child for sex\nOtherwise sexually exploiting a child\nCreating, sharing, or distributing child sexual abuse material (CSAM)\nSoliciting sexual content from minors\nEngaging in sexual conversations with minors\nAny attempt to contact minors for sexual purposes\n\nProhibited Content and Behavior\nThe following are strictly prohibited on our platform and will result in immediate account termination and reporting to law enforcement:\nAny form of child sexual abuse or exploitation\nContent that depicts, describes, or promotes sexual abuse of minors\nAttempts to groom, solicit, or exploit minors\nSharing or distributing child sexual abuse material\nAny communication with minors for sexual purposes\nContent that normalizes or encourages child sexual abuse\n\nReporting CSAE Content\nIf you encounter content or behavior that violates this policy:\nReport immediately using our in-app reporting feature\nContact our safety team directly at [your-safety-email@jobcrap.com]\nReport to appropriate authorities:\nNational Center for Missing & Exploited Children (NCMEC): report.cybertip.org\nYour local law enforcement agency\n\nOur Response to Violations\nWhen we become aware of CSAE content or behavior:\nWe immediately remove the reported content\nWe permanently terminate the accounts of violators\nWe cooperate fully with law enforcement investigations\nWe report violations to NCMEC and relevant authorities\nWe preserve evidence for legal proceedings\n\nAge Verification\nJobCrap is intended for users 18 years and older. By using this platform, you confirm that:\nYou are at least 18 years of age\nYou will not engage in any activity that endangers children\nYou understand that violations of this policy may result in criminal prosecution\n\nYour Responsibility\nAll users are responsible for:\nReporting suspected CSAE content immediately upon discovery\nNot sharing, saving, or engaging with such content in any way\nUnderstanding that violations may result in both account termination and legal action\nComplying with all applicable laws regarding child protection\n\nSupport Resources\nIf you or someone you know has been affected by child sexual abuse or exploitation, please seek help:\nNational Sexual Assault Hotline: 1-800-656-4673\nChildhelp National Child Abuse Hotline: 1-800-4-A-CHILD (1-800-422-4453)\nCrisis Text Line: Text HOME to 741741\nNational Center for Missing & Exploited Children: www.missingkids.org\n\nLegal Consequences\nViolations of this policy are serious crimes. We will:\nReport all violations to law enforcement\nCooperate fully with criminal investigations\nProvide evidence to support prosecution\nSupport victims in seeking justice\n\nContact Us\nIf you have questions about this policy or need to report a violation, please contact our safety team at [your-safety-email@jobcrap.com].\n\nLast Updated: January 29, 2026\nEffective Date: January 29, 2026`,
        landing_sample_story: {
            text: '',
            profession: '',
            country: '',
            category: '',
            upvotes: '1.2k',
            comments: '42'
        }
    });
    const [originalSettings, setOriginalSettings] = useState({}); // To track changes
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(null); // Changed from boolean to null/key string

    useEffect(() => {
        fetchSettings();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                if (s.key === 'csae_policy') newSettings.csae_policy = s.value;
                if (s.key === 'landing_sample_story') newSettings.landing_sample_story = s.value;
            });
            setSettings(newSettings);
            setOriginalSettings(JSON.parse(JSON.stringify(newSettings))); // Deep copy for comparison
        } catch (error) {
            console.error('Failed to load settings', error);
            toast.error('Failed to load site settings');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (key) => {
        setIsSaving(key);
        try {
            await settingsAPI.updateSetting(key, settings[key]);
            setOriginalSettings(prev => ({
                ...prev,
                [key]: JSON.parse(JSON.stringify(settings[key]))
            })); // Update original to hide button
            toast.success('Setting updated successfully');
        } catch {
            toast.error('Failed to update setting');
        } finally {
            setIsSaving(null);
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

    const isDirty = (key) => {
        if (key === 'landing_sample_story') {
            return JSON.stringify(settings[key]) !== JSON.stringify(originalSettings[key]);
        }
        return settings[key] !== originalSettings[key];
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
                    {isDirty('support_email') && (
                        <Button
                            onClick={() => handleSave('support_email')}
                            disabled={isSaving !== null}
                            className="rounded-full px-6 animate-in fade-in zoom-in duration-300"
                        >
                            {isSaving === 'support_email' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Settings
                        </Button>
                    )}
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
                    {isDirty('terms_of_service') && (
                        <Button
                            onClick={() => handleSave('terms_of_service')}
                            disabled={isSaving !== null}
                            className="rounded-full px-6 animate-in fade-in zoom-in duration-300"
                        >
                            {isSaving === 'terms_of_service' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Terms
                        </Button>
                    )}
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
                    {isDirty('privacy_policy') && (
                        <Button
                            onClick={() => handleSave('privacy_policy')}
                            disabled={isSaving !== null}
                            className="rounded-full px-6 animate-in fade-in zoom-in duration-300"
                        >
                            {isSaving === 'privacy_policy' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Policy
                        </Button>
                    )}
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

            {/* CSAE Policy Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">CSAE Policy</h2>
                        <p className="text-muted-foreground font-medium">Manage the Child Sexual Abuse and Exploitation Zero Tolerance Policy.</p>
                    </div>
                    {isDirty('csae_policy') && (
                        <Button
                            onClick={() => handleSave('csae_policy')}
                            disabled={isSaving !== null}
                            className="rounded-full px-6 animate-in fade-in zoom-in duration-300"
                        >
                            {isSaving === 'csae_policy' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Policy
                        </Button>
                    )}
                </div>
                <Textarea
                    value={settings.csae_policy}
                    onChange={(e) => setSettings(prev => ({ ...prev, csae_policy: e.target.value }))}
                    placeholder="Enter CSAE Policy content here..."
                    className="min-h-[300px] rounded-2xl border-border/40 bg-background/50 font-medium leading-relaxed"
                />
                <p className="mt-4 text-xs text-muted-foreground flex items-center gap-2">
                    <Info className="w-3 h-3" />
                    This policy is critical for legal compliance and user safety.
                </p>
            </Card>

            {/* Impressum Section */}
            <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-3xl shadow-xl">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-black text-foreground">Impressum (Legal Notice)</h2>
                        <p className="text-muted-foreground font-medium">Manage the legal information required by German Law.</p>
                    </div>
                    {isDirty('impressum') && (
                        <Button
                            onClick={() => handleSave('impressum')}
                            disabled={isSaving !== null}
                            className="rounded-full px-6 animate-in fade-in zoom-in duration-300"
                        >
                            {isSaving === 'impressum' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Impressum
                        </Button>
                    )}
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
                    {isDirty('landing_sample_story') && (
                        <Button
                            onClick={() => handleSave('landing_sample_story')}
                            disabled={isSaving !== null}
                            className="rounded-full px-6 animate-in fade-in zoom-in duration-300"
                        >
                            {isSaving === 'landing_sample_story' ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Story
                        </Button>
                    )}
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
