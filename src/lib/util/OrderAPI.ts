// _components/OrderAPI.ts

import { OrderItem, ApiResponse, OrderStats } from '@/types';


export class OrderAPI {
  private static delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  // Mock data for OrderItem suitable for a coffee shop or restaurant
  private static mockData: OrderItem[] = [
    {
      Order: "#001",
      Name: "Cappuccino",
      number_item: "45",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Card",
      Total: "$4.50",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#002",
      Name: "Latte",
      number_item: "38",
      Status: "Active",
      Type: "Takeaway",
      Payment: "Cash",
      Total: "$5.00",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#003",
      Name: "Espresso",
      number_item: "52",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Online",
      Total: "$3.00",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#004",
      Name: "Croissant",
      number_item: "23",
      Status: "Inactive",
      Type: "Delivery",
      Payment: "Online",
      Total: "$6.50",
      Time_Date: "21-08-2025",
    },
    {
      Order: "#005",
      Name: "Americano",
      number_item: "41",
      Status: "Active",
      Type: "Takeaway",
      Payment: "Card",
      Total: "$3.75",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#006",
      Name: "Sandwich",
      number_item: "19",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Cash",
      Total: "$8.50",
      Time_Date: "22-08-2025",
    },
    {
      Order: "#007",
      Name: "Mocha",
      number_item: "34",
      Status: "Active",
      Type: "Delivery",
      Payment: "Online",
      Total: "$5.50",
      Time_Date: "21-08-2025",
    },
    {
      Order: "#008",
      Name: "Tea",
      number_item: "27",
      Status: "Inactive",
      Type: "Takeaway",
      Payment: "Cash",
      Total: "$2.50",
      Time_Date: "21-08-2025",
    },
    {
      Order: "#009",
      Name: "Frappuccino",
      number_item: "31",
      Status: "Active",
      Type: "Dine-In",
      Payment: "Card",
      Total: "$6.00",
      Time_Date: "20-08-2025",
    },
    {
      Order: "#010",
      Name: "Bagel",
      number_item: "15",
      Status: "Active",
      Type: "Takeaway",
      Payment: "Online",
      Total: "$4.00",
      Time_Date: "19-08-2025",
    },
  ];

  static async getOrders(): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(800);
    return {
      success: true,
      data: [...this.mockData],
      message: "Orders fetched successfully",
    };
  }

  static async getOrderStats(): Promise<ApiResponse<OrderStats>> {
    await this.delay(600);

    const sortedByQuantity = [...this.mockData].sort(
      (a, b) => parseInt(b.number_item) - parseInt(a.number_item)
    );

    // Calculate order type statistics
    const typeStats = this.mockData.reduce((acc, order) => {
      acc[order.Type] = (acc[order.Type] || 0) + parseInt(order.number_item);
      return acc;
    }, {} as Record<string, number>);

    const orderTypeStats = [
      { name: "Dine-In", value: typeStats["Dine-In"] || 0, fill: "#959AA3" },
      { name: "Takeaway", value: typeStats["Takeaway"] || 0, fill: "#CCAB4D" },
      { name: "Delivery", value: typeStats["Delivery"] || 0, fill: "#000000" },
    ];

    return {
      success: true,
      data: {
        mostOrdered: sortedByQuantity.slice(0, 5),
        leastOrdered: sortedByQuantity.slice(-5).reverse(),
        orderTypeStats,
      },
      message: "Order statistics fetched successfully",
    };
  }

  static async getFilteredOrders(filters: {
    search?: string;
    status?: "Active" | "Inactive";
    type?: string;
    dateRange?: string;
    customDate?: string;
  }): Promise<ApiResponse<OrderItem[]>> {
    await this.delay(400);

    let filteredData = [...this.mockData];

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredData = filteredData.filter(
        (item) =>
          item.Order.toLowerCase().includes(searchTerm) ||
          item.Name.toLowerCase().includes(searchTerm) ||
          item.Type.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.status) {
      filteredData = filteredData.filter(
        (item) => item.Status === filters.status
      );
    }

    if (filters.type) {
      filteredData = filteredData.filter((item) => item.Type === filters.type);
    }

    if (filters.customDate) {
      filteredData = filteredData.filter(
        (item) => item.Time_Date === filters.customDate
      );
    }

    return {
      success: true,
      data: filteredData,
      message: "Filtered orders fetched successfully",
    };
  }
}