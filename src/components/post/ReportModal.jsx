import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { reportsAPI } from '@/services/api.service';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

const REPORT_REASONS = [
    'Spam or misleading',
    'Harassment or hate speech',
    'Violence or dangerous content',
    'False information',
    'Inappropriate content',
    'Privacy violation',
    'Copyright violation',
    'Other'
];

export default function ReportModal({ isOpen, onClose, postId }) {
    const { isAuthenticated } = useAuthStore();
    const [selectedReason, setSelectedReason] = useState('');
    const [additionalInfo, setAdditionalInfo] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to report');
            onClose();
            return;
        }

        if (!selectedReason) {
            toast.error('Please select a reason');
            return;
        }

        setIsSubmitting(true);

        try {
            const fullReason = additionalInfo
                ? `${selectedReason}: ${additionalInfo}`
                : selectedReason;

            await reportsAPI.createReport(postId, fullReason);

            toast.success('Report submitted successfully. Our team will review it shortly.');
            setSelectedReason('');
            setAdditionalInfo('');
            onClose();
        } catch (error) {
            console.error('Failed to submit report:', error);
            if (error.response?.data?.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('Failed to submit report. Please try again.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-md dark:bg-gray-900 dark:border-gray-800">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-gray-900 dark:text-white">
                        <AlertTriangle className="w-5 h-5 text-orange-500" />
                        Report Post
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                            Why are you reporting this post?
                        </p>
                        <div className="space-y-2">
                            {REPORT_REASONS.map((reason) => (
                                <label
                                    key={reason}
                                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${selectedReason === reason
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950 dark:border-blue-600'
                                        : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                >
                                    <input
                                        type="radio"
                                        name="reason"
                                        value={reason}
                                        checked={selectedReason === reason}
                                        onChange={(e) => setSelectedReason(e.target.value)}
                                        className="mr-3"
                                    />
                                    <span className="text-sm text-gray-900 dark:text-white">{reason}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                            Additional information (optional)
                        </label>
                        <Textarea
                            placeholder="Provide more details..."
                            value={additionalInfo}
                            onChange={(e) => setAdditionalInfo(e.target.value)}
                            rows={3}
                            className="dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        />
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t dark:border-gray-800">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        className="flex-1 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-white"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Report'}
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
