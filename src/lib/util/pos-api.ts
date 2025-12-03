import { PosItem, ApiResponse, TillSession, OpenTillRequest, CloseTillRequest } from "@/lib/types/pos";
import { api, normalizeApiResponse } from "./api-client";

/**
 * POS Terminal API Service
 * Manages POS terminals under branches with tenant-scoped access
 */
export class PosAPI {
    /**
     * Get all POS terminals for a specific branch
     * Endpoint: GET /t/pos/terminals?branchId={branchId}
     */
    static async getPosItemsByBranch(branchId: string): Promise<ApiResponse<PosItem[]>> {
        try {
            const response = await api.get<any>(`/t/pos/terminals?branchId=${branchId}`);
            const normalized = normalizeApiResponse<PosItem[]>(response);

            // Transform backend response to match our frontend schema
            const transformedData = (normalized.data || []).map((item: any) => ({
                Branch_ID_fk: item.branchId || branchId,
                POS_ID: item._id || item.id,
                POS_Name: item.name,
                Status: (item.status === "active" ? "active" : "inactive") as "active" | "inactive",
                machineId: item.machineId,
                metadata: item.metadata,
            }));

            return {
                success: true,
                data: transformedData,
                message: normalized.message || `POS terminals for branch ${branchId} fetched successfully`,
            };
        } catch (error) {
            console.error('Error fetching POS terminals:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch POS terminals',
            };
        }
    }

    /**
     * Create a new POS terminal
     * Endpoint: POST /t/pos/terminals
     */
    static async createPosItem(item: Omit<PosItem, "POS_ID">): Promise<ApiResponse<PosItem>> {
        try {
            const requestBody = {
                branchId: item.Branch_ID_fk,
                machineId: item.machineId || `POS-${Date.now()}`,
                name: item.POS_Name,
                status: item.Status || "active",
                metadata: item.metadata || {},
            };

            const response = await api.post<any>('/t/pos/terminals', requestBody);
            const normalized = normalizeApiResponse<any>(response);

            // Transform backend response to match our frontend schema
            const transformedData: PosItem = {
                Branch_ID_fk: normalized.data.branchId,
                POS_ID: normalized.data._id || normalized.data.id,
                POS_Name: normalized.data.name,
                Status: normalized.data.status,
                machineId: normalized.data.machineId,
                metadata: normalized.data.metadata,
            };

            return {
                success: true,
                data: transformedData,
                message: normalized.message || "POS terminal created successfully",
            };
        } catch (error) {
            console.error('Error creating POS terminal:', error);
            return {
                success: false,
                data: null as any,
                message: error instanceof Error ? error.message : 'Failed to create POS terminal',
            };
        }
    }

    /**
     * Update an existing POS terminal
     * Endpoint: PUT /t/pos/terminals/:id
     */
    static async updatePosItem(id: string, item: Partial<PosItem>): Promise<ApiResponse<PosItem>> {
        try {
            const requestBody: any = {};

            if (item.POS_Name) requestBody.name = item.POS_Name;
            if (item.Status) requestBody.status = item.Status;
            if (item.machineId) requestBody.machineId = item.machineId;
            if (item.metadata) requestBody.metadata = item.metadata;

            const response = await api.put<any>(`/t/pos/terminals/${id}`, requestBody);
            const normalized = normalizeApiResponse<any>(response);

            // Transform backend response to match our frontend schema
            const transformedData: PosItem = {
                Branch_ID_fk: normalized.data.branchId,
                POS_ID: normalized.data._id || normalized.data.id,
                POS_Name: normalized.data.name,
                Status: normalized.data.status,
                machineId: normalized.data.machineId,
                metadata: normalized.data.metadata,
            };

            return {
                success: true,
                data: transformedData,
                message: normalized.message || "POS terminal updated successfully",
            };
        } catch (error) {
            console.error('Error updating POS terminal:', error);
            return {
                success: false,
                data: null as any,
                message: error instanceof Error ? error.message : 'Failed to update POS terminal',
            };
        }
    }

