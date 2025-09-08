// utils/exportUtils.ts

export interface ExportConfig {
    filename: string;
    headers: string[];
    dataKeys: string[];
    formatValue?: (key: string, value: any) => string;
}

export const exportToCSV = <T extends Record<string, any>>(
    data: T[],
    config: ExportConfig
): void => {
    const { filename, headers, dataKeys, formatValue } = config;

    // Create header row
    const headerRow = headers.join(',');

    // Create data rows
    const dataRows = data.map(item => {
        return dataKeys.map(key => {
            let value = item[key];

            // Apply custom formatting if provided
            if (formatValue) {
                value = formatValue(key, value);
            }

            // Handle string values that might contain commas
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }

            return value?.toString() || '';
        }).join(',');
    });

    // Combine all rows
    const csvContent = "data:text/csv;charset=utf-8," +
        headerRow + "\n" +
        dataRows.join("\n");

    // Create and trigger download
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const exportToJSON = <T>(data: T[], filename: string): void => {
    const jsonContent = "data:text/json;charset=utf-8," +
        encodeURIComponent(JSON.stringify(data, null, 2));

    const link = document.createElement("a");
    link.setAttribute("href", jsonContent);
    link.setAttribute("download", filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

// Predefined export configurations for common data types
export const EXPORT_CONFIGS = {
    customers: {
        filename: 'customers_export.csv',
        headers: [
            'Customer ID', 'Name', 'Contact', 'Email', 'Address',
            'Feedback Rating', 'Total Orders', 'Device', 'Birthdate',
            'Registration Date', 'Profile Creation Date'
        ],
        dataKeys: [
            'Customer_ID', 'Name', 'Contact', 'Email', 'Address',
            'Feedback_Rating', 'Total_Orders', 'Device', 'Birthdate',
            'Registration_Date', 'Profile_Creation_Date'
        ]
    },
    inventory: (branchId?: string) => ({
        filename: `inventory_report_branch_${branchId || 'unknown'}_${new Date().toISOString().split('T')[0]}.csv`,
        headers: [
            'ID', 'Name', 'Unit', 'Initial Stock', 'Purchased',
            'Used', 'Variance', 'Wasteage', 'Closing Stock', 'Total Value'
        ],
        dataKeys: [
            'ID', 'Name', 'Unit', 'InitialStock', 'Purchased',
            'Used', 'Variance', 'Wasteage', 'ClosingStock', 'Total_Value'
        ],
        formatValue: (key: string, value: any) => {
            if (key === 'Total_Value') {
                return `${value}`;
            }
            return value?.toString() || '';
        }
    }),
    payments: {
        filename: 'payments_export.csv',
        headers: ['Payment ID', 'Customer', 'Amount', 'Date', 'Status'],
        dataKeys: ['Payment_ID', 'Customer_Name', 'Amount', 'Date', 'Status']
    },
    orders: {
        filename: 'orders_export.csv',
        headers: ['Order ID', 'Customer', 'Total', 'Date', 'Status'],
        dataKeys: ['Order_ID', 'Customer_Name', 'Total', 'Date', 'Status']
    }
};