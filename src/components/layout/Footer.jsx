import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="border-t bg-gray-50 mt-auto">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* About */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">WorkStories</h3>
                        <p className="text-sm text-gray-600">
                            Share your professional stories with the world. Funny, sad, or quirky - every experience matters.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/" className="text-gray-600 hover:text-gray-900">
                                    Home
                                </Link>
                            </li>
                            <li>
                                <Link to="/create" className="text-gray-600 hover:text-gray-900">
                                    Share Story
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-600 hover:text-gray-900">
                                    About Us
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <Link to="/privacy" className="text-gray-600 hover:text-gray-900">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link to="/terms" className="text-gray-600 hover:text-gray-900">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/gdpr" className="text-gray-600 hover:text-gray-900">
                                    GDPR Compliance
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Contact</h3>
                        <p className="text-sm text-gray-600">
                            Have feedback or questions?
                        </p>
                        <a
                            href="mailto:support@workstories.com"
                            className="text-sm text-blue-600 hover:text-blue-700"
                        >
                            support@workstories.com
                        </a>
                    </div>
                </div>

                <div className="border-t mt-8 pt-6 text-center text-sm text-gray-600">
                    <p>&copy; {new Date().getFullYear()} WorkStories. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
