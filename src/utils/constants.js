// API Constants
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Categories for posts
export const CATEGORIES = [
    { value: 'dark', label: 'Dark', emoji: '🌑' },
    { value: 'funny', label: 'Funny', emoji: '😂' },
    { value: 'scary', label: 'Scary', emoji: '😱' },
    { value: 'heartbreaking', label: 'Heartbreaking', emoji: '💔' },
    { value: 'heartwarming', label: 'Heartwarming', emoji: '❤️' },
    { value: 'absurd', label: 'Absurd', emoji: '🤯' },
    { value: 'unbelievable', label: 'Unbelievable', emoji: '😲' },
    { value: 'disgusting', label: 'Disgusting', emoji: '🤢' },
    { value: 'spicy', label: 'Spicy', emoji: '🌶️' },
    { value: 'other', label: 'Other', emoji: '📝' }
];

// Trigger warnings
export const TRIGGER_WARNINGS = [
    { value: 'violence', label: 'Violence' },
    { value: 'trauma', label: 'Trauma' },
    { value: 'nudity', label: 'Nudity' },
    { value: 'mental_health', label: 'Mental Health' },
    { value: 'discrimination', label: 'Discrimination' },
    { value: 'substance_abuse', label: 'Substance Abuse' }
];

// Countries list (shortened - add more as needed)
export const COUNTRIES = [
    { value: 'US', label: 'United States' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'CA', label: 'Canada' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'ES', label: 'Spain' },
    { value: 'IT', label: 'Italy' },
    { value: 'IN', label: 'India' },
    { value: 'AU', label: 'Australia' },
    { value: 'BR', label: 'Brazil' },
    { value: 'JP', label: 'Japan' },
    { value: 'CN', label: 'China' },
    { value: 'MX', label: 'Mexico' },
    { value: 'NG', label: 'Nigeria' },
    { value: 'ZA', label: 'South Africa' }
];

// Languages for translation
export const LANGUAGES = [
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'es', name: 'Spanish', flag: '🇪🇸' },
    { code: 'fr', name: 'French', flag: '🇫🇷' },
    { code: 'de', name: 'German', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { code: 'nl', name: 'Dutch', flag: '🇳🇱' },
    { code: 'pl', name: 'Polish', flag: '🇵🇱' },
    { code: 'ru', name: 'Russian', flag: '🇷🇺' },
    { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
    { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
    { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', flag: '🇮🇳' }
];

// Post limits
export const POST_LIMITS = {
    MAX_CHARACTERS: 700,
    MAX_SENTENCES: 7,
    MIN_CHARACTERS: 1
};

// Pagination
export const POSTS_PER_PAGE = 20;
