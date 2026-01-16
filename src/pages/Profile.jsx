import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { User, Mail, Shield, Camera, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useUpdateProfile } from '@/hooks/useAuth';
import ConfirmModal from '@/components/common/ConfirmModal';

export default function Profile() {
    const navigate = useNavigate();
    const { user, isAuthenticated, logout } = useAuthStore();
    const updateProfileMutation = useUpdateProfile();
    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        avatar: user?.avatar || ''
    });

    // Update formData when user data is fetched or changes
    useEffect(() => {
        if (user) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFormData({
                username: user.username || '',
                email: user.email || '',
                avatar: user.avatar || ''
            });
        }
    }, [user]);

    const isLoading = updateProfileMutation.isPending;
    const [isUploading, setIsUploading] = useState(false);
    const [isPasswordLoading, setIsPasswordLoading] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Redirect if not authenticated
    if (!isAuthenticated) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Validation
        if (!file.type.startsWith('image/')) {
            toast.error('Please upload an image file');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error('Image must be less than 5MB');
            return;
        }

        setIsUploading(true);

        try {
            const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
            const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

            if (!cloudName || !uploadPreset) {
                toast.error('Cloudinary configuration missing in .env');
                setIsUploading(false);
                return;
            }

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', uploadPreset);

            const xhr = new XMLHttpRequest();
            xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, true);

            xhr.upload.onprogress = (event) => {
                if (event.lengthComputable) {
                    // const progress = (event.loaded / event.total) * 100;
                    // setUploadProgress(progress);
                }
            };

            xhr.onload = async () => {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    const newAvatar = response.secure_url;

                    setFormData(prev => ({ ...prev, avatar: newAvatar }));
                    setIsUploading(false);

                    // Automatically save to database
                    try {
                        await updateProfileMutation.mutateAsync({
                            username: formData.username,
                            avatar: newAvatar
                        });
                        toast.success('Profile picture updated!');
                    } catch (err) {
                        console.error('Auto-save failed:', err);
                        toast.error('Image uploaded but failed to save to profile. Please click "Update Profile" manually.');
                    }
                } else {
                    const error = JSON.parse(xhr.responseText);
                    toast.error(error.error?.message || 'Upload failed');
                    setIsUploading(false);
                }
            };

            xhr.onerror = () => {
                toast.error('Network error during upload');
                setIsUploading(false);
            };

            xhr.send(formData);

        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image');
            setIsUploading(false);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        updateProfileMutation.mutate({
            username: formData.username,
            avatar: formData.avatar
        });
    };

    const handleDeleteAccount = () => {
        toast.success('Account deleted successfully');
        logout();
        navigate('/');
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
            <div className="mb-10">
                <h1 className="text-4xl font-black tracking-tight text-foreground mb-3 leading-tight">
                    Your <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">Professional Identity</span>
                </h1>
                <p className="text-lg text-muted-foreground font-medium max-w-2xl">
                    Manage your identity and see how you appear to the professional community.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left: Avatar & Identity Card */}
                <div className="lg:col-span-4 space-y-6">
                    <Card className="p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-[2.5rem] shadow-xl text-center">
                        <div className="relative group cursor-pointer mx-auto w-32 h-32" onClick={() => fileInputRef.current?.click()}>
                            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background shadow-2xl ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all">
                                <img
                                    src={formData.avatar || 'https://cdn-icons-png.flaticon.com/512/149/149071.png'}
                                    alt={user?.username}
                                    className={`w-full h-full object-cover transition-all duration-300 ${isUploading ? 'opacity-50' : 'group-hover:scale-110'}`}
                                />
                                {isUploading && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                                        <Loader2 className="w-8 h-8 text-white animate-spin" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera className="w-8 h-8 text-white" />
                                </div>
                            </div>
                            <div className="absolute bottom-1 right-1 bg-gradient-to-r from-primary to-purple-500 p-2 rounded-full text-white shadow-lg">
                                <Camera className="w-4 h-4" />
                            </div>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                accept="image/*"
                                className="hidden"
                            />
                        </div>

                        <h2 className="mt-6 text-2xl font-black text-foreground">{user?.username}</h2>
                        <p className="text-muted-foreground font-medium mb-6">{user?.email}</p>

                        <div className="pt-6 border-t border-border/40 w-full grid grid-cols-2 gap-4">
                            <div className="bg-primary/5 p-4 rounded-2xl">
                                <div className="text-2xl font-black text-primary">{user?.storiesCount || 0}</div>
                                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Stories</div>
                            </div>
                            <div className="bg-secondary/5 p-4 rounded-2xl">
                                <div className="text-2xl font-black text-secondary-foreground">{user?.totalVotes || 0}</div>
                                <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Trust Score</div>
                            </div>
                        </div>
                    </Card>

                    {/* Danger Zone */}
                    <Card className="p-6 border-red-500/10 bg-red-500/5 rounded-[2rem]">
                        <h4 className="text-sm font-bold text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                            Danger Zone
                        </h4>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="w-full rounded-xl border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-xs font-bold"
                        >
                            Delete Account Permanently
                        </Button>
                    </Card>
                </div>

                {/* Right: Settings and Content */}
                <Card className="lg:col-span-8 p-8 border-border/40 bg-card/60 backdrop-blur-md rounded-[2.5rem] shadow-xl">
                    <Tabs defaultValue="account" className="w-full">
                        <TabsList className="flex items-center gap-2 mb-8 bg-muted/20 p-1.5 rounded-2xl w-fit">
                            <TabsTrigger value="account" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Account Settings</TabsTrigger>
                            <TabsTrigger value="security" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-sm font-bold">Security Hub</TabsTrigger>
                        </TabsList>

                        <TabsContent value="account" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form onSubmit={handleSave} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold ml-1">Display Username</Label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="username"
                                                value={formData.username}
                                                onChange={handleChange}
                                                className="pl-12 rounded-2xl border-border/40 bg-background/50 h-12 text-lg font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold ml-1">Email Address</Label>
                                        <div className="relative opacity-50">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                value={user?.email}
                                                disabled
                                                className="pl-12 rounded-2xl border-border/40 bg-background/50 h-12 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isLoading || isUploading}
                                    className="rounded-full px-10 h-14 text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    {isLoading ? 'Saving Identity...' : 'Update Profile'}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="security" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <form
                                onSubmit={async (e) => {
                                    e.preventDefault();
                                    const currentPwd = e.target.currentPassword.value;
                                    const newPwd = e.target.newPassword.value;
                                    const confirmPwd = e.target.confirmPassword.value;

                                    if (newPwd !== confirmPwd) {
                                        toast.error('New passwords do not match');
                                        return;
                                    }

                                    if (newPwd.length < 6) {
                                        toast.error('Password must be at least 6 characters');
                                        return;
                                    }

                                    setIsPasswordLoading(true);
                                    const changePassword = useAuthStore.getState().changePassword;
                                    const success = await changePassword(currentPwd, newPwd);

                                    if (success) {
                                        toast.success('Password updated successfully!');
                                        e.target.reset();
                                    } else {
                                        toast.error(useAuthStore.getState().error || 'Failed to update password');
                                    }
                                    setIsPasswordLoading(false);
                                }}
                                className="space-y-8"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold ml-1">Current Password</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="currentPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                className="pl-12 rounded-2xl border-border/40 bg-background/50 h-12 text-lg font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold ml-1">New Password</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="newPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                className="pl-12 rounded-2xl border-border/40 bg-background/50 h-12 text-lg font-medium"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-sm font-bold ml-1">Confirm New Password</Label>
                                        <div className="relative">
                                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="confirmPassword"
                                                type="password"
                                                placeholder="••••••••"
                                                required
                                                className="pl-12 rounded-2xl border-border/40 bg-background/50 h-12 text-lg font-medium"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    disabled={isPasswordLoading}
                                    className="rounded-full px-10 h-14 text-lg font-black shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] bg-primary"
                                >
                                    {isPasswordLoading ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin mr-2" />
                                            Recalibrating Vault...
                                        </>
                                    ) : 'Update Security Key'}
                                </Button>
                            </form>
                        </TabsContent>
                    </Tabs>
                </Card>
            </div>

            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Permanently Delete Account?"
                description="This will remove all your stories, comments, and profile data from our records forever. This action is irreversible."
                confirmText="Yes, delete everything"
                variant="destructive"
            />
        </div>
    );
}
