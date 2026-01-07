// src/lib/services/branch-pos-config-service.ts

import { buildHeaders } from "@/lib/util/service-helpers";

export interface ReceiptConfig {
  showLogo?: boolean;
  logoUrl?: string;
  showQRCode?: boolean;
  qrCodeData?: string;
  headerText?: string;
  footerText?: string;
  showTaxBreakdown?: boolean;
  showItemCodes?: boolean;
  paperWidth?: number;
  fontSizeMultiplier?: number;
}

export interface PaymentMethodConfig {
  enabled: boolean;
  taxRateOverride?: number | null;
  minAmount?: number;
}

export interface PaymentMethods {
  cash?: PaymentMethodConfig;
  card?: PaymentMethodConfig;
  mobile?: PaymentMethodConfig;
}

export interface BranchPOSConfig {
  branchId?: string;
  branchName?: string;
  currency?: string;
  timezone?: string;
  tax?: {
    mode?: string;
    rate?: number;
    vatNumber?: string;
  };
  posConfig?: {
    orderPrefix?: string;
    receiptFooter?: string;
    enableHoldOrders?: boolean;
    enableTableService?: boolean;
    paymentMode?: "payNow" | "payLater";
    receiptConfig?: ReceiptConfig;
    paymentMethods?: PaymentMethods;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  status?: number;
  result?: T;
}

// Use the user's provided env var name for base URL and support local proxy routing
const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

export const BranchPOSConfigService = {
  /**
   * Get complete POS configuration for a branch
   * GET /t/branches/:branchId/pos-config
   */
  async getPOSConfig(branchId: string): Promise<ApiResponse<BranchPOSConfig>> {
    const url = buildUrl(`/t/branches/${branchId}/pos-config`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Get POS config failed (${res.status})`,
        status: res.status
      };
    }

    const config: BranchPOSConfig = data?.result ?? data?.data ?? data;
    return { success: true, data: config };
  },

  /**
   * Update payment mode (Pay Now / Pay Later)
   * PUT /t/branches/:branchId/pos-config
   */
  async updatePaymentMode(
    branchId: string,
    paymentMode: "payNow" | "payLater",
    enableTableService: boolean
  ): Promise<ApiResponse<BranchPOSConfig>> {
    const url = buildUrl(`/t/branches/${branchId}/pos-config`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify({ paymentMode, enableTableService }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Update payment mode failed (${res.status})`,
        status: res.status
      };
    }

    const config: BranchPOSConfig = data?.result ?? data?.data ?? data;
    return { success: true, data: config };
  },

  /**
   * Update receipt configuration
   * PUT /t/branches/:branchId/pos-config
   */
  async updateReceiptConfig(
    branchId: string,
    receiptConfig: ReceiptConfig
  ): Promise<ApiResponse<BranchPOSConfig>> {
    const url = buildUrl(`/t/branches/${branchId}/pos-config`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify({ receiptConfig }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Update receipt config failed (${res.status})`,
        status: res.status
      };
    }

    const config: BranchPOSConfig = data?.result ?? data?.data ?? data;
    return { success: true, data: config };
  },

  /**
   * Update payment methods configuration
   * PUT /t/branches/:branchId/pos-config
   */
  async updatePaymentMethods(
    branchId: string,
    paymentMethods: PaymentMethods
  ): Promise<ApiResponse<BranchPOSConfig>> {
    const url = buildUrl(`/t/branches/${branchId}/pos-config`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify({ paymentMethods }),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Update payment methods failed (${res.status})`,
        status: res.status
      };
    }

    const config: BranchPOSConfig = data?.result ?? data?.data ?? data;
    return { success: true, data: config };
  },

  /**
   * Update complete POS configuration
   * PUT /t/branches/:branchId/pos-config
   */
  async updatePOSConfig(
    branchId: string,
    payload: Partial<BranchPOSConfig["posConfig"]>
  ): Promise<ApiResponse<BranchPOSConfig>> {
    const url = buildUrl(`/t/branches/${branchId}/pos-config`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Update POS config failed (${res.status})`,
        status: res.status
      };
    }

    const config: BranchPOSConfig = data?.result ?? data?.data ?? data;
    return { success: true, data: config };
  },

  /**
   * Reset receipt config to defaults
   * PUT /t/branches/:branchId/pos-config
   */
  async resetReceiptConfig(branchId: string): Promise<ApiResponse<BranchPOSConfig>> {
    const defaultReceiptConfig: ReceiptConfig = {
      showLogo: false,
      logoUrl: "",
      showQRCode: false,
      qrCodeData: "",
      headerText: "",
      footerText: "Thank you for your business!",
      showTaxBreakdown: true,
      showItemCodes: false,
      paperWidth: 80,
      fontSizeMultiplier: 1.0,
    };

    return this.updateReceiptConfig(branchId, defaultReceiptConfig);
  },
};
