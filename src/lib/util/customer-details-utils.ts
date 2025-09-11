// utils/customerUtils.ts
import { CustomerItem, CustomerSummaryData } from '@/lib/types/customer-details';

export const filterCustomers = (customers: CustomerItem[], searchTerm: string): CustomerItem[] => {
    const s = searchTerm.toLowerCase();
    return customers.filter((item) => {
        return (
            item.Device.toLowerCase().includes(s) ||
            item.Name.toLowerCase().includes(s) ||
            item.Contact.toLowerCase().includes(s) ||
            item.Email.toLowerCase().includes(s) ||
            item.Address.toLowerCase().includes(s) ||
            item.Birthdate.toLowerCase().includes(s) ||
            item.Customer_ID.toString().includes(s)
        );
    });
};

export const calculateCustomerSummary = (customers: CustomerItem[]): CustomerSummaryData => {
    if (customers.length === 0) {
        return {
            totalCustomers: 0,
            totalOrders: 0,
            bestCustomer: null,
            averageRating: 0
        };
    }

    const totalOrders = customers.reduce((total, item) => total + item.Total_Orders, 0);

    const totalRating = customers.reduce((sum, item) => sum + item.Feedback_Rating, 0);
    const averageRating = totalRating / customers.length;

    const bestCustomer = customers.reduce((best, current) => {
        if (current.Feedback_Rating > best.Feedback_Rating) {
            return current;
        }
        if (current.Feedback_Rating === best.Feedback_Rating && current.Total_Orders > best.Total_Orders) {
            return current;
        }
        return best;
    });

    return {
        totalCustomers: customers.length,
        totalOrders,
        bestCustomer,
        averageRating
    };
};

export const exportCustomersToCSV = (customers: CustomerItem[]): void => {
    const csvContent = "data:text/csv;charset=utf-8,"
        + "Customer ID,Name,Contact,Email,Address,Feedback Rating,Total Orders,Device,Birthdate,Registration Date,Profile Creation Date\n"
        + customers.map(item =>
            `${item.Customer_ID},"${item.Name}","${item.Contact}","${item.Email}","${item.Address}",${item.Feedback_Rating},${item.Total_Orders},"${item.Device}","${item.Birthdate}","${item.Registration_Date}","${item.Profile_Creation_Date}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "customers_export.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};

export const getInitials = (fullName: string): string => {
    const names = fullName.split(' ');
    if (names.length >= 2) {
        return names[0][0] + names[1][0];
    }
    return names[0][0] + (names[0][1] || '');
};