import { useState } from 'react';
import toast from 'react-hot-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Check, Copy, Facebook, Twitter, Linkedin, Mail } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, postId, profession, country }) {
    const [copied, setCopied] = useState(false);
    const url = `${window.location.origin}/post/${postId}`;

    const attributionText = `Anonymous • ${profession} • ${country} | Shared via JobCrap`;

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            toast.success('Link copied to clipboard!');
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            toast.error('Failed to copy link');
        }
    };

    const shareLinks = [
        {
            name: 'X (Twitter)',
            icon: Twitter,
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(attributionText)}`,
            color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
        },
        {
            name: 'Facebook',
            icon: Facebook,
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
            color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
        },
        {
            name: 'LinkedIn',
            icon: Linkedin,
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
            color: 'hover:bg-blue-50 dark:hover:bg-blue-950'
        },
        {
            name: 'Email',
            icon: Mail,
            url: `mailto:?subject=${encodeURIComponent('Workplace story from JobCrap')}&body=${encodeURIComponent(attributionText + '\n\n' + url)}`,
            color: 'hover:bg-gray-100 dark:hover:bg-gray-800'
        }
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="dark:text-white">Share this story</DialogTitle>
                    <DialogDescription className="dark:text-gray-400">
                        Share this story with others on social media or copy the link
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 pt-4">
                    {/* Copy Link */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Copy Link
                        </label>
                        <div className="flex gap-2">
                            <Input
                                value={url}
                                readOnly
                                className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                                onClick={(e) => e.target.select()}
                            />
                            <Button
                                onClick={handleCopy}
                                className={copied ? 'bg-green-600 hover:bg-green-700' : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'}
                            >
                                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </Button>
                        </div>
                    </div>

                    {/* Social Share */}
                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Share on Social Media
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {shareLinks.map(link => (
                                <a
                                    key={link.name}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={`flex items-center justify-center gap-2 p-3 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors ${link.color}`}
                                >
                                    <link.icon className="w-5 h-5 dark:text-white" />
                                    <span className="font-medium text-sm dark:text-white">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
