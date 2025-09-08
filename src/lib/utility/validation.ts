// utils/validation.ts
import { RestaurantData } from '../../types/types';

export const validateRestaurantForm = (formData: RestaurantData) => {
    const requiredFields = ["name", "type", "contact", "email", "address"];
    const missingFields = requiredFields.filter(
        (field) => !formData[field as keyof RestaurantData]
    );

    if (missingFields.length > 0) {
        return { isValid: false, message: "Please fill in all required fields" };
    }

    if (!formData.email.includes("@")) {
        return { isValid: false, message: "Please enter a valid email address" };
    }

    return { isValid: true, message: "" };
};