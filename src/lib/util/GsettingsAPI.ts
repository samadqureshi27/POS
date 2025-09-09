import { GeneralSettings, ApiResponse } from "../../types/types";
import { DEFAULT_SETTINGS } from "./DropDownSettings";

// API class following the same pattern as MenuAPI
export class SettingsAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  private static mockSettings: GeneralSettings = { ...DEFAULT_SETTINGS };

  // GET /api/settings/
  static async getSettings(): Promise<ApiResponse<GeneralSettings>> {
    try {
      await this.delay(500); // Reduced delay for better UX
      return {
        success: true,
        data: { ...this.mockSettings },
        message: "Settings loaded successfully",
      };
    } catch (error) {
      console.error('API Error - getSettings:', error);
      return {
        success: false,
        data: { ...DEFAULT_SETTINGS }, // Return defaults on error
        message: "Failed to load settings",
      };
    }
  }

  // PUT /api/settings/
  static async updateSettings(
    settings: Partial<GeneralSettings>
  ): Promise<ApiResponse<GeneralSettings>> {
    try {
      await this.delay(800);
      this.mockSettings = { ...this.mockSettings, ...settings };
      return {
        success: true,
        data: { ...this.mockSettings },
        message: "Settings updated successfully",
      };
    } catch (error) {
      console.error('API Error - updateSettings:', error);
      return {
        success: false,
        data: this.mockSettings,
        message: "Failed to update settings",
      };
    }
  }

  // POST /api/settings/reset/
  static async resetToDefaults(): Promise<ApiResponse<GeneralSettings>> {
    try {
      await this.delay(600);
      this.mockSettings = { ...DEFAULT_SETTINGS };
      return {
        success: true,
        data: { ...this.mockSettings },
        message: "Settings reset to defaults successfully",
      };
    } catch (error) {
      console.error('API Error - resetToDefaults:', error);
      return {
        success: false,
        data: this.mockSettings,
        message: "Failed to reset settings",
      };
    }
  }
}