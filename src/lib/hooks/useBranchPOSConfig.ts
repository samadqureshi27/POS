// src/lib/hooks/useBranchPOSConfig.ts

import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import {
  BranchPOSConfigService,
  type BranchPOSConfig,
  type ReceiptConfig,
  type PaymentMethods,
} from "@/lib/services/branch-pos-config-service";

export function useBranchPOSConfig(branchId: string) {
  const [config, setConfig] = useState<BranchPOSConfig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionLoading, setActionLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch POS configuration
  const fetchConfig = useCallback(async () => {
    if (!branchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await BranchPOSConfigService.getPOSConfig(branchId);

      if (response.success && response.data) {
        setConfig(response.data);
      } else {
        setError(response.message || "Failed to fetch POS configuration");
        toast.error(response.message || "Failed to fetch POS configuration");
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }, [branchId]);

  // Initial load
  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  // Update payment mode
  const updatePaymentMode = useCallback(
    async (paymentMode: "payNow" | "payLater", enableTableService: boolean) => {
      if (!branchId) return;

      try {
        setActionLoading(true);
        const response = await BranchPOSConfigService.updatePaymentMode(
          branchId,
          paymentMode,
          enableTableService
        );

        if (response.success) {
          toast.success(`Payment mode updated to ${paymentMode === "payNow" ? "Pay Now" : "Pay Later"}`);
          await fetchConfig(); // Refresh data
          return true;
        } else {
          toast.error(response.message || "Failed to update payment mode");
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [branchId, fetchConfig]
  );

  // Update receipt configuration
  const updateReceiptConfig = useCallback(
    async (receiptConfig: ReceiptConfig) => {
      if (!branchId) return;

      try {
        setActionLoading(true);
        const response = await BranchPOSConfigService.updateReceiptConfig(
          branchId,
          receiptConfig
        );

        if (response.success) {
          toast.success("Receipt configuration updated successfully");
          await fetchConfig(); // Refresh data
          return true;
        } else {
          toast.error(response.message || "Failed to update receipt configuration");
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [branchId, fetchConfig]
  );

  // Update payment methods
  const updatePaymentMethods = useCallback(
    async (paymentMethods: PaymentMethods) => {
      if (!branchId) return;

      try {
        setActionLoading(true);
        const response = await BranchPOSConfigService.updatePaymentMethods(
          branchId,
          paymentMethods
        );

        if (response.success) {
          toast.success("Payment methods updated successfully");
          await fetchConfig(); // Refresh data
          return true;
        } else {
          toast.error(response.message || "Failed to update payment methods");
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [branchId, fetchConfig]
  );

  // Update complete POS config
  const updatePOSConfig = useCallback(
    async (payload: Partial<BranchPOSConfig["posConfig"]>) => {
      if (!branchId) return;

      try {
        setActionLoading(true);
        const response = await BranchPOSConfigService.updatePOSConfig(branchId, payload);

        if (response.success) {
          toast.success("POS configuration updated successfully");
          await fetchConfig(); // Refresh data
          return true;
        } else {
          toast.error(response.message || "Failed to update POS configuration");
          return false;
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "An error occurred";
        toast.error(message);
        return false;
      } finally {
        setActionLoading(false);
      }
    },
    [branchId, fetchConfig]
  );

  // Reset receipt config to defaults
  const resetReceiptConfig = useCallback(async () => {
    if (!branchId) return;

    try {
      setActionLoading(true);
      const response = await BranchPOSConfigService.resetReceiptConfig(branchId);

      if (response.success) {
        toast.success("Receipt configuration reset to defaults");
        await fetchConfig(); // Refresh data
        return true;
      } else {
        toast.error(response.message || "Failed to reset receipt configuration");
        return false;
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "An error occurred";
      toast.error(message);
      return false;
    } finally {
      setActionLoading(false);
    }
  }, [branchId, fetchConfig]);

  return {
    // Data
    config,
    loading,
    actionLoading,
    error,

    // Actions
    fetchConfig,
    updatePaymentMode,
    updateReceiptConfig,
    updatePaymentMethods,
    updatePOSConfig,
    resetReceiptConfig,

    // Helpers
    paymentMode: config?.posConfig?.paymentMode || "payNow",
    enableTableService: config?.posConfig?.enableTableService || false,
    receiptConfig: config?.posConfig?.receiptConfig || {},
    paymentMethods: config?.posConfig?.paymentMethods || {},
    branchName: config?.branchName || "",
    currency: config?.currency || "PKR",
  };
}
