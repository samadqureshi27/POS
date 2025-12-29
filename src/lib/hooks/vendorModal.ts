import { VendorItem, VendorFormData } from "@/lib/types/vendors";
import { useEntityModal } from "./useEntityModal";

/**
 * Vendor Modal Hook - Refactored to use generic useEntityModal
 * Note: Accepts branchId parameter (currently not used in form, but kept for future use)
 */
export const useVendorModal = (branchId: number) => {
    return useEntityModal<VendorItem, VendorFormData>({
        defaultFormData: {
            Company_Name: "",
            Name: "",
            Contact: "",
            Address: "",
            Email: "",
        },
        mapItemToForm: (item) => ({
            Company_Name: item.Company_Name,
            Name: item.Name,
            Contact: item.Contact,
            Address: item.Address,
            Email: item.Email,
        }),
        hasBodyScrollLock: false, // Vendor modal doesn't use body scroll lock
    });
};
