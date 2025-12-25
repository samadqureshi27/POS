// src/lib/hooks/useStaff.ts

import { useState, useEffect, useMemo } from "react";
import { StaffService, type TenantStaff } from "@/lib/services/staff-service";
import { toast } from "sonner";
import { logError } from "@/lib/util/logger";

export function useStaff(branchId?: string) {
  const [items, setItems] = useState<TenantStaff[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [roleFilter, setRoleFilter] = useState<string>("all");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<TenantStaff | null>(null);

  // Load staff members
  const loadStaff = async () => {
    try {
      setLoading(true);

      const response = await StaffService.listStaff({
        branchId: branchId || undefined,
        limit: 100,
      });

      if (response.success && response.data) {
        setItems(response.data);
      } else {
        throw new Error(response.message || "Failed to fetch staff members");
      }
    } catch (error) {
      logError("Error loading staff", error, {
        component: "useStaff",
        action: "loadStaff",
        branchId,
      });
      toast.error("Failed to load staff members");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter items based on search and filters
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const q = searchQuery.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        (item.fullName && item.fullName.toLowerCase().includes(q)) ||
        (item.email && item.email.toLowerCase().includes(q)) ||
        (item.position && item.position.toLowerCase().includes(q));

      const matchesStatus =
        statusFilter === "all" || item.status === statusFilter;

      const matchesRole =
        roleFilter === "all" || item.roles?.includes(roleFilter);

      return matchesQuery && matchesStatus && matchesRole;
    });
  }, [items, searchQuery, statusFilter, roleFilter]);

  // Get unique roles
  const roles = useMemo(() => {
    const uniqueRoles = new Set<string>();
    items.forEach(item => {
      if (item.roles && Array.isArray(item.roles)) {
        item.roles.forEach(role => uniqueRoles.add(role));
      }
    });
    return Array.from(uniqueRoles);
  }, [items]);

  // Calculate stats
  const stats = useMemo(() => {
    const totalStaff = items.length;
    const activeStaff = items.filter(item => item.status === "active").length;
    const inactiveStaff = items.filter(item => item.status === "inactive").length;
    const suspendedStaff = items.filter(item => item.status === "suspended").length;

    return {
      totalStaff,
      activeStaff,
      inactiveStaff,
      suspendedStaff,
    };
  }, [items]);

  // Create staff
  const handleCreateStaff = async (data: Partial<TenantStaff>) => {
    try {
      setActionLoading(true);

      const response = await StaffService.createStaff(data);

      if (response.success && response.data) {
        toast.success("Staff member added successfully");
        // Optimistic update: Add new staff to local state
        setItems(prevItems => [...prevItems, response.data]);
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(response.message || "Failed to add staff member");
      }
    } catch (error: any) {
      logError("Error creating staff", error, {
        component: "useStaff",
        action: "handleCreateStaff",
        branchId,
      });
      toast.error(error.message || "Failed to add staff member");
    } finally {
      setActionLoading(false);
    }
  };

  // Update staff
  const handleUpdateStaff = async (id: string, data: Partial<TenantStaff>) => {
    try {
      setActionLoading(true);
      const response = await StaffService.updateStaff(id, data);

      if (response.success && response.data) {
        toast.success("Staff member updated successfully");
        // Optimistic update: Update staff in local state
        setItems(prevItems => prevItems.map(item =>
          (item._id || item.id) === id ? { ...item, ...response.data } : item
        ));
        setIsModalOpen(false);
        setEditingItem(null);
      } else {
        throw new Error(response.message || "Failed to update staff member");
      }
    } catch (error: any) {
      logError("Error updating staff", error, {
        component: "useStaff",
        action: "handleUpdateStaff",
        branchId,
        staffId: id,
      });
      toast.error(error.message || "Failed to update staff member");
    } finally {
      setActionLoading(false);
    }
  };

  // Set PIN
  const handleSetPin = async (id: string, pin: string) => {
    try {
      setActionLoading(true);
      const response = await StaffService.setPin(id, pin, branchId);

      if (response.success) {
        toast.success("PIN set successfully");
        // Optimistic update: Update PIN in local state
        setItems(prevItems => prevItems.map(item =>
          (item._id || item.id) === id ? { ...item, pin } : item
        ));
      } else {
        throw new Error(response.message || "Failed to set PIN");
      }
    } catch (error: any) {
      logError("Error setting PIN", error, {
        component: "useStaff",
        action: "handleSetPin",
        branchId,
        staffId: id,
      });
      toast.error(error.message || "Failed to set PIN");
    } finally {
      setActionLoading(false);
    }
  };

  // Update status
  const handleUpdateStatus = async (id: string, status: "active" | "inactive" | "suspended") => {
    try {
      setActionLoading(true);
      const response = await StaffService.updateStatus(id, status, branchId);

      if (response.success) {
        toast.success("Status updated successfully");
        // Optimistic update: Update status in local state
        setItems(prevItems => prevItems.map(item =>
          (item._id || item.id) === id ? { ...item, status } : item
        ));
      } else {
        throw new Error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      logError("Error updating status", error, {
        component: "useStaff",
        action: "handleUpdateStatus",
        branchId,
        staffId: id,
      });
      toast.error(error.message || "Failed to update status");
    } finally {
      setActionLoading(false);
    }
  };

  // Modal handlers
  const openCreateModal = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const openEditModal = (item: TenantStaff) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Initialize: Load staff
  useEffect(() => {
    loadStaff();
  }, [branchId]);

  return {
    // State
    items,
    filteredItems,
    loading,
    actionLoading,
    stats,
    roles,

    // Filters
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,

    // Modal
    isModalOpen,
    editingItem,
    openCreateModal,
    openEditModal,
    closeModal,

    // Actions
    handleCreateStaff,
    handleUpdateStaff,
    handleSetPin,
    handleUpdateStatus,
    refreshData: loadStaff,
  };
}
