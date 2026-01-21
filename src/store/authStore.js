import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { auth, googleProvider } from '@/utils/firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged, updateProfile as firebaseUpdateProfile, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { authAPI } from '@/services/api.service';
import toast from 'react-hot-toast';

/**
 * Authentication Store
 * Manages user authentication state globally
 */
export const useAuthStore = create(
    persist(
        (set, get) => ({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            isLoggingIn: false, // Flag to prevent duplicate toasts
            error: null,

            login: async (email, password) => {
                set({ isLoading: true, error: null, isLoggingIn: true });
                try {
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);

                    // Verify with backend immediately before returning success
                    const token = await userCredential.user.getIdToken();

                    try {
                        const syncResponse = await authAPI.sync(token, 'local');
                        const user = syncResponse.data;
                        // State update will also happen via onAuthStateChanged, but we set it here to be safe
                        set({ user, token, isAuthenticated: true, isLoading: false, error: null, isLoggingIn: false });
                        return true;
                    } catch (syncError) {
                        // If blocked (403) or other server error, valid firebase login but invalid app login
                        if (syncError.response && syncError.response.status === 403) {
                            await signOut(auth);
                            throw new Error('Your account has been suspended by the administrator.'); // Unify message
                        }
                        // For other errors, we might still want to allow login if it's just a network glitch? 
                        // But for security, let's deny if we can't sync.
                        throw syncError;
                    }
                } catch (error) {
                    console.error('Login Error:', error);
                    set({
                        error: error.message || 'Login failed',
                        isLoading: false,
                        isLoggingIn: false
                    });
                    return false;
                }
            },

            loginWithGoogle: async () => {
                set({ isLoading: true, error: null, isLoggingIn: true });
                try {
                    const userCredential = await signInWithPopup(auth, googleProvider);

                    // Verify with backend immediately
                    const token = await userCredential.user.getIdToken();
                    try {
                        const syncResponse = await authAPI.sync(token, 'google');
                        const user = syncResponse.data;
                        set({ user, token, isAuthenticated: true, isLoading: false, error: null, isLoggingIn: false });
                        return true;
                    } catch (syncError) {
                        if (syncError.response && syncError.response.status === 403) {
                            await signOut(auth);
                            throw new Error('Your account has been suspended by the administrator.');
                        }
                        throw syncError;
                    }
                } catch (error) {
                    console.error('Google Login Error:', error);
                    set({
                        error: error.message || 'Google login failed',
                        isLoading: false,
                        isLoggingIn: false
                    });
                    return false;
                }
            },

            register: async (email, password, username) => {
                set({ isLoading: true, error: null });
                try {
                    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                    await firebaseUpdateProfile(userCredential.user, { displayName: username });
                    // onAuthStateChanged handled in initialize()
                    return true;
                } catch (error) {
                    console.error('Registration Error:', error);
                    set({
                        error: error.message || 'Registration failed',
                        isLoading: false
                    });
                    return false;
                }
            },

            changePassword: async (currentPassword, newPassword) => {
                set({ isLoading: true, error: null });
                try {
                    const user = auth.currentUser;
                    if (!user) throw new Error('No user logged in');

                    // Re-authenticate first (Firebase security requirement)
                    const credential = EmailAuthProvider.credential(user.email, currentPassword);
                    await reauthenticateWithCredential(user, credential);

                    // Update password
                    await updatePassword(user, newPassword);

                    set({ isLoading: false });
                    return true;
                } catch (error) {
                    console.error('Change Password Error:', error);
                    let message = 'Failed to change password';
                    if (error.code === 'auth/wrong-password') message = 'Current password is incorrect';
                    if (error.code === 'auth/weak-password') message = 'New password is too weak';

                    set({
                        error: error.message || message,
                        isLoading: false
                    });
                    return false;
                }
            },

            logout: async () => {
                try {
                    await signOut(auth);
                    set({ user: null, token: null, isAuthenticated: false });
                } catch (error) {
                    console.error('Logout error:', error);
                }
            },

            updateUser: (userData) => {
                set({ user: { ...get().user, ...userData } });
            },

            syncProfile: async (userData) => {
                try {
                    set({ isLoading: true });
                    const response = await authAPI.updateProfile(userData);
                    set({ user: response.data, isLoading: false });
                    return true;
                } catch (error) {
                    console.error('Update Profile Error:', error);
                    set({ error: error.message, isLoading: false });
                    return false;
                }
            },

            initialize: () => {
                set({ isLoading: true });
                return onAuthStateChanged(auth, async (firebaseUser) => {
                    if (firebaseUser) {
                        try {
                            const token = await firebaseUser.getIdToken();
                            // Sync with backend on every refresh/auth change to ensure user exists

                            // Determine provider
                            let provider = 'email';
                            if (firebaseUser.providerData.length > 0) {
                                const providerId = firebaseUser.providerData[0].providerId;
                                if (providerId === 'google.com') provider = 'google';
                            }

                            const syncResponse = await authAPI.sync(token, provider);
                            const user = syncResponse.data;
                            set({ user, token, isAuthenticated: true, isLoading: false });
                        } catch (error) {
                            console.error('Auth Initialization Sync Error:', error);

                            // If blocked (403), force logout from Firebase
                            if (error.response && error.response.status === 403) {
                                await signOut(auth);
                                const errorMsg = 'Your account has been suspended by the administrator.';
                                set({
                                    user: null,
                                    token: null,
                                    isAuthenticated: false,
                                    isLoading: false,
                                    error: errorMsg
                                });
                                // Only show toast if NOT currently logging in (suppress duplicate)
                                if (!get().isLoggingIn) {
                                    toast.error(errorMsg, { duration: 5000 });
                                }
                            } else {
                                set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                            }
                        }
                    } else {
                        set({ user: null, token: null, isAuthenticated: false, isLoading: false });
                    }
                });
            },


            setUser: (user) => set({ user }),

            clearError: () => set({ error: null }),
        }),
        {
            name: 'auth-storage',
            partialize: (state) => ({
                user: state.user,
                token: state.token,
                isAuthenticated: state.isAuthenticated
            }), // Only persist these fields
        }
    )
);
