// hooks/useRestaurantProfile.ts
import { useState, useEffect, useCallback } from 'react';
import { RestaurantData } from '@/lib/types';
import { RestaurantAPI } from '../util/restaurant-api';
import { validateRestaurantForm } from '../util/validation';
import { Toast } from "@/lib/util/toast-helpers";

export const useRestaurantProfile = () => {
    const [formData, setFormData] = useState<RestaurantData>({
        name: "",
        type: "",
        ownerName: "",
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
    

    const loadProfile = useCallback(async () => {
        try {
            setLoading(true);
            const response = await RestaurantAPI.getProfile();
            if (!response.success) throw new Error(response.message);
            setFormData((prev) => ({ ...prev, ...response.data }));
        } catch {
            Toast.error("Failed to load restaurant profile");
        } finally {
            setLoading(false);
        }
    }, []);

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
                Toast.error("File size must be less than 5MB");
                return;
            }
            setFormData((prev) => ({ ...prev, logo: file }));
            setPreviewUrl(URL.createObjectURL(file));
            setHasChanges(true);
            Toast.success("Logo uploaded successfully!");
        }
    }, []);

    const removeLogo = useCallback(() => {
        setFormData((prev) => ({ ...prev, logo: null }));
        setPreviewUrl(null);
        setHasChanges(true);
        Toast.success("Logo removed successfully");
    }, []);

    const handleSave = useCallback(async () => {
        const validation = validateRestaurantForm(formData);
        if (!validation.isValid) {
            Toast.error(validation.message);
            return;
        }

        try {
            setSaving(true);
            const { logo, ...dataToSave } = formData;
            const response = await RestaurantAPI.updateProfile(dataToSave);
            if (response.success) {
                setHasChanges(false);
                Toast.success(response.message || "Restaurant profile updated successfully! ✨");
            }
        } catch {
            Toast.error("Failed to save restaurant profile");
        } finally {
            setSaving(false);
        }
    }, [formData]);

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