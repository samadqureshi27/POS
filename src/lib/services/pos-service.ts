// src/lib/services/pos-service.ts

import { buildHeaders } from "@/lib/util/service-helpers";

// POS Terminal Types
export interface PosTerminal {
  id?: string;
  _id?: string;
  branchId: string;
  machineId: string;
  name: string;
  status: "active" | "inactive";
  metadata?: {
    ip?: string;
    location?: string;
    [key: string]: any;
  };
  createdAt?: string;
  updatedAt?: string;
}

// Till Session Types
export interface TillSession {
  id?: string;
  _id?: string;
  branchId: string;
  posId: string;
  userId: string;
  openingAmount: number;
  closingAmount?: number;
  declaredClosingAmount?: number;
  systemClosingAmount?: number;
  cashCounts?: {
    [denomination: string]: number;
  };
  status: "open" | "closed";
  openedAt: string;
  closedAt?: string;
  notes?: string;
  tillSessionId?: string;
}

export interface OpenTillRequest {
  branchId: string;
  posId: string;
  openingAmount: number;
  cashCounts?: {
    [denomination: string]: number;
  };
  notes?: string;
}

export interface CloseTillRequest {
  branchId: string;
  posId: string;
  declaredClosingAmount: number;
  systemClosingAmount: number;
  cashCounts?: {
    [denomination: string]: number;
  };
  notes?: string;
  tillSessionId: string;
}

// API Response Type
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}

// Use the user's provided env var name for base URL and support local proxy routing
const REMOTE_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE || "https://api.tritechtechnologyllc.com";
const USE_PROXY = (process.env.NEXT_PUBLIC_USE_API_PROXY || "true").toLowerCase() === "true"; // default to proxy
const POS_TERMINALS_BASE = "/t/pos/terminals";
const POS_TILL_BASE = "/t/pos/till";

function buildUrl(path: string) {
  return USE_PROXY ? `/api${path}` : `${REMOTE_BASE}${path}`;
}

