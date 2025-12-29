import { PosItem, PosModalFormData } from "@/lib/types/pos";
import { useEntityModal } from "./useEntityModal";

/**
 * POS Modal Hook - Refactored to use generic useEntityModal
 * Note: Accepts branchId parameter for new POS creation
 */
export const usePosModal = (branchId: string) => {
    return useEntityModal<PosItem, PosModalFormData>({
        defaultFormData: {
            POS_Name: "",
            Status: "active",
            Branch_ID_fk: branchId,
            machineId: "",
            metadata: {},
        },
        mapItemToForm: (item) => ({
            POS_Name: item.POS_Name,
            Status: item.Status,
            Branch_ID_fk: item.Branch_ID_fk,
            machineId: item.machineId || "",
            metadata: item.metadata || {},
        }),
        hasBodyScrollLock: false, // POS modal doesn't use body scroll lock
    });
};
