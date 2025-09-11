import { useState } from "react";
import { ModalState } from "@/lib/types/backup";

export const useModal = () => {
    const [modal, setModal] = useState<ModalState>({
        isOpen: false,
        title: "",
        message: "",
        onConfirm: () => { },
    });

    const showModal = (
        title: string,
        message: string,
        onConfirm: () => void,
        isDestructive = false,
        confirmText?: string
    ) => {
        setModal({
            isOpen: true,
            title,
            message,
            onConfirm,
            isDestructive,
            confirmText,
        });
    };

    const closeModal = () => {
        setModal((prev) => ({ ...prev, isOpen: false }));
    };

    return {
        modal,
        showModal,
        closeModal,
    };
};