    /**
     * Delete a POS terminal
     * Endpoint: DELETE /t/pos/terminals/:id
     */
    static async deletePosItem(id: string): Promise<ApiResponse<null>> {
        try {
            await api.delete(`/t/pos/terminals/${id}`);
            return {
                success: true,
                data: null,
                message: "POS terminal deleted successfully",
            };
        } catch (error) {
            console.error('Error deleting POS terminal:', error);
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to delete POS terminal',
            };
        }
    }

    /**
     * Bulk delete POS terminals
     * Note: If backend doesn't support bulk delete, this will call delete multiple times
     */
    static async bulkDeletePosItems(ids: string[]): Promise<ApiResponse<null>> {
        try {
            // Call delete for each terminal
            await Promise.all(ids.map(id => api.delete(`/t/pos/terminals/${id}`)));

            return {
                success: true,
                data: null,
                message: `${ids.length} POS terminal(s) deleted successfully`,
            };
        } catch (error) {
            console.error('Error bulk deleting POS terminals:', error);
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to delete POS terminals',
            };
        }
    }

    /**
     * Get till sessions for a specific POS terminal or branch
     * Endpoint: GET /t/pos/till/sessions?posId={posId}&branchId={branchId}
     */
    static async getTillSessions(params: { posId?: string; branchId?: string }): Promise<ApiResponse<TillSession[]>> {
        try {
            const queryParams = new URLSearchParams();
            if (params.posId) queryParams.append('posId', params.posId);
            if (params.branchId) queryParams.append('branchId', params.branchId);

            const response = await api.get<any>(`/t/pos/till/sessions?${queryParams.toString()}`);
            const normalized = normalizeApiResponse<TillSession[]>(response);

            return {
                success: true,
                data: normalized.data || [],
                message: normalized.message || 'Till sessions fetched successfully',
            };
        } catch (error) {
            console.error('Error fetching till sessions:', error);
            return {
                success: false,
                data: [],
                message: error instanceof Error ? error.message : 'Failed to fetch till sessions',
            };
        }
    }

    /**
     * Open a new till session for a POS terminal
     * Endpoint: POST /t/pos/till/open
     */
    static async openTill(request: OpenTillRequest): Promise<ApiResponse<TillSession>> {
        try {
            const response = await api.post<any>('/t/pos/till/open', request);
            const normalized = normalizeApiResponse<TillSession>(response);

            return {
                success: true,
                data: normalized.data!,
                message: normalized.message || 'Till opened successfully',
            };
        } catch (error) {
            console.error('Error opening till:', error);
            return {
                success: false,
                data: null as any,
                message: error instanceof Error ? error.message : 'Failed to open till',
            };
        }
    }

    /**
     * Close an open till session
     * Endpoint: POST /t/pos/till/close
     */
    static async closeTill(request: CloseTillRequest): Promise<ApiResponse<TillSession>> {
        try {
            const response = await api.post<any>('/t/pos/till/close', request);
            const normalized = normalizeApiResponse<TillSession>(response);

            return {
                success: true,
                data: normalized.data!,
                message: normalized.message || 'Till closed successfully',
            };
        } catch (error) {
            console.error('Error closing till:', error);
            return {
                success: false,
                data: null as any,
                message: error instanceof Error ? error.message : 'Failed to close till',
            };
        }
    }

    /**
     * Get the current open till session for a POS terminal
     * Endpoint: GET /t/pos/till/current?posId={posId}
     */
    static async getCurrentTillSession(posId: string): Promise<ApiResponse<TillSession | null>> {
        try {
            const response = await api.get<any>(`/t/pos/till/current?posId=${posId}`);
            const normalized = normalizeApiResponse<TillSession | null>(response);

            return {
                success: true,
                data: normalized.data,
                message: normalized.message || 'Current till session fetched successfully',
            };
        } catch (error) {
            console.error('Error fetching current till session:', error);
            return {
                success: false,
                data: null,
                message: error instanceof Error ? error.message : 'Failed to fetch current till session',
            };
        }
    }
}