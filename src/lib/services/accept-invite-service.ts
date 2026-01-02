// lib/services/auth/accept-invite-service.ts

interface AcceptInviteRequest {
  token: string;
  password: string;
}

interface AcceptInviteResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: any;
  error?: string;
  errors?: Array<{ field: string; message: string }>;
}

/**
 * Accept invitation and set password service
 * Handles the business logic for accepting user invitations
 */
export class AcceptInviteService {
  /**
   * Accept invitation with token and password
   * @param data - Invitation token and new password
   * @returns Response with success status and optional auth token
   */
  static async acceptInvite(
    data: AcceptInviteRequest
  ): Promise<AcceptInviteResponse> {
    try {
      const response = await fetch("/api/t/auth/accept-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // Check content type before parsing
      const contentType = response.headers.get("content-type");
      
      // If response is not JSON, handle as error
      if (!contentType || !contentType.includes("application/json")) {
        console.error("Non-JSON response received:", contentType);
        const text = await response.text();
        console.error("Response body:", text);
        
        return {
          success: false,
          error: "Server returned an invalid response. Please try again later.",
        };
      }

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: typeof result.error === 'string' 
            ? result.error 
            : typeof result.message === 'string'
            ? result.message
            : "Failed to accept invitation",
          errors: result.errors,
        };
      }

      return {
        success: true,
        message: typeof result.message === 'string' 
          ? result.message 
          : "Password set successfully",
        token: result.result?.token || result.token,
        user: result.result?.user || result.user,
      };
    } catch (error: any) {
      console.error("AcceptInviteService Error:", error);
      return {
        success: false,
        error: error?.message || "Network error. Please try again.",
      };
    }
  }

  /**
   * Validate invitation token
   * @param token - Invitation token to validate
   * @returns Validation result
   */
  static async validateToken(token: string): Promise<boolean> {
    if (!token || token.trim().length === 0) {
      return false;
    }
    // Add additional token format validation if needed
    return true;
  }
}

export type { AcceptInviteRequest, AcceptInviteResponse };