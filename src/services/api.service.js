import api from '@/utils/api';

/**
 * Authentication API calls
 */
export const authAPI = {
    register: async (email, password, username, role) => {
        const response = await api.post('/auth/register', { email, password, username, role });
        return response.data;
    },

    login: async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        return response.data;
    },

    logout: async () => {
        // Backend doesn't strictly require a logout call for JWT, but good for future
        // const response = await api.post('/auth/logout'); 
        // return response.data;
        return { message: 'Logged out' };
    },

    getCurrentUser: async () => {
        const response = await api.get('/auth/me');
        return response.data;
    },

    sync: async (token, provider) => {
        // We pass token in headers via interceptor, but we can also pass explicitly
        // If provider is passed, we explicitly send it to help backend validation
        const body = provider ? { authProvider: provider } : {};
        const response = await api.post('/auth/sync', body, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    },

    updateProfile: async (userData) => {
        const response = await api.put('/auth/profile', userData);
        return response.data;
    },

    deleteAccount: async () => {
        const response = await api.delete('/auth/delete-account');
        return response.data;
    },
    undoDeleteAccount: async () => {
        const response = await api.post('/auth/undo-delete');
        return response.data;
    }
};

/**
 * Stories API calls (mapped to backend /stories)
 */
export const postsAPI = {
    getPosts: async (params = {}) => {
        // Backend expects: page, limit, sort, country, category
        const response = await api.get('/stories', { params });
        return response.data;
    },

    getPost: async (id) => {
        const response = await api.get(`/stories/${id}`);
        return response.data;
    },

    createPost: async (postData) => {
        const response = await api.post('/stories', postData);
        return response.data;
    },

    updatePost: async () => {
        // Backend might not have PUT /stories/:id implemented yet? 
        // Checked backend: NO update endpoint. Only delete.
        // Assuming update is not available or ignored for now.
        console.warn('Update story not supported by backend yet');
        return {};
    },

    deletePost: async (id) => {
        const response = await api.delete(`/stories/${id}`);
        return response.data;
    },

    votePost: async (id, voteType) => {
        const response = await api.post(`/stories/${id}/vote`, { voteType }); // voteType: 'upvote' | 'downvote'
        return response.data;
    },

    getMyStories: async (params = {}) => {
        const response = await api.get('/stories/my-stories', { params });
        return response.data;
    },

    updateStory: async (id, data) => {
        const response = await api.put(`/stories/${id}`, data);
        return response.data;
    },

    // Changed signature to generic Translate API
    translateText: async (text, targetLang) => {
        const response = await api.post('/translate', { text, targetLang });
        return response.data; // { original, translated, targetLang }
    }
};

/**
 * Comments API calls
 */
export const commentsAPI = {
    getComments: async (postId) => {
        const response = await api.get(`/stories/${postId}/comments`);
        return response.data;
    },

    createComment: async (postId, text) => {
        const response = await api.post(`/stories/${postId}/comments`, { text });
        return response.data;
    },

    deleteComment: async (commentId) => {
        const response = await api.delete(`/comments/${commentId}`);
        return response.data;
    },

    voteComment: async (commentId, voteType) => {
        const response = await api.post(`/comments/${commentId}/vote`, { voteType });
        return response.data;
    }
};

/**
 * Reports API calls
 */
export const reportsAPI = {
    createReport: async (postId, reason) => {
        const response = await api.post(`/stories/${postId}/report`, { reason });
        return response.data;
    }
};

/**
 * Admin API calls
 */
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getAllStories: async (params = {}) => {
        const response = await api.get('/admin/stories', { params });
        return response.data;
    },

    updateStoryStatus: async (storyId, status) => {
        const response = await api.put(`/admin/stories/${storyId}/status`, { status });
        return response.data;
    },

    deleteStory: async (storyId) => {
        const response = await api.delete(`/admin/stories/${storyId}`);
        return response.data;
    },

    getAllUsers: async (params = {}) => {
        const response = await api.get('/admin/users', { params });
        return response.data;
    },

    toggleBlockUser: async (userId) => {
        const response = await api.put(`/admin/users/${userId}/block`);
        return response.data;
    },

    getReports: async (params = {}) => {
        const response = await api.get('/admin/reports', { params });
        return response.data;
    },

    updateReportStatus: async (reportId, status, adminNote) => {
        const response = await api.put(`/admin/reports/${reportId}`, { status, adminNote });
        return response.data;
    },

    deleteReportedPost: async (storyId) => {
        // Usually deletion of story handles associated reports cleanup or we call deleteStory
        const response = await api.delete(`/admin/stories/${storyId}`);
        return response.data;
    }
};

/**
 * Settings API calls
 */
export const settingsAPI = {
    getSettings: async () => {
        const response = await api.get('/settings');
        return response.data;
    },
    getSetting: async (key) => {
        const response = await api.get(`/settings/${key}`);
        return response.data;
    },
    updateSetting: async (key, value, description) => {
        const response = await api.put(`/settings/${key}`, { value, description });
        return response.data;
    }
};

/**
 * Block API calls
 */
export const blockAPI = {
    blockUser: async (userId) => {
        const response = await api.post(`/block/${userId}`);
        return response.data;
    },
    unblockUser: async (userId) => {
        const response = await api.delete(`/block/${userId}`);
        return response.data;
    },
    getBlockedUsers: async () => {
        const response = await api.get('/block');
        return response.data;
    }
};
