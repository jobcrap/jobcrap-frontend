import { useMutation } from '@tanstack/react-query';
import { authAPI } from '@/services/api.service';
import { useAuthStore } from '@/store/authStore';
import toast from 'react-hot-toast';

export const useUpdateProfile = () => {
    const updateUser = useAuthStore((state) => state.updateUser);
    return useMutation({
        mutationFn: (userData) => authAPI.updateProfile(userData),
        onSuccess: (data) => {
            if (data.success) {
                updateUser(data.data);
                toast.success('Profile updated successfully!');
            }
        },
        onError: (error) => {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        },
    });
};
