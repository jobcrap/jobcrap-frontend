import { POST_LIMITS } from './constants';

/**
 * Validate email format
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Validate password strength
 */
export const validatePassword = (password) => {
    return password.length >= 6;
};

/**
 * Count words in text
 */
export const countWords = (text) => {
    if (!text) return 0;
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

/**
 * Validate post content
 */
export const validatePostContent = (text) => {
    const errors = {};

    if (!text || text.trim().length === 0) {
        errors.text = `Post content cannot be empty`;
        return errors;
    }

    const wordCount = countWords(text);
    if (wordCount > POST_LIMITS.MAX_WORDS) {
        errors.text = `Your story is too long. Please keep it under ${POST_LIMITS.MAX_WORDS} words.`;
    }

    if (text.length > POST_LIMITS.MAX_CHARACTERS) {
        errors.text = `Your story is too long for our technical systems. Please shorten it.`;
    }

    return errors;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text, maxLength) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
};

/**
 * Format date to readable format
 */
export const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffInSeconds = Math.floor((now - postDate) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return postDate.toLocaleDateString();
};
