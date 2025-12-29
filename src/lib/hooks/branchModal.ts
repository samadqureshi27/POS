// lib/hooks/BranchModal.ts
import { BranchItem, BranchModalFormData } from "@/lib/types/branch";
import { useEntityModal } from "./useEntityModal";

/**
 * Branch Modal Hook - Refactored to use generic useEntityModal
 * Reduces code duplication while maintaining type safety
 */
export const useBranchModal = () => {
    return useEntityModal<BranchItem, BranchModalFormData>({
        defaultFormData: {
            Branch_Name: "",
            Status: "Active",
            "Contact-Info": "",
            Address: "",
            email: "",
            postalCode: "",
        },
        mapItemToForm: (item) => ({
            Branch_Name: item.Branch_Name,
            Status: item.Status,
            "Contact-Info": item["Contact-Info"],
            Address: item.Address,
            email: item.email,
            postalCode: item.postalCode,
        }),
        hasBodyScrollLock: true,
    });
};
