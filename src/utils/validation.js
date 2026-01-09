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
 * Count sentences in text
 */
export const countSentences = (text) => {
    if (!text) return 0;
    const sentences = text.match(/[^.!?]+[.!?]+/g);
    return sentences ? sentences.length : 0;
};

/**
 * Validate post content
 */
export const validatePostContent = (text) => {
    const errors = {};

    if (!text || text.trim().length === 0) {
        errors.text = `Post content cannot be empty`;
    }

    if (text && text.length > POST_LIMITS.MAX_CHARACTERS) {
        errors.text = `Post cannot exceed ${POST_LIMITS.MAX_CHARACTERS} characters`;
    }

    const sentenceCount = countSentences(text);
    if (sentenceCount > POST_LIMITS.MAX_SENTENCES) {
        errors.sentences = `Post cannot exceed ${POST_LIMITS.MAX_SENTENCES} sentences`;
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
