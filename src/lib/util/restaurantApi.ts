// utils/restaurantApi.ts

import { RestaurantData, ApiResponse } from "../../types";


export class RestaurantAPI {
    private static delay = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));

    private static mockData: Omit<RestaurantData, "logo"> = {
        name: "",
        type: "",
        contact: "",
        email: "",
        address: "",
        description: "",
        website: "",
        openingTime: "",
        closingTime: "",
    };

    static async getProfile(): Promise<
        ApiResponse<Omit<RestaurantData, "logo">>
    > {
        await this.delay(800);
        const data = this.mockData;
        return {
            success: true,
            data,
            message: "Profile loaded successfully",
        };
    }

    static async updateProfile(
        data: Omit<RestaurantData, "logo">
    ): Promise<ApiResponse<Omit<RestaurantData, "logo">>> {
        await this.delay(1000);
        this.mockData = { ...this.mockData, ...data };
        return {
            success: true,
            data,
            message: "Restaurant profile updated successfully",
        };
    }
}
