import { Card } from '@/components/ui/card';
import { Scale, Shield } from 'lucide-react';

export default function Terms() {
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                    <Scale className="w-10 h-10 text-blue-600" />
                    <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                        Terms of Service
                    </h1>
                </div>
                <p className="text-gray-600 dark:text-gray-400">
                    Last updated: December 2024
                </p>
            </div>

            <div className="space-y-6">
                {/* Agreement */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Agreement to Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        By accessing or using WorkStories, you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
                    </p>
                </Card>

                {/* Account Requirements */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Registration</h2>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>You must be at least 16 years old to use this service</li>
                        <li>You must provide accurate and complete information</li>
                        <li>You are responsible for maintaining account security</li>
                        <li>You must not create multiple accounts</li>
                        <li>One person or legal entity may maintain only one account</li>
                    </ul>
                </Card>

                {/* Content Guidelines */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Content Guidelines</h2>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <p className="font-semibold text-gray-900 dark:text-white">You agree NOT to post content that:</p>
                        <ul className="list-disc list-inside space-y-2">
                            <li>Violates laws or regulations</li>
                            <li>Infringes on intellectual property rights</li>
                            <li>Contains hate speech, harassment, or discrimination</li>
                            <li>Includes personal information of others without consent</li>
                            <li>Is spam, advertising, or promotional material</li>
                            <li>Contains malware or malicious code</li>
                            <li>Impersonates others or misrepresents affiliations</li>
                        </ul>
                        <p className="mt-3">
                            <strong>Required:</strong> Use trigger warnings for sensitive content (violence, trauma, mental health, etc.)
                        </p>
                    </div>
                </Card>

                {/* User Conduct */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">User Conduct</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">You agree to:</p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Share authentic professional experiences</li>
                        <li>Respect other users and their stories</li>
                        <li>Use voting features responsibly</li>
                        <li>Report inappropriate content or behavior</li>
                        <li>Maintain civility in comments and interactions</li>
                    </ul>
                </Card>

                {/* Intellectual Property */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Intellectual Property</h2>
                    <div className="space-y-3 text-gray-700 dark:text-gray-300">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Your Content</h3>
                            <p>You retain ownership of content you post. By posting, you grant us a worldwide, non-exclusive license to use, display, and distribute your content on our platform.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Our Platform</h3>
                            <p>WorkStories, our logo, and all related marks are our property. You may not use them without permission.</p>
                        </div>
                    </div>
                </Card>

                {/* Moderation */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Content Moderation</h2>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                        We reserve the right to:
                    </p>
                    <ul className="list-disc list-inside space-y-2 text-gray-700 dark:text-gray-300">
                        <li>Review and moderate all content</li>
                        <li>Remove content that violates these terms</li>
                        <li>Suspend or terminate accounts for violations</li>
                        <li>Block users from the platform</li>
                        <li>Report illegal activity to authorities</li>
                    </ul>
                </Card>

                {/* Disclaimers */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Disclaimers</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        WorkStories is provided "as is" without warranties of any kind. We do not guarantee accuracy, availability, or reliability. User-generated content represents individual opinions, not our views.
                    </p>
                </Card>

                {/* Limitation of Liability */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Limitation of Liability</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the service. Our total liability shall not exceed the amount you paid us in the past 12 months (currently $0 for free accounts).
                    </p>
                </Card>

                {/* Changes to Terms */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Changes to Terms</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        We may update these terms from time to time. We will notify users of significant changes via email or platform notice. Continued use after changes constitutes acceptance.
                    </p>
                </Card>

                {/* Termination */}
                <Card className="p-6 bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">Account Termination</h2>
                    <p className="text-gray-700 dark:text-gray-300">
                        You may delete your account at any time from your Profile page. We may terminate or suspend your account for violations of these terms. Upon termination, your content may be removed.
                    </p>
                </Card>

                {/* Contact */}
                <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-900">
                    <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-200 mb-3">Contact Us</h2>
                    <p className="text-blue-800 dark:text-blue-300">
                        Questions about these Terms? Contact us at:{' '}
                        <a href="mailto:legal@workstories.com" className="font-semibold underline">
                            legal@workstories.com
                        </a>
                    </p>
                </Card>
            </div>
        </div>
    );
}
