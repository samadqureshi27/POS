// CNIC formatting function
export const formatCNIC = (value: string): string => {
    const digits = value.replace(/\D/g, "");

    if (digits.length <= 5) {
        return digits;
    } else if (digits.length <= 12) {
        return `${digits.slice(0, 5)}-${digits.slice(5)}`;
    } else {
        return `${digits.slice(0, 5)}-${digits.slice(5, 12)}-${digits.slice(12, 13)}`;
    }
};

// Format Staff ID for display
export const formatStaffId = (id: string): string => {
    return `#${String(id).padStart(3, "0")}`;
};