// hooks/useRestaurantProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { RestaurantData } from '../../types/types';
import { RestaurantAPI } from '../util/restaurantApi';
import { validateRestaurantForm } from '../util/validation';
import { Toast } from '@/components/layout/UI/Toast';
import { useToast } from '../hooks/toast';

export const useRestaurantProfile = () => {
    const [formData, setFormData] = useState<RestaurantData>({
        name: "",
        type: "",
        contact: "",
        email: "",
        address: "",
        description: "",
        website: "",
        openingTime: "",
        closingTime: "",
        logo: null,
    });

    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const { showToast } = useToast();

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await RestaurantAPI.getProfile();
            if (!response.success) throw new Error(response.message);
            setFormData((prev) => ({ ...prev, ...response.data }));
        } catch {
            showToast("Failed to load restaurant profile", "error");
        } finally {
            setLoading(false);
        }
    }, [showToast]);

    const handleInputChange = useCallback((
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setHasChanges(true);
    }, []);

    const handleDropdownChange = useCallback((key: keyof RestaurantData, value: string) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        setHasChanges(true);
    }, []);

    const handleLogoChange = useCallback((file: File | null) => {
        if (file && file.type.startsWith("image/")) {
            if (file.size > 5 * 1024 * 1024) {
                showToast("File size must be less than 5MB", "error");
                return;
            }
            setFormData((prev) => ({ ...prev, logo: file }));
            setPreviewUrl(URL.createObjectURL(file));
            setHasChanges(true);
            showToast("Logo uploaded successfully!", "success");
        }
    }, [showToast]);

    const removeLogo = useCallback(() => {
        setFormData((prev) => ({ ...prev, logo: null }));
        setPreviewUrl(null);
        setHasChanges(true);
        showToast("Logo removed successfully", "success");
    }, [showToast]);

    const handleSave = useCallback(async () => {
        const validation = validateRestaurantForm(formData);
        if (!validation.isValid) {
            showToast(validation.message, "error");
            return;
        }

        try {
            setSaving(true);
            const { logo, ...dataToSave } = formData;
            const response = await RestaurantAPI.updateProfile(dataToSave);
            if (response.success) {
                setHasChanges(false);
                showToast(
                    response.message || "Restaurant profile updated successfully! ✨",
                    "success"
                );
            }
        } catch {
            showToast("Failed to save restaurant profile", "error");
        } finally {
            setSaving(false);
        }
    }, [formData, showToast]);

    const resetForm = useCallback(() => {
        loadProfile();
        setHasChanges(false);
    }, [loadProfile]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    return {
        formData,
        previewUrl,
        loading,
        saving,
        hasChanges,
        handleInputChange,
        handleDropdownChange,
        handleLogoChange,
        removeLogo,
        handleSave,
        resetForm,
    };
};