export const PosService = {
  // ============================================
  // POS Terminal Management
  // ============================================

  /**
   * Get all POS terminals for a specific branch
   * GET /t/pos/terminals?branchId={branchId}
   */
  async getTerminalsByBranch(branchId: string): Promise<ApiResponse<PosTerminal[]>> {
    const url = buildUrl(`${POS_TERMINALS_BASE}?branchId=${encodeURIComponent(branchId)}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Get POS terminals failed (${res.status})`,
        error: data?.error
      };
    }

    // Backend returns: { status, message, items: [...] } or { status, message, data: [...] }
    const terminals: PosTerminal[] = data?.items ?? data?.data ?? data?.result?.items ?? data?.result ?? [];
    return { success: true, data: terminals };
  },

  /**
   * Get a single POS terminal by ID
   * GET /t/pos/terminals/:id
   */
  async getTerminal(id: string): Promise<ApiResponse<PosTerminal>> {
    const url = buildUrl(`${POS_TERMINALS_BASE}/${id}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Get POS terminal failed (${res.status})`,
        error: data?.error
      };
    }

    const terminal: PosTerminal = data?.result ?? data?.data ?? data;
    return { success: true, data: terminal };
  },

  /**
   * Create a new POS terminal
   * POST /t/pos/terminals
   */
  async createTerminal(payload: {
    branchId: string;
    machineId: string;
    name: string;
    status?: "active" | "inactive";
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<PosTerminal>> {
    const url = buildUrl(`${POS_TERMINALS_BASE}`);
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Create POS terminal failed (${res.status})`,
        error: data?.error
      };
    }

    const terminal: PosTerminal = data?.result ?? data?.data ?? data;
    return { success: true, data: terminal, message: data?.message || "POS terminal created successfully" };
  },

  /**
   * Update an existing POS terminal
   * PUT /t/pos/terminals/:id
   */
  async updateTerminal(id: string, payload: {
    name?: string;
    status?: "active" | "inactive";
    machineId?: string;
    metadata?: Record<string, any>;
  }): Promise<ApiResponse<PosTerminal>> {
    const url = buildUrl(`${POS_TERMINALS_BASE}/${id}`);
    const res = await fetch(url, {
      method: "PUT",
      headers: buildHeaders(),
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Update POS terminal failed (${res.status})`,
        error: data?.error
      };
    }

    const terminal: PosTerminal = data?.result ?? data?.data ?? data;
    return { success: true, data: terminal, message: data?.message || "POS terminal updated successfully" };
  },

  /**
   * Delete a POS terminal
   * DELETE /t/pos/terminals/:id
   */
  async deleteTerminal(id: string): Promise<ApiResponse<null>> {
    const url = buildUrl(`${POS_TERMINALS_BASE}/${id}`);
    const res = await fetch(url, {
      method: "DELETE",
      headers: buildHeaders()
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return {
        success: false,
        message: data?.message || `Delete POS terminal failed (${res.status})`,
        error: data?.error
      };
    }

    return { success: true, data: null, message: "POS terminal deleted successfully" };
  },

  /**
   * Bulk delete POS terminals
   * DELETE /t/pos/terminals (bulk) - or multiple individual deletes
   */
  async bulkDeleteTerminals(ids: string[]): Promise<ApiResponse<null>> {
    try {
      // Call delete for each terminal
      await Promise.all(ids.map(id => this.deleteTerminal(id)));

      return {
        success: true,
        data: null,
        message: `${ids.length} POS terminal(s) deleted successfully`,
      };
    } catch (error) {
      return {
        success: false,
        data: null,
        message: error instanceof Error ? error.message : 'Failed to delete POS terminals',
      };
    }
  },

  // ============================================
  // Till Session Management
  // ============================================

  /**
   * Get till sessions for a specific POS terminal or branch
   * GET /t/pos/till/sessions?posId={posId}&branchId={branchId}
   */
  async getTillSessions(params: {
    posId?: string;
    branchId?: string;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<TillSession[]>> {
    const queryParams = new URLSearchParams();
    if (params.posId) queryParams.append('posId', params.posId);
    if (params.branchId) queryParams.append('branchId', params.branchId);
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());

    const url = buildUrl(`${POS_TILL_BASE}/sessions?${queryParams.toString()}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Get till sessions failed (${res.status})`,
        error: data?.error
      };
    }

    const sessions: TillSession[] = data?.items ?? data?.data ?? data?.result?.items ?? data?.result ?? [];
    return { success: true, data: sessions };
  },

  /**
   * Get the current open till session for a POS terminal
   * GET /t/pos/till/current?posId={posId}
   */
  async getCurrentTillSession(posId: string): Promise<ApiResponse<TillSession | null>> {
    const url = buildUrl(`${POS_TILL_BASE}/current?posId=${encodeURIComponent(posId)}`);
    const res = await fetch(url, { headers: buildHeaders() });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Get current till session failed (${res.status})`,
        error: data?.error
      };
    }

    const session: TillSession | null = data?.result ?? data?.data ?? data ?? null;
    return { success: true, data: session };
  },

  /**
   * Open a new till session for a POS terminal
   * POST /t/pos/till/open
   */
  async openTill(request: OpenTillRequest): Promise<ApiResponse<TillSession>> {
    const url = buildUrl(`${POS_TILL_BASE}/open`);
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(request),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Open till failed (${res.status})`,
        error: data?.error
      };
    }

    const session: TillSession = data?.result ?? data?.data ?? data;
    return { success: true, data: session, message: data?.message || "Till opened successfully" };
  },

  /**
   * Close an open till session
   * POST /t/pos/till/close
   */
  async closeTill(request: CloseTillRequest): Promise<ApiResponse<TillSession>> {
    const url = buildUrl(`${POS_TILL_BASE}/close`);
    const res = await fetch(url, {
      method: "POST",
      headers: buildHeaders(),
      body: JSON.stringify(request),
    });
    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || `Close till failed (${res.status})`,
        error: data?.error
      };
    }

    const session: TillSession = data?.result ?? data?.data ?? data;
    return { success: true, data: session, message: data?.message || "Till closed successfully" };
  },
};
