import { PaymentMethod, ModalFormData } from "@/lib/types/payment";
import { useEntityModal } from "./useEntityModal";

/**
 * Payment Modal Hook - Refactored to use generic useEntityModal
 */
export const usePaymentModal = () => {
  const modal = useEntityModal<PaymentMethod, ModalFormData>({
    defaultFormData: {
      Name: "",
      PaymentType: "Cash",
      TaxType: "",
      TaxPercentage: 0,
      Status: "Active",
      CreatedDate: new Date().toISOString().split('T')[0],
      LastUsed: new Date().toISOString().split('T')[0],
    },
    mapItemToForm: (item) => ({
      Name: item.Name,
      PaymentType: item.PaymentType,
      TaxType: item.TaxType,
      TaxPercentage: item.TaxPercentage,
      Status: item.Status,
      CreatedDate: item.CreatedDate,
      LastUsed: item.LastUsed,
    }),
    hasBodyScrollLock: true,
  });

  // Return all properties including setFormData for backward compatibility
  return {
    ...modal,
    setFormData: modal.updateFormData,
  };
};
