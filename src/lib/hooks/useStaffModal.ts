import { useState, useEffect } from "react";
import { StaffItem, StaffFormData } from "@/lib/types/staff-management";
import { useModalState } from "./useModalState";

export const useStaffModal = (branchId: string) => {
    const { isOpen, editingItem, openCreate, openEdit, close } = useModalState<StaffItem>();
    const [formData, setFormData] = useState<StaffFormData>({
        Name: "",
        Contact: "",
        Address: "",
        CNIC: "",
        Status: "Active",
        Role: "",
        Salary: "",
        Shift_Start_Time: "",
        Shift_End_Time: "",
        Branch_ID_fk: branchId || "",
        Access_Code: "",
    });

    // Modal form sync
    useEffect(() => {
        if (editingItem) {
            setFormData({
                Name: editingItem.Name,
                Contact: editingItem.Contact,
                Address: editingItem.Address,
                CNIC: editingItem.CNIC,
                Status: editingItem.Status,
                Role: editingItem.Role,
                Salary: editingItem.Salary,
                Shift_Start_Time: editingItem.Shift_Start_Time,
                Shift_End_Time: editingItem.Shift_End_Time,
                Branch_ID_fk: editingItem.Branch_ID_fk,
                Access_Code: editingItem.Access_Code || "",
            });
        } else {
            setFormData({
                Name: "",
                Contact: "",
                Address: "",
                CNIC: "",
                Status: "Active",
                Role: "",
                Salary: "",
                Shift_Start_Time: "",
                Shift_End_Time: "",
                Branch_ID_fk: branchId || "",
                Access_Code: "",
            });
        }
    }, [editingItem, isOpen, branchId]);

    // Clear access code when role is not Cashier or Manager
    useEffect(() => {
        if (formData.Role !== "Cashier" && formData.Role !== "Manager") {
            setFormData((prev) => ({ ...prev, Access_Code: "" }));
        }
    }, [formData.Role]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }

        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    const openModal = () => openCreate();
    const closeModal = () => {
        close();
    };

    const openEditModal = (item: StaffItem) => {
        openEdit(item);
    };

    const handleStatusChange = (isActive: boolean) => {
        setFormData((prev) => ({
            ...prev,
            Status: isActive ? "Active" : "Inactive",
        }));
    };

    const isFormValid = () => {
        if (!formData.Name.trim() || !formData.CNIC.trim()) return false;

        if (
            (formData.Role === "Cashier" || formData.Role === "Manager") &&
            (!formData.Access_Code || formData.Access_Code.length !== 4)
        ) {
            return false;
        }

        return true;
    };

    return {
        editingItem,
        isModalOpen: isOpen,
        formData,
        setFormData,
        openModal,
        closeModal,
        openEditModal,
        handleStatusChange,
        isFormValid,
    };
};